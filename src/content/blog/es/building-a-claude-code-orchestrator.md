---
title: "Construir una capa de orquestación para Claude Code: una retrospectiva honesta"
description: "Quería 5–10 agentes trabajando en paralelo, repartiéndose el trabajo y hablando entre ellos. Lanzaba uno solo, gastaba muchos más tokens, iba más lento y las skills ni siquiera se cargaban. Esto es lo que salió mal, por qué, y el flujo iterativo que adopté en su lugar."
pubDate: 2026-06-18
tags: ["claude-code", "ai-agents", "orchestration", "developer-tools", "retrospective"]
draft: false
heroImage: "/images/blog/orchestration.svg"
heroImageAlt: "Diagrama abstracto: un nodo lead que se ramifica en agentes paralelos que convergen en un único resultado"
---

<!-- Traducción al español del post en inglés (src/content/blog/en). Las cifras
     112k / ~278k son reales (planes 007/017 de poneglyph); revisar antes de publicar. -->

Durante un tiempo, el eje central de mi trabajo con [Claude Code](https://www.anthropic.com/claude-code) era una capa de orquestación que estaba construyendo encima. La idea parecía el siguiente nivel evidente: en vez de un único asistente resolviendo una tarea, que la partiera en piezas atómicas y lanzara **cinco o diez agentes en paralelo** — cada uno con su contexto enfocado, cada uno dueño de una parte bien definida, hablando entre ellos para coordinarse. Más rendimiento, menos contexto inflado, resultados más rápidos.

Hizo lo contrario de las tres cosas. Costó más, fue más lento y bajó la calidad. Esta es la versión honesta.

## El sueño

Lo que buscaba era un equipo, no una herramienta. Un «lead» planificaría el trabajo y lo repartiría; las piezas independientes correrían como agentes separados a la vez; cada agente tendría un contexto aislado para que la conversación principal quedara limpia; y se comunicarían para encajar las partes que dependen unas de otras. Sobre el papel, así es como conviertes a un único asistente en algo que escala.

Claude Code te da las piezas: **subagentes** para delegar, **skills** para instrucciones reutilizables y **hooks** para scripts disparados por eventos. Las cableé en una lógica que decidía cuándo dividir el trabajo y qué skill usar en cada paso.

## Lo que pasó en realidad

La realidad, con mis propias palabras de entonces:

> Creía que el siguiente nivel era tener 5 o 10 agentes en paralelo para ir mucho más rápido, pero tiene muchas pegas. No hay comunicación entre ellos. Muchas veces la sesión principal quería hacer el trabajo y tenía que forzarme a cambiar mi forma de trabajar — y cuando lo conseguía, solo se invocaba un agente, así que gastaba más tokens, muchos más, y no mejoraba nada: más lento, más caro, menos calidad. Al final los quité todos.

En concreto, se rompieron cuatro cosas:

- **Se serializaba en un solo agente.** Donde yo esperaba un reparto en paralelo, el sistema seguía lanzando *un* agente y esperándolo. Sin concurrencia, sin ganancia de velocidad — solo una capa extra entre el trabajo y yo.
- **El coste en tokens se multiplicaba.** Cada delegación reenvía el contexto al agente y resume el resultado de vuelta. Una sola ejecución delegada de una skill costó ~112k tokens y más de ocho minutos para *cero* paralelismo, gran parte releyendo ficheros que la sesión principal ya tenía. Otra vez, un panel de revisión que lancé tarde quemó ~278k tokens y no devolvió nada, porque los agentes llegaron al límite de sesión antes de emitir un veredicto.
- **Los agentes no podían hablar entre ellos.** Lo único de lo que dependía mi idea de «equipo» — la coordinación — no estaba realmente.
- **Las skills no se activaban.** Los agentes ignoraban la skill que debía gobernar un paso. La ironía llegó al máximo cuando me di cuenta de que la skill de orquestación *que debía dirigirlo todo* a menudo no se cargaba — el comportamiento solo ocurría porque también la había escrito en la configuración que se carga siempre.

## Por qué falló

La parte interesante es el diagnóstico, porque los síntomas tienen causas raíz *distintas*. Meterlos todos en «los agentes no funcionan» lo oculta.

**El cuello de botella del resumen.** Cuando un agente escribe código y devuelve un resumen, el detalle se pierde en ese resumen. El lead tiene entonces que revisar código que nunca «vio nacer». Para el trabajo de escritura, la calidad baja *por diseño* — no por una mala invocación.

**La economía del contexto.** Cada agente vuelve a pagar el coste de orientarse. Un reparto de cinco paga cinco veces el contexto que la sesión principal ya tenía amortizado. El aislamiento ayuda a quien *lee*; penaliza a quien *escribe*.

**Las skills son no deterministas a propósito.** Claude Code no elige una skill desde un índice — el modelo empareja semánticamente tu petición con la descripción de cada skill, y tiende a *infra*-disparar. Ningún mecanismo fuerza la activación; un hook solo puede empujar. Y una skill cargada en la sesión principal **no se traslada a un subagente** — así que mis agentes delegados arrancaban sin las instrucciones que justamente necesitaban. Mi solución de entonces (reglas que decían a los agentes que leyeran los ficheros de skill a mano) era la opción de menor impacto disponible. La de mayor impacto, que descubrí después, es casi vergonzosa: escribir descripciones más directivas («Use when…», con disparadores concretos). Ese único cambio mueve la activación más que cualquier hook.

**Y el replanteamiento que lo reordenó todo:** aunque diez agentes *sí* generaran código en paralelo, el cuello de botella del sistema soy *yo*. Priorizar la calidad significa que reviso y decido en serie. Paralelizar la generación no acelera el sistema — solo me mueve la cola a mí. Estaba optimizando la parte que no era la restricción.

## Lo que no pude hacer: medirlo

Quiero ser honesto sobre una carencia. Concluí «costó más» porque era *evidente*, no porque lo midiera con limpieza. Renuncié a medir más de una vez. Y ese es el problema de verdad difícil: estos sistemas son no deterministas, así que la misma tarea delegada dos veces no cuesta ni se comporta igual, y un antes/después limpio cuesta de fijar. Voy a necesitar esa instrumentación igualmente — decidir por doctrina en vez de por datos solo funciona hasta que la doctrina se equivoca.

## Lo que cambié

Dejé de intentar que los agentes hicieran la escritura. El sistema ahora funciona con dos reglas:

1. **Inline primero.** Todo el trabajo de construcción y escritura ocurre en la sesión principal, con ediciones directas. Un solo agente nunca compensa. Los agentes se reservan para trabajo genuinamente paralelo y *de solo lectura*, y solo cuando hay suficientes unidades independientes que lo justifiquen.
2. **Un flujo estructurado e iterativo en lugar de un enjambre.** El trabajo pasa por fases explícitas — alcance, plan, diseño de validaciones, build, revisión, retrospectiva — cada una con una puerta humana. Más lento por paso sobre el papel, pero converge, es depurable y no quema tokens reexplicándose. (La trampa aquí es la ceremonia: un flujo de muchos pasos puede sobre-procesar una tarea pequeña. El arreglo es un triaje adaptativo — ajustar el peso del proceso al tamaño del trabajo.)

## Lo que sí funcionó

No todo en los agentes falló — los había apuntado a la mitad equivocada del problema. La mitad que funciona *hoy* es la de solo lectura, la de verificación. Repartir revisores independientes y hacer que un agente intente *refutar* el hallazgo de otro pilló errores reales todas y cada una de las veces que lo ejecuté: cifras mal, números desactualizados, una afirmación mal citada. Esa verificación adversarial no es ceremonia — es donde vive de verdad el rigor. Un revisor independiente con contexto fresco cambió resultados reales en vez de limitarse a dar el visto bueno. Ahí el paralelismo es casi gratis, y mejora el resultado.

## Hacia dónde creo que va esto

No he renunciado a la idea del equipo — agentes que se reparten el trabajo y se comunican sigue siendo la versión del futuro por la que apostaría. Pero seré honesto sobre su estado: es la parte *menos* madura ahora mismo. La comunicación entre agentes es mínima, los agentes aún no pueden asumir roles especializados ni delegar más, y todo el modo es experimental y caro. Así que mi plan no es forzarlo. Es mantener la escritura inline, dejar que los agentes hagan la lectura y la verificación donde ya brillan, instrumentar el coste para *ver* cuándo compensa delegar — y retomar el modelo de equipo cuando la herramienta, y mis mediciones, estén listas.
