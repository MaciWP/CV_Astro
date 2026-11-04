---
title: "SNMP mit Python: Erkenntnisse aus dem Bau eines Device-Monitors"
description: "SNMP mit pysnmp auf Rechenzentrums-Geräten: das Walk-Flag, das am Tabellenende stoppt, Timeout-Rechnung, eine wiederverwendete Engine (1,8 ms statt 235 ms) und MIBs als JSON."
pubDate: 2026-10-26
tags: ["snmp", "python", "pysnmp", "monitoring", "dcim"]
draft: false
---

<!-- Deutsche Übersetzung des englischen Beitrags (src/content/blog/en). KI-Übersetzung, vom Autor noch nicht geprüft. -->

Bei der Arbeit habe ich eine Webplattform gebaut, die Netzwerkgeräte in einem Rechenzentrum erkennt und per SNMP abfragt, dazu Tooling, das Hersteller-MIB-Dateien in Gerätedefinitionen für eine DCIM-Plattform umwandelt. Beides in Python. Dieser Beitrag sammelt, was ich mir vor dem Start gern selbst gesagt hätte, mit Code, der eigens für diesen Beitrag von Grund auf geschrieben wurde, und Messwerten gegen einen lokalen Simulator.

Der Monitor lief auf pysnmp 4.4 mit der synchronen API. pysnmp ist inzwischen bei 7.x und die API basiert auf asyncio, deshalb verwenden die Beispiele unten die aktuelle Version.

## Geräte finden, bevor man sie walkt

Ein vollständiger Walk auf eine nicht erreichbare Adresse kostet das gesamte Timeout-Budget. Die Erkennung funktioniert daher am besten als Trichter:

1. Den Adressbereich parallel anpingen und die Hosts behalten, die antworten.
2. An jeden erreichbaren Host einen einzigen, günstigen SNMP-GET auf `sysDescr.0` (`1.3.6.1.2.1.1.1.0`) schicken. Antwortet er, spricht er SNMP und der Community-String funktioniert.
3. Erst dann die gewünschten Tabellen walken.

Der GET ist eine einzige Anfrage mit einer Antwort. Der Walk besteht aus vielen davon.

## Eine Engine pro Prozess

`SnmpEngine` hält den Protokollzustand, den pysnmp für jede Anfrage braucht. Meine erste Version hat für jeden Aufruf eine neue erzeugt, was harmlos aussieht. Ich habe beide Varianten gegen einen lokalen Simulator gemessen, je 200 GETs:

| Engine | Zeit pro GET |
|---|---|
| Eine gemeinsame `SnmpEngine` | 1,8 ms |
| Eine neue `SnmpEngine` pro GET | 235 ms |

Das ist rund 130-mal langsamer pro Anfrage, noch bevor das Netzwerk etwas dazutut. Die Engine einmal erzeugen und überall weiterreichen.

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

`mpModel=1` wählt SNMP v2c. Für v1-Geräte `0` verwenden, für v3 `UsmUserData` statt `CommunityData`.

## Den Walk am Tabellenende stoppen

Ein Walk fragt immer wieder nach der nächsten OID. Standardmäßig läuft pysnmp über den angefragten Teilbaum hinaus weiter, bis dem Agent die OIDs ausgehen. Ein Walk über die Spalte `ifDescr` (`1.3.6.1.2.1.2.2.1.2`) auf dem Simulator lieferte 2 Zeilen mit `lexicographicMode=False` und 16 ohne: die 2 Interface-Namen plus alle Werte der nächsten sieben Spalten, von `ifType` bis `ifLastChange`. Dort enden die Daten des Simulators. Auf einem echten Gerät läuft der Walk durch jede weitere OID, die folgt.

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

Mit v2c lässt sich GETBULK (`bulk_walk_cmd`) nutzen, das pro Roundtrip bis zu `maxRepetitions` Zeilen statt nur einer abfragt. Mit `maxRepetitions=25` braucht eine Tabelle mit 1.000 Zeilen rund 40 Roundtrips statt 1.000. SNMP v1 kennt kein GETBULK, v1-Geräte brauchen also den einfachen Walk.

## Die Timeout-Rechnung machen

Eine Anfrage an einen Host, der nie antwortet, wartet `timeout × (retries + 1)`. Mit `timeout=5, retries=2` brauchte ein GET an eine nicht erreichbare Adresse in meinem Test 15,4 Sekunden. Für ein einzelnes Gerät ist das in Ordnung, für einen Scan über einige hundert eine Katastrophe.

Der Monitor machte es noch schlimmer. Mein Code hatte die eigenen Retries von pysnmp in eine weitere Retry-Schleife gepackt, sodass ein toter Host das Dreifache des Budgets kostete, etwa 45 Sekunden pro Anfrage. Wer eine eigene Retry-Schleife baut, setzt `retries` von pysnmp auf 0, oder umgekehrt. Niemals beides.

Am meisten half Nebenläufigkeit. Mit asyncio kosten fünf parallele Probes so viel wie eine: Mit `timeout=1, retries=1` waren vier tote Hosts und ein lebender zusammen in 2,0 Sekunden fertig.

```python
import asyncio

hosts = ["192.0.2.1", "192.0.2.2", "192.0.2.3", "10.0.0.5"]
results = await asyncio.gather(*(probe(h) for h in hosts))
alive = [h for h, descr in zip(hosts, results) if descr]
```

Bei großen Bereichen die Probes in Batches senden, damit nie Tausende Sockets gleichzeitig offen sind.

## MIBs als Daten lesen

Rohe OIDs sind mühsam zu handhaben. Die von Herstellern veröffentlichten MIB-Dateien beschreiben jede OID: Name, Typ und ob sie eine Tabellenspalte ist. Mein Tooling hat sie mit [pysmi](https://github.com/lextudio/pysmi) zu JSON kompiliert, das jeder spätere Schritt ohne SNMP-Bibliothek lesen kann.

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

Das Kompilieren von `IF-MIB` zog auch deren fünf Abhängigkeiten nach (`SNMPv2-SMI`, `SNMPv2-TC`, `SNMPv2-CONF`, `SNMPv2-MIB` und `IANAifType-MIB`). In der Ausgabe erscheint `ifDescr` als `column` unter `1.3.6.1.2.1.2.2.1.2` mit dem Typ `DisplayString`. Hersteller-MIBs importieren sich gegenseitig auf dieselbe Weise, deshalb den Compiler auf einen lokalen Ordner mit allen vorhandenen MIBs richten, nicht nur auf die gewünschte.

Genau darum ging es bei den Gerätedefinitionen: Eine DCIM-Plattform muss pro Gerätemodell wissen, welche OIDs zu lesen sind und was jeder Wert bedeutet. Die MIBs des Herstellers beschreiben das bereits, also war ihr Kompilieren der erste Schritt bei jedem neuen Modell.

## Ohne Hardware testen

Für all das braucht man keinen Rack voller Geräte. [snmpsim](https://github.com/lextudio/snmpsim) beantwortet SNMP-Anfragen aus aufgezeichneten Datendateien. Der Monitor lief in Docker gegen simulierte Geräte, und jede Zahl in diesem Beitrag stammt von einem Simulator auf meinem Laptop:

```bash
pip install snmpsim pysmi
snmpsim-command-responder --data-dir=./data --agent-udpv4-endpoint=127.0.0.1:1161
```

Mit `snmpsim-record-commands` lässt sich ein echtes Gerät in eine Datendatei aufzeichnen und in den Tests wiedergeben. Das macht auch Timeouts und ungewöhnliche Werte reproduzierbar.

## Was ich von Anfang an so machen würde

- Ping, dann GET auf `sysDescr.0`, dann walken.
- Eine einzige `SnmpEngine` erzeugen und wiederverwenden.
- Immer mit `lexicographicMode=False` walken und bei v2c GETBULK nutzen.
- Nur eine Retry-Ebene haben und die Worst-Case-Zeit pro Host kennen.
- Probes nebenläufig und in Batches ausführen.
- MIBs einmal zu JSON kompilieren und als Daten behandeln.
- Gegen snmpsim testen, bevor man echte Hardware anfasst.

Ebenfalls in diesem Blog: [Claude Code Hooks: aus geschriebenen Regeln Regeln machen, die der Agent nicht überspringen kann](/de/blog/claude-code-hooks-that-enforce-the-rules).
