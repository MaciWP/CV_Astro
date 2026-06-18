---
title: "Eine Orchestrierungsschicht für Claude Code bauen: ein ehrlicher Rückblick"
description: "Ich wollte 5–10 Agenten, die parallel arbeiten, sich die Arbeit aufteilen und miteinander reden. Es startete einen einzigen, verbrauchte weit mehr Tokens, war langsamer, und die Skills luden nicht einmal. Hier steht, was schiefging, warum, und der iterative Ablauf, den ich stattdessen gewählt habe."
pubDate: 2026-06-18
tags: ["claude-code", "ai-agents", "orchestration", "developer-tools", "retrospective"]
draft: false
heroImage: "/images/blog/orchestration.svg"
heroImageAlt: "Abstraktes Diagramm: ein Lead-Knoten, der sich in parallele Agenten verzweigt, die zu einem einzigen Ergebnis zusammenlaufen"
---

<!-- Deutsche Übersetzung des englischen Beitrags (src/content/blog/en). Die Zahlen
     112k / ~278k sind echt (poneglyph Pläne 007/017); vor der Veröffentlichung prüfen. -->

Eine Zeit lang war das Herzstück meiner Arbeit mit [Claude Code](https://www.anthropic.com/claude-code) eine Orchestrierungsschicht, die ich darauf aufbaute. Die Idee fühlte sich wie die naheliegende nächste Stufe an: Statt eines einzelnen Assistenten, der eine Aufgabe abarbeitet, sollte er sie in atomare Teile zerlegen und **fünf oder zehn Agenten parallel** starten — jeder mit eigenem, fokussiertem Kontext, jeder verantwortlich für einen klar abgegrenzten Teil, miteinander kommunizierend, um sich abzustimmen. Mehr Durchsatz, weniger aufgeblähter Kontext, schnellere Ergebnisse.

Es tat das Gegenteil von allen dreien. Es kostete mehr, war langsamer, und die Qualität sank. Das ist der ehrliche Bericht.

## Der Traum

Was ich anstrebte, war ein Team, kein Werkzeug. Ein „Lead" würde die Arbeit planen und aufteilen; die unabhängigen Teile würden gleichzeitig als getrennte Agenten laufen; jeder Agent bekäme einen isolierten Kontext, damit die Hauptkonversation sauber bleibt; und sie würden kommunizieren, um die voneinander abhängigen Teile zu verzahnen. Auf dem Papier macht man so aus einem einzelnen Assistenten etwas, das skaliert.

Claude Code liefert die Bausteine: **Subagents** zum Delegieren, **Skills** für wiederverwendbare Anweisungen und **Hooks** für ereignisgesteuerte Skripte. Ich verdrahtete sie zu einer Logik, die entschied, wann die Arbeit aufgeteilt wird und welche Skill in jedem Schritt zum Einsatz kommt.

## Was tatsächlich geschah

Die Realität, in meinen eigenen Worten von damals:

> Ich dachte, die nächste Stufe wäre, 5 oder 10 Agenten parallel zu haben, um viel schneller zu sein, aber das hat viele Haken. Es gibt keine Kommunikation zwischen ihnen. Oft wollte die Hauptsitzung die Arbeit selbst machen, und ich musste mich zwingen, meine Arbeitsweise zu ändern — und als ich es schaffte, wurde nur ein Agent aufgerufen, also verbrauchte es mehr Tokens, viel mehr, und verbesserte nichts: langsamer, teurer, geringere Qualität. Am Ende habe ich sie alle entfernt.

Konkret gingen vier Dinge schief:

- **Es serialisierte auf einen einzigen Agenten.** Wo ich eine parallele Aufteilung erwartete, startete das System immer wieder *einen* Agenten und wartete auf ihn. Keine Nebenläufigkeit, kein Geschwindigkeitsgewinn — nur eine zusätzliche Schicht zwischen der Arbeit und mir.
- **Die Token-Kosten vervielfachten sich.** Jede Delegation schickt den Kontext erneut an den Agenten und fasst das Ergebnis zurück. Ein einziger delegierter Lauf einer Skill kostete ~112k Tokens und über acht Minuten für *null* Parallelität, größtenteils beim erneuten Lesen von Dateien, die die Hauptsitzung schon hatte. Ein anderes Mal verbrannte ein spät gestartetes Review-Panel ~278k Tokens und lieferte nichts, weil die Agenten das Sitzungslimit erreichten, bevor ein Urteil zustande kam.
- **Die Agenten konnten nicht miteinander reden.** Das Einzige, worauf meine „Team"-Idee beruhte — die Koordination — war nicht wirklich da.
- **Die Skills aktivierten sich nicht.** Die Agenten ignorierten die Skill, die einen Schritt hätte steuern sollen. Die Ironie gipfelte, als ich merkte, dass die Orchestrierungs-Skill, *die das Ganze steuern sollte*, oft gar nicht lud — das Verhalten trat nur ein, weil ich sie auch in die stets geladene Konfiguration geschrieben hatte.

## Warum es scheiterte

Der interessante Teil ist die Diagnose, denn die Symptome haben *unterschiedliche* Grundursachen. Alles in „Agenten funktionieren nicht" zu packen, verdeckt das.

**Der Flaschenhals der Zusammenfassung.** Wenn ein Agent Code schreibt und eine Zusammenfassung zurückgibt, geht das Detail in dieser Zusammenfassung verloren. Der Lead muss dann Code prüfen, den er nie „hat entstehen sehen". Bei schreibintensiver Arbeit sinkt die Qualität *konstruktionsbedingt* — nicht wegen eines schlechten Aufrufs.

**Die Ökonomie des Kontexts.** Jeder Agent zahlt erneut die Kosten, sich zu orientieren. Eine Aufteilung auf fünf zahlt fünfmal für den Kontext, den die Hauptsitzung bereits amortisiert hatte. Isolation hilft dem, der *liest*; sie belastet den, der *schreibt*.

**Skills sind absichtlich nicht deterministisch.** Claude Code wählt eine Skill nicht aus einem Index — das Modell gleicht deine Anfrage semantisch mit der Beschreibung jeder Skill ab, und es neigt dazu, *zu selten* auszulösen. Kein Mechanismus erzwingt die Aktivierung; ein Hook kann nur anstoßen. Und eine in der Hauptsitzung geladene Skill **wird nicht an einen Subagent weitergegeben** — meine delegierten Agenten starteten also ohne genau die Anweisungen, die sie brauchten. Meine damalige Lösung (Regeln, die den Agenten sagten, die Skill-Dateien von Hand zu lesen) war die wirkungsschwächste verfügbare Option. Die wirkungsstärkste, die ich später fand, ist fast peinlich: direktivere Beschreibungen schreiben („Use when…", mit konkreten Auslösern). Diese eine Änderung bewegt die Aktivierung mehr als jeder Hook.

**Und die Neubewertung, die alles umordnete:** Selbst wenn zehn Agenten Code parallel *erzeugen* würden, der Flaschenhals des Systems bin *ich*. Qualität zuerst heißt, dass ich seriell prüfe und entscheide. Die Erzeugung zu parallelisieren beschleunigt das System nicht — es verschiebt die Warteschlange nur zu mir. Ich optimierte den Teil, der nicht der Engpass war.

## Was ich nicht tun konnte: es messen

Ich will ehrlich über eine Lücke sein. Ich schloss „es kostete mehr", weil es *offensichtlich* war, nicht weil ich es sauber gemessen hätte. Ich verzichtete mehr als einmal aufs Messen. Und das ist das wirklich harte Problem: Diese Systeme sind nicht deterministisch, dieselbe zweimal delegierte Aufgabe kostet und verhält sich also nicht gleich, und ein sauberes Vorher/Nachher ist schwer festzunageln. Ich werde diese Instrumentierung ohnehin brauchen — nach Doktrin statt nach Daten zu entscheiden funktioniert nur, bis die Doktrin falsch liegt.

## Was ich änderte

Ich hörte auf, die Agenten schreiben lassen zu wollen. Das System läuft jetzt nach zwei Regeln:

1. **Inline zuerst.** Alle Bau- und Schreibarbeit passiert in der Hauptsitzung, mit direkten Edits. Ein einzelner Agent lohnt sich nie. Agenten sind für wirklich parallele, *nur lesende* Arbeit reserviert, und nur, wenn es genug unabhängige Einheiten gibt, die es rechtfertigen.
2. **Ein strukturierter, iterativer Ablauf statt eines Schwarms.** Die Arbeit durchläuft explizite Phasen — Scope, Plan, Validierungsentwurf, Build, Review, Retrospektive — jede mit einem menschlichen Tor. Pro Schritt langsamer auf dem Papier, aber es konvergiert, ist debugbar und verbrennt keine Tokens, um sich neu zu erklären. (Die Falle hier ist die Zeremonie: Ein Ablauf mit vielen Schritten kann eine kleine Aufgabe überverarbeiten. Die Abhilfe ist adaptive Triage — das Gewicht des Prozesses an die Größe der Arbeit anpassen.)

## Was wirklich funktionierte

Nicht alles an den Agenten scheiterte — ich hatte sie auf die falsche Hälfte des Problems gerichtet. Die Hälfte, die *heute* funktioniert, ist die nur lesende, die Verifikation. Unabhängige Prüfer aufzufächern und einen Agenten den Fund eines anderen *widerlegen* zu lassen, fing jedes einzelne Mal echte Fehler: falsche Zahlen, veraltete Werte, eine falsch zitierte Behauptung. Diese adversariale Verifikation ist keine Zeremonie — dort wohnt die eigentliche Strenge. Ein unabhängiger Prüfer mit frischem Kontext änderte echte Ergebnisse, statt nur abzunicken. Dort ist Parallelität fast gratis, und sie verbessert das Ergebnis.

## Wohin das meiner Meinung nach führt

Ich habe die Team-Idee nicht aufgegeben — Agenten, die sich die Arbeit aufteilen und kommunizieren, bleiben die Version der Zukunft, auf die ich setzen würde. Aber ich bin ehrlich über ihren Stand: Das ist derzeit der *unreifste* Teil. Die Kommunikation zwischen Agenten ist minimal, Agenten können noch keine spezialisierten Rollen übernehmen oder weiter delegieren, und der ganze Modus ist experimentell und teuer. Mein Plan ist also nicht, es zu erzwingen. Es ist, das Schreiben inline zu halten, die Agenten das Lesen und Prüfen tun zu lassen, wo sie schon glänzen, die Kosten zu instrumentieren, um zu *sehen*, wann sich Delegation lohnt — und das Team-Modell wieder aufzunehmen, wenn das Werkzeug und meine Messungen bereit sind.
