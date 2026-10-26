---
title: "Construir una capa de orquestación para Claude Code: una retrospectiva honesta"
description: "Quería 5–10 agentes en paralelo. Arrancó uno solo, gastó muchos más tokens y las skills no se cargaban. Qué salió mal, por qué y el flujo que uso ahora."
pubDate: 2026-06-18
tags: ["claude-code", "ai-agents", "orchestration", "developer-tools", "retrospective"]
draft: false
heroImage: "/images/blog/orchestration.svg"
heroImageAlt: "Diagrama abstracto: un nodo lead que se ramifica en agentes paralelos que convergen en un único resultado"
---

<!-- Traducción al español del post en inglés (src/content/blog/en). Las cifras
     112k / ~278k son reales (planes 007/017 de poneglyph); revisar antes de publicar. -->

Durante un tiempo, casi todo mi trabajo con [Claude Code](https://www.anthropic.com/claude-code) giraba alrededor de una capa de orquestación que estaba construyendo encima. El siguiente paso parecía evidente. En vez de un único asistente resolviendo una tarea, la capa partiría el trabajo en piezas pequeñas y lanzaría **cinco o diez agentes en paralelo**. Cada agente tendría su propio contexto y su propia parte del trabajo, y hablarían entre ellos para coordinarse. Esperaba más rendimiento, menos contexto inflado y resultados más rápidos.

Conseguí lo contrario en las tres cosas. Costó más, fue más lento y bajó la calidad. Esto es lo que pasó.

## El plan

Quería un equipo. Un agente «lead» planificaría el trabajo y lo repartiría. Las piezas independientes correrían a la vez como agentes separados, cada uno con un contexto aislado para que la conversación principal quedara limpia, y se pasarían el trabajo allí donde una pieza dependiera de otra. Sobre el papel, así un único asistente se convierte en algo que escala.

Claude Code tiene las piezas: **subagentes** para delegar, **skills** para instrucciones reutilizables y **hooks** para scripts que se ejecutan con eventos. Las conecté en una lógica que decidía cuándo dividir el trabajo y qué skill usar en cada paso.

## Lo que pasó en realidad

Así lo conté entonces:

> Creía que el siguiente nivel era tener 5 o 10 agentes en paralelo para ir mucho más rápido, pero tiene muchas pegas. No hay comunicación entre ellos. Muchas veces la sesión principal quería hacer el trabajo y tenía que forzarme a cambiar mi forma de trabajar — y cuando lo conseguía, solo se invocaba un agente, así que gastaba más tokens, muchos más, y no mejoraba nada: más lento, más caro, menos calidad. Al final los quité todos.

Se rompieron cuatro cosas.

1. **Lanzaba un agente cada vez.** Yo esperaba un reparto en paralelo, y el sistema seguía lanzando un solo agente y esperándolo. No había concurrencia ni ganancia de velocidad, solo una capa más entre el trabajo y yo.
2. **El coste en tokens se multiplicaba.** Cada delegación reenvía el contexto al agente y resume el resultado de vuelta. Una sola ejecución delegada de una skill costó unos 112k tokens y más de ocho minutos sin ningún paralelismo, gran parte releyendo ficheros que la sesión principal ya tenía. Otra vez, un panel de revisión que lancé tarde gastó unos 278k tokens y no devolvió nada, porque los agentes llegaron al límite de sesión antes de dar un veredicto.
3. **Los agentes no podían hablar entre ellos.** Toda mi idea de equipo dependía de la coordinación, y la coordinación no estaba.
4. **Las skills no se cargaban.** Los agentes ignoraban la skill que debía guiar un paso. La skill de orquestación que tenía que dirigirlo todo tampoco se cargaba muchas veces. El comportamiento solo ocurría porque también lo había escrito en la configuración que se carga siempre.

## Por qué falló

Los síntomas tienen causas distintas, y resumirlo todo en «los agentes no funcionan» lo esconde.

**Los resúmenes pierden detalle.** Cuando un agente escribe código y devuelve un resumen, parte del detalle se queda por el camino. El lead revisa después código que nunca vio escribir. En el trabajo que consiste sobre todo en escribir, la calidad baja por cómo funciona la delegación, aunque cada llamada sea correcta.

**El contexto tiene un precio.** Cada agente vuelve a pagar por orientarse. Un reparto de cinco paga cinco veces un contexto que la sesión principal ya tenía. El aislamiento ayuda al agente que solo lee y perjudica al que escribe.

**Las skills no se cargan de forma determinista.** Claude Code no elige una skill desde un índice. El modelo compara tu petición con la descripción de cada skill y suele cargar menos de las que debería. Nada obliga a cargar una skill; un hook solo puede recordárselo al modelo. Además, una skill cargada en la sesión principal **no pasa a un subagente**, así que mis agentes delegados empezaban sin las instrucciones que necesitaban. Mi arreglo de entonces fueron reglas que pedían a los agentes leer los ficheros de skill a mano, la opción más floja. La que mejor funciona, que encontré después, es sencilla: escribir descripciones que digan cuándo usar la skill («Use when…», con disparadores concretos). Ese cambio hace más por la activación que cualquier hook.

**El cuello de botella era yo.** Aunque diez agentes hubieran escrito código en paralelo, yo reviso y decido de uno en uno, porque me importa más la calidad que la velocidad. Generar en paralelo solo habría movido la cola a mi mesa. Estaba optimizando una parte del sistema que no era la restricción.

## Lo que no pude hacer: medirlo

Tengo que reconocer una carencia. Concluí que costaba más porque era evidente, no porque lo midiera bien, y dejé de medir más de una vez. Ahí está el problema difícil. Estos sistemas no son deterministas: la misma tarea delegada dos veces no cuesta ni se comporta igual, así que un antes y después limpio cuesta de conseguir. Necesito esa instrumentación de todos modos, porque decidir por doctrina solo funciona hasta que la doctrina se equivoca.

## Lo que cambié

Dejé de pedir a los agentes que escribieran. El sistema funciona ahora con dos reglas.

1. **Inline primero.** Todo lo que se construye y se escribe ocurre en la sesión principal, con ediciones directas. Pasar una tarea de escritura a un único agente nunca compensa. Los agentes quedan para trabajo de solo lectura que pueda ir en paralelo, y solo cuando hay suficientes piezas independientes para justificarlo.
2. **Un flujo estructurado con puntos de control humanos.** El trabajo pasa por fases explícitas (alcance, plan, diseño de validaciones, build, revisión, retrospectiva), y yo apruebo el paso de una fase a la siguiente. Cada paso es más lento sobre el papel, pero el trabajo converge, lo puedo depurar y no gasta tokens volviendo a explicarse. El riesgo es la ceremonia: un flujo de muchos pasos puede sobrecargar una tarea pequeña. Por eso el peso del proceso depende ahora del tamaño del trabajo.

## Lo que sí funcionó

Los agentes fallaron escribiendo, pero se les da bien leer y comprobar, y esa mitad funciona hoy. Repartí revisores independientes e hice que un agente intentara refutar el hallazgo de otro. Pilló errores reales cada vez que lo ejecuté: cifras mal, números desactualizados, una afirmación con la fuente equivocada. Un revisor con contexto fresco cambió resultados reales en vez de aprobar lo que le enseñaban. Lanzar esos revisores en paralelo cuesta muy poco, y el resultado mejora.

## Hacia dónde creo que va esto

Sigo creyendo en la idea del equipo. Agentes que se reparten el trabajo y hablan entre ellos es el futuro por el que apostaría. Ahora mismo también es la parte menos madura: los agentes apenas se comunican, no pueden asumir roles especializados ni delegar a su vez, y todo el modo es experimental y caro. Así que no lo voy a forzar. Mantendré la escritura inline, dejaré que los agentes lean y comprueben donde ya funcionan bien y mediré el coste para ver cuándo compensa delegar. Cuando la herramienta y mis mediciones estén listas, volveré a probar el modelo de equipo.

El sistema del que habla este post es [Poneglyph](https://github.com/MaciWP/poneglyph), y es público.

Lo que vino después está en [Hooks de Claude Code: convertir reglas escritas en reglas que el agente no puede saltarse](/es/blog/claude-code-hooks-that-enforce-the-rules).
