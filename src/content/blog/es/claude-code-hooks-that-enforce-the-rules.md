---
title: "Hooks de Claude Code: convertir reglas escritas en reglas que el agente no puede saltarse"
description: "Mi configuración de Claude Code ignoraba sus reglas escritas. Medí cuánto y pasé las más caras a hooks. Qué mostraron los números y el hook que me bloqueó a mí."
pubDate: 2026-10-26
tags: ["claude-code", "hooks", "ai-agents", "developer-tools"]
draft: false
---

<!--
  OWNER NOTE (not rendered): mismas fuentes que la versión en inglés: las
  cabeceras de los hooks en el repo poneglyph (.claude/hooks/*.ts), medidas
  sobre 14 días de tus transcripciones. Revisa y pon draft: false.
-->

Después de [mi experimento de orquestación](/es/blog/building-a-claude-code-orchestrator) me quedé con una cosa: una capa personal encima de [Claude Code](https://www.anthropic.com/claude-code) que llamo Poneglyph. Es [pública en GitHub](https://github.com/MaciWP/poneglyph). Tiene un `CLAUDE.md` con mis reglas de trabajo, un estilo de respuesta, 21 skills y unos cuantos hooks. Este post va de los hooks, porque son lo que de verdad ha cambiado cómo se comporta el agente.

## Las reglas escritas son sugerencias

Mi `CLAUDE.md` dice cosas como «responde a cada sugerencia de skill antes de empezar», «escribe las notas de progreso en español» o «pregunta las decisiones con la herramienta de preguntas». Daba por hecho que el modelo las cumplía. Luego lo conté sobre 14 días de transcripciones reales:

| Regla | Cuántas veces se cumplió |
|---|---|
| Responder al router de skills antes de empezar | 39 % |
| Notas de progreso en español | 80 % |
| Cargar la skill de configuración antes de tocar configuración | 62 % |
| Preguntar decisiones con la herramienta de preguntas | ~20 % |

Y lo peor: en 36 de los 60 fallos de la primera regla, el modelo ya había leído la nota que estaba ignorando. Añadir más texto al prompt no lo iba a arreglar. Así que dejé de escribir reglas y empecé a preguntarme lo mismo con cada una: ¿lo puede comprobar un script?

## Hooks que ahorran dinero

Los primeros hooks fueron de coste, porque el coste se mide fácil.

**Ejecuciones en segundo plano con el modelo equivocado.** El 3 de septiembre de 2026 mi sesión principal lanzó 82 ejecuciones de `claude -p` en un día. 44 fueron con Opus porque nadie pasó `--model`, y 29 con Fable a propósito. La regla «usa el modelo barato para el trabajo de fondo» ya estaba escrita. Ahora `headless-model-gate.ts` revisa cada `claude -p` antes de que se ejecute.

**Subagentes que pasan el escalón de precio.** Haiku cobra a 5x una petición cuyo prompt pasa de 100k tokens. En 14 días, el 13 % de mis peticiones de subagentes con Haiku lo pasaron, la mayor con 248k. `haiku-context-brake.ts` recorta una lectura de fichero que llevaría al agente por encima de 90k, y Haiku ahora compacta cerca de 87k.

**Contexto lleno de ficheros enteros.** Los resultados de herramientas eran el 56 % del contexto de la conversación. Los comandos más pesados eran `cat` (365k caracteres, incluido el mismo plan de 28 KB leído cuatro veces en una sesión) y `sed -n` (273k). `bash-output-shaper.ts` evita que entren en el contexto ficheros completos y listados sin límite.

## Hooks que bloquean

Algunas reglas protegen cosas que no puedo deshacer. La más clara: el agente solo hace push, abre pull requests, mergea o borra ramas remotas si se lo he pedido en el mensaje actual. `remote-git-gate.ts` lee mi último mensaje y, si no lo encuentra, bloquea el comando.

Funciona, y hoy se ha pasado de estricto conmigo. Mientras publicaba esta web aprobé un merge eligiendo una opción en la herramienta de preguntas, y el hook lo bloqueó: solo lee lo que escribo. Luego escribí «abre las PR» y también lo bloqueó, porque esperaba el singular «abre la PR». Tuve que escribir la frase exacta. Un control que bloquea a la persona a la que protege tiene un fallo: debería entender lo que quiero decir, y hoy solo compara palabras exactas. Lo dejo estricto hasta arreglarlo bien, porque un control demasiado permisivo es peor.

No todos los hooks deben bloquear. `security-gate.ts` busca secretos en los ficheros que acaban de cambiar y solo avisa. Un falso positivo pararía el trabajo sin motivo, y con un aviso me basta para revisarlo.

## Elegir skills con un modelo barato

Con 21 skills, el agente tiene que saber cuál encaja con cada mensaje. Mi primer intento usaba palabras clave. En una evaluación con casos reservados sacó 0,07, con falsos positivos. Ahora `prompt-router.ts` manda cada mensaje a un modelo barato, en paralelo, mientras el modelo principal ya trabaja. Devuelve hasta tres skills y corrige palabras mal transcritas al dictar. En la misma evaluación saca alrededor de 0,8.

## Lo que le diría a quien empieza

- Cuenta antes de escribir una regla. Mis transcripciones mostraron qué reglas fallaban, y no eran las que esperaba.
- Pasa una regla a un hook solo si un script puede comprobarla de forma barata y fiable. El resto se queda como texto.
- Decide para cada hook si avisa o bloquea. Bloquea solo lo que no se puede deshacer.
- Prueba el control contigo mismo. El mío me enseñó que tiene que aceptar todas las formas en que doy una orden, no una sola frase.
