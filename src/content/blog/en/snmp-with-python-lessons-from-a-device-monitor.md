---
title: "SNMP with Python: lessons from building a device monitor"
description: "What I learned polling data-center devices over SNMP with pysnmp: the walk flag that stops at the table, the timeout maths, reusing one engine (1.8 ms vs 235 ms per GET) and compiling MIBs to JSON."
pubDate: 2026-10-13
tags: ["snmp", "python", "pysnmp", "monitoring", "dcim"]
draft: true
---

<!--
  OWNER NOTE (not rendered): built from your SNMP monitor and MIB tooling at
  Bjumper, described only in broad terms (confidentiality). No code is copied
  from those repos: every snippet was written from scratch against the public
  pysnmp 7.1.30 / pysmi 2.0.0 API and run on 2026-10-13 against a local
  snmpsim 1.2.2 simulator (its bundled public.snmprec). All timings below come
  from those runs. Review, then set draft: false.
-->

At work I built a web platform that discovers network devices in a data center and polls them over SNMP, plus tooling that turns vendor MIB files into device definitions for a DCIM platform. Both are in Python. This post collects what I would tell myself before starting, with code written from scratch for this post and timings measured against a local simulator.

The monitor ran on pysnmp 4.4 and its synchronous API. pysnmp is now at 7.x and its API is asyncio, so the examples below use the current version.

## Find the devices before you walk them

A full walk of an unreachable address costs you the whole timeout budget, so discovery works best as a funnel:

1. Ping the address range concurrently and keep the hosts that answer.
2. Send one cheap SNMP GET of `sysDescr.0` (`1.3.6.1.2.1.1.1.0`) to each live host. If it answers, it speaks SNMP and your community string works.
3. Only then walk the tables you care about.

The GET is a single request and response. The walk is many of them.

## One engine per process

`SnmpEngine` holds the protocol state that pysnmp needs for every request. My first version created a new one for each call, which looks harmless. I measured both ways against a local simulator, 200 GETs each:

| Engine | Time per GET |
|---|---|
| One shared `SnmpEngine` | 1.8 ms |
| A new `SnmpEngine` per GET | 235 ms |

That is about 130 times slower per request, before the network adds anything. Create the engine once and pass it everywhere.

```python
from pysnmp.hlapi.v3arch.asyncio import (
    CommunityData, ContextData, ObjectIdentity, ObjectType, SnmpEngine,
    UdpTransportTarget, bulk_walk_cmd, get_cmd, walk_cmd,
)

SYS_DESCR = "1.3.6.1.2.1.1.1.0"
engine = SnmpEngine()  # one engine for the whole process


async def target(host, port=161, timeout=1.0, retries=1):
    return await UdpTransportTarget.create((host, port), timeout=timeout, retries=retries)


async def probe(host, port=161, community="public"):
    """Cheap reachability check: one GET of sysDescr.0."""
    err_ind, err_status, _, var_binds = await get_cmd(
        engine, CommunityData(community, mpModel=1), await target(host, port),
        ContextData(), ObjectType(ObjectIdentity(SYS_DESCR)),
    )
    if err_ind or err_status:
        return None
    return str(var_binds[0][1])
```

`mpModel=1` selects SNMP v2c. Use `0` for v1 devices, and `UsmUserData` instead of `CommunityData` for v3.

## Stop the walk at the end of the table

A walk asks for the next OID again and again. By default pysnmp keeps going past the subtree you asked for, until the agent runs out of OIDs. Walking the `ifDescr` column (`1.3.6.1.2.1.2.2.1.2`) on the simulator returned 2 rows with `lexicographicMode=False` and 16 without it: the 2 interface names plus every value of the next seven columns, `ifType` to `ifLastChange`. The simulator's data ends there. On a real device the walk carries on through every OID that follows.

```python
async def walk(host, oid, port=161, community="public", bulk=False):
    cmd = bulk_walk_cmd if bulk else walk_cmd
    extra = (0, 25) if bulk else ()  # nonRepeaters, maxRepetitions
    rows = {}
    async for err_ind, err_status, _, var_binds in cmd(
        engine, CommunityData(community, mpModel=1), await target(host, port),
        ContextData(), *extra, ObjectType(ObjectIdentity(oid)),
        lexicographicMode=False,
    ):
        if err_ind or err_status:
            raise RuntimeError(str(err_ind or err_status.prettyPrint()))
        for name, value in var_binds:
            rows[str(name)] = str(value)
    return rows
```

With v2c you can use GETBULK (`bulk_walk_cmd`), which asks for up to `maxRepetitions` rows per round trip instead of one. With `maxRepetitions=25`, a table of 1,000 rows takes about 40 round trips instead of 1,000. SNMP v1 has no GETBULK, so v1 devices need the plain walk.

## Do the timeout maths

A request to a host that never answers waits for `timeout × (retries + 1)`. With `timeout=5, retries=2`, a GET to an unreachable address took 15.4 seconds in my test. That is fine for one device and a disaster for a scan of a few hundred.

The monitor made it worse. My code wrapped pysnmp's own retries in another retry loop, so a dead host cost three times the budget, around 45 seconds per request. If you add your own retry loop, set pysnmp's `retries` to 0, or the other way round. Never both.

What helped most was concurrency. With asyncio, five probes run in parallel cost the same as one: with `timeout=1, retries=1`, four dead hosts and one live one finished in 2.0 seconds together.

```python
import asyncio

hosts = ["192.0.2.1", "192.0.2.2", "192.0.2.3", "10.0.0.5"]
results = await asyncio.gather(*(probe(h) for h in hosts))
alive = [h for h, descr in zip(hosts, results) if descr]
```

For large ranges, send the probes in batches so you never open thousands of sockets at once.

## Read the MIBs as data

Raw OIDs are hard to work with. The MIB files that vendors publish describe each OID: its name, type and whether it is a table column. My tooling compiled them with [pysmi](https://github.com/lextudio/pysmi) into JSON, which any later step can read without an SNMP library.

```python
from pysmi.codegen import JsonCodeGen
from pysmi.compiler import MibCompiler
from pysmi.parser import SmiStarParser
from pysmi.reader import HttpReader
from pysmi.writer import FileWriter

compiler = MibCompiler(SmiStarParser(), JsonCodeGen(), FileWriter("json").set_options(suffix=".json"))
compiler.add_sources(HttpReader("https://mibs.pysnmp.com/asn1/@mib@"))
compiler.compile("IF-MIB")
```

Compiling `IF-MIB` also pulled in its five dependencies (`SNMPv2-SMI`, `SNMPv2-TC`, `SNMPv2-CONF`, `SNMPv2-MIB` and `IANAifType-MIB`). In the output, `ifDescr` comes out as a `column` at `1.3.6.1.2.1.2.2.1.2` with type `DisplayString`. Vendor MIBs import each other the same way, so point the compiler at a local folder with every MIB you have, not just the one you want.

That was the point of the device definitions: a DCIM platform needs to know, for each device model, which OIDs to read and what each value means. The vendor's MIBs already describe that, so compiling them was the first step of every new model.

## Test without hardware

You don't need a rack of devices to test any of this. [snmpsim](https://github.com/lextudio/snmpsim) answers SNMP requests from recorded data files. The monitor ran against simulated devices in Docker, and every number in this post comes from a simulator on my laptop:

```bash
pip install snmpsim pysmi
snmpsim-command-responder --data-dir=./data --agent-udpv4-endpoint=127.0.0.1:1161
```

You can record a real device into a data file with `snmpsim-record-commands` and replay it in your tests, which also makes timeouts and odd values reproducible.

## What I would do from the start

- Ping, then GET `sysDescr.0`, then walk.
- Create one `SnmpEngine` and reuse it.
- Always walk with `lexicographicMode=False`, and use GETBULK on v2c.
- Keep one retry layer and know your worst-case time per host.
- Run probes concurrently, in batches.
- Compile MIBs to JSON once and treat them as data.
- Test against snmpsim before you touch real hardware.
