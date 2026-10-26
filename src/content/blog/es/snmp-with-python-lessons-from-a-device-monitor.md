---
title: "SNMP con Python: lo que aprendí construyendo un monitor de dispositivos"
description: "Lo que aprendí sondeando dispositivos de centro de datos por SNMP con pysnmp: el parámetro que para el walk al final de la tabla, las cuentas del timeout, reutilizar un engine (1,8 ms frente a 235 ms por GET) y compilar MIBs a JSON."
pubDate: 2026-10-26
tags: ["snmp", "python", "pysnmp", "monitoring", "dcim"]
draft: false
---

<!--
  OWNER NOTE (not rendered): mismas fuentes y medidas que la versión en inglés.
  Ningún código copiado de los repos de Bjumper; todo escrito desde cero contra
  pysnmp 7.1.30 / pysmi 2.0.0 y ejecutado el 2026-10-13 contra snmpsim 1.2.2.
  Revísalo y pon draft: false.
-->

En el trabajo construí una plataforma web que descubre dispositivos de red en un centro de datos y los sondea por SNMP, y unas herramientas que convierten los ficheros MIB de los fabricantes en definiciones de dispositivo para una plataforma DCIM. Las dos en Python. Este post reúne lo que me habría dicho a mí mismo antes de empezar, con código escrito desde cero para el post y tiempos medidos contra un simulador local.

El monitor usaba pysnmp 4.4 y su API síncrona. pysnmp va ya por la 7.x y su API es asyncio, así que los ejemplos usan la versión actual.

## Encuentra los dispositivos antes de recorrerlos

Un walk completo contra una dirección que no responde te cuesta todo el presupuesto de timeout, así que el descubrimiento funciona mejor como un embudo:

1. Haz ping a todo el rango en paralelo y quédate con los hosts que responden.
2. Manda a cada host vivo un único GET de `sysDescr.0` (`1.3.6.1.2.1.1.1.0`). Si responde, habla SNMP y tu community es correcta.
3. Solo entonces recorre las tablas que te interesan.

El GET es una petición y una respuesta. El walk son muchas.

## Un engine por proceso

`SnmpEngine` guarda el estado del protocolo que pysnmp necesita en cada petición. Mi primera versión creaba uno nuevo en cada llamada, y parece inofensivo. Medí las dos formas contra un simulador local, 200 GET cada una:

| Engine | Tiempo por GET |
|---|---|
| Un `SnmpEngine` compartido | 1,8 ms |
| Un `SnmpEngine` nuevo por GET | 235 ms |

Son unas 130 veces más lento por petición, antes de que la red sume nada. Crea el engine una vez y pásalo a todas partes.

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

`mpModel=1` selecciona SNMP v2c. Usa `0` para dispositivos v1, y `UsmUserData` en lugar de `CommunityData` para v3.

## Para el walk al final de la tabla

Un walk pide el siguiente OID una y otra vez. Por defecto, pysnmp sigue más allá del subárbol que pediste, hasta que el agente se queda sin OIDs. Al recorrer la columna `ifDescr` (`1.3.6.1.2.1.2.2.1.2`) en el simulador obtuve 2 filas con `lexicographicMode=False` y 16 sin él: los 2 nombres de interfaz más todos los valores de las siete columnas siguientes, de `ifType` a `ifLastChange`. Los datos del simulador acaban ahí. En un dispositivo real el walk sigue por todos los OIDs que vienen detrás.

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

Con v2c puedes usar GETBULK (`bulk_walk_cmd`), que pide hasta `maxRepetitions` filas por ida y vuelta en lugar de una. Con `maxRepetitions=25`, una tabla de 1.000 filas necesita unas 40 idas y vueltas en vez de 1.000. SNMP v1 no tiene GETBULK, así que los dispositivos v1 necesitan el walk normal.

## Haz las cuentas del timeout

Una petición a un host que nunca responde espera `timeout × (retries + 1)`. Con `timeout=5, retries=2`, un GET a una dirección inalcanzable tardó 15,4 segundos en mi prueba. Para un dispositivo da igual; para un escaneo de unos cientos es un desastre.

El monitor lo empeoraba. Mi código envolvía los reintentos de pysnmp en otro bucle de reintentos, así que un host caído costaba tres veces el presupuesto, unos 45 segundos por petición. Si añades tu propio bucle de reintentos, pon `retries` de pysnmp a 0, o al revés. Nunca los dos.

Lo que más ayudó fue la concurrencia. Con asyncio, cinco sondeos en paralelo cuestan lo mismo que uno: con `timeout=1, retries=1`, cuatro hosts caídos y uno vivo terminaron juntos en 2,0 segundos.

```python
import asyncio

hosts = ["192.0.2.1", "192.0.2.2", "192.0.2.3", "10.0.0.5"]
results = await asyncio.gather(*(probe(h) for h in hosts))
alive = [h for h, descr in zip(hosts, results) if descr]
```

Para rangos grandes, manda los sondeos por lotes para no abrir miles de sockets a la vez.

## Lee las MIBs como datos

Los OIDs en crudo son difíciles de manejar. Los ficheros MIB que publican los fabricantes describen cada OID: su nombre, su tipo y si es una columna de tabla. Mis herramientas los compilaban con [pysmi](https://github.com/lextudio/pysmi) a JSON, que cualquier paso posterior puede leer sin una librería SNMP.

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

Compilar `IF-MIB` trajo también sus cinco dependencias (`SNMPv2-SMI`, `SNMPv2-TC`, `SNMPv2-CONF`, `SNMPv2-MIB` e `IANAifType-MIB`). En la salida, `ifDescr` aparece como `column` en `1.3.6.1.2.1.2.2.1.2` con tipo `DisplayString`. Las MIBs de fabricante se importan unas a otras igual, así que apunta el compilador a una carpeta local con todas las MIBs que tengas, no solo la que quieres.

Para eso servían las definiciones de dispositivo: una plataforma DCIM necesita saber, para cada modelo, qué OIDs leer y qué significa cada valor. Las MIBs del fabricante ya lo describen, así que compilarlas era el primer paso con cada modelo nuevo.

## Prueba sin hardware

No necesitas un rack de dispositivos para probar nada de esto. [snmpsim](https://github.com/lextudio/snmpsim) responde peticiones SNMP a partir de ficheros de datos grabados. El monitor se probaba contra dispositivos simulados en Docker, y todas las cifras de este post salen de un simulador en mi portátil:

```bash
pip install snmpsim pysmi
snmpsim-command-responder --data-dir=./data --agent-udpv4-endpoint=127.0.0.1:1161
```

Puedes grabar un dispositivo real en un fichero de datos con `snmpsim-record-commands` y reproducirlo en tus tests, lo que además hace reproducibles los timeouts y los valores raros.

## Lo que haría desde el principio

- Ping, luego GET de `sysDescr.0`, luego walk.
- Crear un `SnmpEngine` y reutilizarlo.
- Recorrer siempre con `lexicographicMode=False`, y usar GETBULK en v2c.
- Mantener una sola capa de reintentos y conocer el peor tiempo por host.
- Lanzar los sondeos en paralelo y por lotes.
- Compilar las MIBs a JSON una vez y tratarlas como datos.
- Probar contra snmpsim antes de tocar hardware real.
