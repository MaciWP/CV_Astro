---
title: "Agentic OS: tres decisiones detrás de una cabina para varios agentes de código"
description: "Trabajo con Claude Code, Codex y Grok a la vez, así que hice una app local que me dice cuál me necesita. Por qué las terminales viven en su propio proceso, por qué el estado del agente sale de los ficheros del propio harness y por qué cada dato tiene un único dueño."
pubDate: 2026-11-09
tags: ["ai-agents", "claude-code", "typescript", "bun", "architecture"]
draft: true
---

<!--
  OWNER NOTE (not rendered): translation of the en post; same sources
  (MaciWP/agentic-os README.md and ADRs 0003, 0008 and 0013, read on
  2026-10-26). Set pubDate with the en post. Check the first two paragraphs:
  they describe your day in your voice.
-->

En un día normal tengo varios agentes de código trabajando a la vez: Claude Code con un ticket, Codex con otro y un tercero revisando una pull request. Cada uno corre en su terminal y cada uno se para de vez en cuando a esperarme. Lo que me costaba tiempo era averiguar cuál había terminado, cuál me pedía un permiso y cuál seguía trabajando.

Por eso hice [Agentic OS](https://github.com/MaciWP/agentic-os), una app local que reúne en una ventana mis tickets, las pull requests, las notas, los prompts guardados y las terminales de los agentes. Responde a una pregunta: ¿qué necesita mi atención ahora? Es una app de un solo usuario en `localhost`, hecha con Bun, Hono, SQLite y React 19, y cada decisión de arquitectura tiene su ADR en el repo, 16 hasta ahora. Tres de ellas marcaron todo lo demás.

## 1. Las terminales viven en su propio proceso

Una PTY que vive dentro del servidor web muere con él, y mientras trabajo en la app, `bun --watch` reinicia el servidor cada vez que guardo. Perder todos los agentes en cada guardado no era aceptable.

Por eso las terminales pertenecen a un proceso aparte, el host de PTY. El servidor lo arranca separado, en su propia sesión, para que un Ctrl+C en el servidor nunca le llegue, y el siguiente servidor lo reutiliza. El host solo escucha en 127.0.0.1, cada petición necesita su token y rechaza cualquier petición que traiga cabecera `Origin`, así que ninguna página web puede llegar a él. Cuando el servidor se reinicia, sea por `bun --watch`, por un Ctrl+C o por un fallo, los agentes siguen trabajando y el navegador se vuelve a conectar.

La reconexión fue lo que más cuidado pidió. El host guarda cada pantalla en un `@xterm/headless` en el servidor, con 5.000 líneas. La salida, los cambios de tamaño y las conexiones pasan por una sola cola por terminal, así que una conexión nueva serializa la pantalla en ese momento y después reenvía todo lo que llega. Una ventana nueva no tiene huecos ni duplicados. Un separador retiene una secuencia de escape o un carácter UTF-8 que llegue a medias hasta que esté completo, para que una captura nunca parta un carácter por la mitad.

El navegador nunca envía una ruta ni un comando. Envía el id de un harness y el de una ubicación, y el servidor los convierte en un argv fijo y en una carpeta resuelta con `realpath`. Abrir el WebSocket exige un Host y un Origin exactos, porque los navegadores no aplican CORS a los WebSockets, y después un token de un solo uso: 32 bytes aleatorios, válido 30 segundos y ligado a la terminal y al Origin.

El ADR también deja escrito lo que esto no me da. Las terminales sobreviven a un reinicio del servidor, pero no a uno del host. La carpeta de trabajo es solo donde arranca el agente y no aísla nada: las terminales de agentes corren saltándose los permisos, y la interfaz lo avisa.

## 2. El estado del agente sale de los ficheros del propio harness

Al principio la app adivinaba si un agente trabajaba contando los bytes que escribía. Los bytes dicen cuándo está ocupada la terminal, y eso es una pista muy vaga de lo que hace el agente.

Ahora el servidor lee lo que cada harness ya escribe sobre sí mismo, y no inyecta nada al lanzarlo. Para Claude Code es `~/.claude/sessions/<pid>.json`. Para Codex es el fichero de sesión de `~/.codex/sessions` que el proceso de la terminal tiene abierto, y lo encuentra con una sola llamada a `lsof` para todos los Codex en marcha. Eso sustituyó a un emparejamiento por carpeta y hora de inicio, que dejaba sin sesión a varias terminales de Codex en la misma carpeta y no veía las reanudadas.

El resultado son tres estados: `working`, `needs_you` y desconocido. El desconocido vuelve al recuento de bytes de antes. Los límites también están escritos. Codex no registra cuándo pide una aprobación, así que un Codex esperando un permiso aparece como trabajando. Grok no tiene de dónde leer su estado y se queda en desconocido.

Los mismos ficheros dan el id de sesión, que sigue a `/clear`. Es el id que la app reanuda después de reiniciar el host, así que la terminal del agente vuelve donde estaba.

## 3. Cada dato tiene un único dueño

Una revisión de arquitectura de la app encontró estado sin un dueño claro: doce ficheros web que leían y escribían en el almacenamiento del navegador con nombres sin prefijo, variables a nivel de módulo y tablas de SQLite que escribían dos procesos. Un dato con dos escritores acaba desincronizado, y uno sin dueño declarado acaba teniendo un segundo escritor por accidente.

La regla desde entonces: un módulo es dueño de cada dato y es el único código que lo escribe. Todo lo demás lo lee con las funciones del dueño, o por HTTP cuando vive en otro proceso. El servidor tiene la verdad y el navegador guarda cachés y preferencias, así que perder el almacenamiento del navegador cuesta una preferencia, nunca un registro. Cada clave del almacenamiento del navegador se declara una vez, con un esquema de zod y un valor por defecto, y leerla nunca lanza un error. Los secretos solo viven en el Llavero de macOS, y el host de PTY nunca llega a ellos.

Una regla así solo se cumple si algo la comprueba, así que un test vigila las reglas del almacenamiento del navegador y de los stores, y lista los ficheros que aún no se han migrado.

## Lo que mantendría

La costumbre que mantendría es escribir un ADR por decisión. Cada uno recoge las opciones que descartó y por qué, y lo que la decisión no da, como los límites de arriba. Cuando una opción descartada vuelve a parecer buena idea, el razonamiento ya está escrito.

El repo tiene 1.839 tests unitarios y 44 specs end-to-end con Playwright, y `bun run check` ejecuta la comprobación de tipos, Biome y los tests unitarios. El código se puede leer en [github.com/MaciWP/agentic-os](https://github.com/MaciWP/agentic-os).
