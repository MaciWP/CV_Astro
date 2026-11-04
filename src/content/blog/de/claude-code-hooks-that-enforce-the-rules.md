---
title: "Claude-Code-Hooks: aus geschriebenen Regeln werden Regeln, die der Agent nicht überspringen kann"
description: "Mein Claude-Code-Setup ignorierte seine geschriebenen Regeln. Ich habe gemessen, wie oft, und die teuren in Hooks verlagert. Was die Daten zeigten und der Hook, der mich blockierte."
pubDate: 2026-10-26
tags: ["claude-code", "hooks", "ai-agents", "developer-tools"]
draft: false
---

<!-- Deutsche Übersetzung des englischen Beitrags (src/content/blog/en). KI-Übersetzung, vom Autor noch nicht geprüft. -->

Nach [dem Orchestrierungsexperiment](/de/blog/building-a-claude-code-orchestrator) habe ich eines behalten: eine persönliche Schicht auf [Claude Code](https://www.anthropic.com/claude-code), die ich Poneglyph nenne. Sie ist [öffentlich auf GitHub](https://github.com/MaciWP/poneglyph). Sie enthält eine `CLAUDE.md` mit meinen Arbeitsregeln, einen Output-Style, 21 Skills und eine Reihe von Hooks. Dieser Beitrag handelt von den Hooks, denn sie sind der Teil, der das Verhalten des Agenten verändert hat.

## Geschriebene Regeln sind Vorschläge

Meine `CLAUDE.md` enthält Sätze wie „beantworte jeden Skill-Vorschlag, bevor du anfängst“, „schreibe Fortschrittsnotizen auf Spanisch“ und „stelle Entscheidungsfragen über das Question-Tool“. Ich ging davon aus, dass das Modell sie befolgt. Dann habe ich über 14 Tage echter Transkripte nachgezählt:

| Regel | Wie oft sie befolgt wurde |
|---|---|
| Den Skill-Router beantworten, bevor es losgeht | 39 % |
| Fortschrittsnotizen auf Spanisch | 80 % |
| Den Config-Skill laden, bevor Konfiguration geändert wird | 62 % |
| Entscheidungen über das Question-Tool stellen | ~20 % |

Noch schlimmer: Bei 36 der 60 Verstöße gegen die erste Regel hatte das Modell den ignorierten Hinweis bereits gelesen. Mehr Text im Prompt würde daran nichts ändern. Also habe ich aufgehört, Regeln hinzuzufügen, und mir für jede eine andere Frage gestellt: Kann ein Skript das prüfen?

## Hooks, die Geld sparen

Die ersten Hooks drehten sich um Kosten, weil sich Kosten leicht messen lassen.

**Headless-Läufe auf dem falschen Modell.** Am 2026-09-03 startete meine Hauptsitzung an einem Tag 82 `claude -p`-Läufe. 44 davon liefen auf Opus, weil niemand `--model` angegeben hatte, und 29 absichtlich auf Fable. Die Regel „für Hintergrundarbeit das günstige Modell wählen“ stand bereits geschrieben da. `headless-model-gate.ts` prüft nun jeden `claude -p`-Befehl, bevor er läuft.

**Subagenten jenseits der Preisstufe.** Haiku berechnet eine Anfrage, deren Prompt 100k Tokens überschreitet, mit dem Fünffachen. Über 14 Tage gingen 13 % meiner Haiku-Subagenten-Anfragen darüber hinaus, die größte mit 248k. `haiku-context-brake.ts` verengt ein Lesen von Dateien, das einen Haiku-Agenten über 90k führen würde, und Haiku komprimiert jetzt bei etwa 87k.

**Kontext voller Datei-Dumps.** Tool-Ergebnisse machten 56 % des Gesprächskontexts aus. Die schwersten Befehle waren `cat` (365k Zeichen, darunter derselbe 28-KB-Plan, viermal in einer Sitzung gelesen) und `sed -n` (273k). `bash-output-shaper.ts` hält Komplett-Dumps von Dateien und unbegrenzte Auflistungen aus dem Kontext heraus.

## Hooks, die absichern

Manche Regeln schützen Dinge, die ich nicht rückgängig machen kann. Das klarste Beispiel: Der Agent pusht, öffnet Pull Requests, mergt oder löscht Remote-Branches nur, wenn ich das in der aktuellen Nachricht verlangt habe. `remote-git-gate.ts` liest meine letzte Nachricht und blockiert den Befehl andernfalls.

Das funktioniert, und am 2026-10-13 war es mir gegenüber zu streng. Beim Ausliefern dieser Website genehmigte ich einen Merge, indem ich im Question-Tool eine Option wählte, und der Hook blockierte ihn: Er liest nur, was ich tippe. Dann tippte ich „abre las PR“ („öffne die PRs“), und auch das wurde blockiert, weil er auf den Singular „abre la PR“ passte. Ich musste exakt die erwartete Formulierung eintippen. Ein Gate, das die Person blockiert, die es schützen soll, hat einen Fehler: Es sollte verstehen, was ich meine, und im Moment vergleicht es nur exakte Wörter. Ich lasse es vorerst streng, bis ich das ordentlich behoben habe, denn ein zu lockeres Gate ist schlimmer.

Nicht jeder Hook sollte blockieren. `security-gate.ts` durchsucht kürzlich geänderte Dateien nach Secrets und warnt nur. Ein Fehlalarm würde dort die Arbeit grundlos stoppen, und eine Warnung genügt mir, um hinzuschauen.

## Skills mit einem günstigen Modell routen

Bei 21 Skills muss der Agent wissen, welcher zu einem Prompt passt. Mein erster Versuch nutzte Keyword-Hinweise. Auf einer zurückgehaltenen Evaluation erreichten sie 0,07, mit Fehlalarmen. Jetzt schickt `prompt-router.ts` jeden Prompt asynchron an ein günstiges Modell, während das Hauptmodell schon arbeitet. Es liefert bis zu drei Skills zurück und korrigiert falsch verstandene Wörter aus dem Diktat. Auf derselben Evaluation erreicht es etwa 0,8.

## Was ich jemandem raten würde, der anfängt

- Zähle, bevor du eine Regel schreibst. Meine Transkripte zeigten, welche Regeln scheitern, und es waren nicht die, die ich erwartet hatte.
- Verlagere eine Regel nur dann in einen Hook, wenn ein Skript sie günstig und zuverlässig prüfen kann. Alles andere bleibt Text.
- Entscheide für jeden Hook, ob er warnt oder blockiert. Blockiere nur, was sich nicht rückgängig machen lässt.
- Teste das Gate gegen dich selbst. Meines hat mich gelehrt, dass es jede Art akzeptieren muss, wie ich einen Auftrag gebe, nicht nur eine einzige Formulierung.
