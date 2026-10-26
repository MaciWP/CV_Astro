---
title: "Eine Orchestrierungsschicht für Claude Code bauen: ein ehrlicher Rückblick"
description: "Ich wollte 5–10 parallele Agenten. Das System startete einen einzigen, verbrauchte weit mehr Tokens, und die Skills luden nicht. Was schiefging und warum."
pubDate: 2026-06-18
tags: ["claude-code", "ai-agents", "orchestration", "developer-tools", "retrospective"]
draft: false
heroImage: "/images/blog/orchestration.svg"
heroImageAlt: "Abstraktes Diagramm: ein Lead-Knoten, der sich in parallele Agenten verzweigt, die zu einem einzigen Ergebnis zusammenlaufen"
---

<!-- Deutsche Übersetzung des englischen Beitrags (src/content/blog/en). Die Zahlen
     112k / ~278k sind echt (poneglyph Pläne 007/017); vor der Veröffentlichung prüfen. -->

Eine Zeit lang drehte sich der Großteil meiner Arbeit mit [Claude Code](https://www.anthropic.com/claude-code) um eine Orchestrierungsschicht, die ich darauf aufbaute. Der nächste Schritt schien klar. Statt eines einzelnen Assistenten, der eine Aufgabe abarbeitet, sollte die Schicht die Arbeit in kleine Teile zerlegen und **fünf oder zehn Agenten parallel** starten. Jeder Agent bekäme seinen eigenen Kontext und seinen eigenen Teil der Arbeit, und sie würden sich untereinander abstimmen. Ich erwartete mehr Durchsatz, weniger aufgeblähten Kontext und schnellere Ergebnisse.

Bekommen habe ich in allen drei Punkten das Gegenteil. Es war teurer, langsamer, und die Qualität sank. Das ist passiert.

## Der Plan

Ich wollte ein Team. Ein „Lead“-Agent sollte die Arbeit planen und aufteilen. Unabhängige Teile sollten gleichzeitig als eigene Agenten laufen, jeder mit isoliertem Kontext, damit die Hauptunterhaltung sauber blieb, und sie sollten sich die Arbeit dort übergeben, wo ein Teil von einem anderen abhing. Auf dem Papier wird so aus einem einzelnen Assistenten etwas, das skaliert.

Claude Code hat die Bausteine: **Subagenten** zum Delegieren, **Skills** für wiederverwendbare Anweisungen und **Hooks** für Skripte, die bei Ereignissen laufen. Ich habe sie zu einer Logik verbunden, die entschied, wann die Arbeit aufgeteilt wird und welcher Skill bei jedem Schritt gilt.

## Was tatsächlich passierte

So habe ich es damals beschrieben:

> Ich dachte, die nächste Stufe wäre, 5 oder 10 Agenten parallel zu haben, um viel schneller zu sein, aber das hat viele Haken. Es gibt keine Kommunikation zwischen ihnen. Oft wollte die Hauptsitzung die Arbeit selbst machen, und ich musste mich zwingen, meine Arbeitsweise zu ändern — und als ich es schaffte, wurde nur ein Agent aufgerufen, also verbrauchte es mehr Tokens, viel mehr, und verbesserte nichts: langsamer, teurer, geringere Qualität. Am Ende habe ich sie alle entfernt.

Vier Dinge gingen kaputt.

1. **Es lief immer nur ein Agent.** Ich erwartete eine parallele Verteilung, und das System startete weiter einen einzigen Agenten und wartete auf ihn. Keine Nebenläufigkeit, kein Tempogewinn, nur eine zusätzliche Schicht zwischen mir und der Arbeit.
2. **Die Token-Kosten vervielfachten sich.** Jede Delegation schickt den Kontext erneut an den Agenten und fasst das Ergebnis auf dem Rückweg zusammen. Ein einziger delegierter Lauf eines Skills kostete rund 112k Tokens und über acht Minuten, ganz ohne Parallelität, vieles davon für das erneute Lesen von Dateien, die die Hauptsitzung schon hatte. Ein anderes Mal verbrauchte ein Review-Panel, das ich zu spät startete, rund 278k Tokens und lieferte nichts, weil die Agenten vor einem Urteil an das Sitzungslimit stießen.
3. **Die Agenten konnten nicht miteinander reden.** Meine ganze Team-Idee hing an der Koordination, und die gab es kaum.
4. **Skills luden nicht.** Agenten ignorierten den Skill, der einen Schritt leiten sollte. Auch der Orchestrierungs-Skill, der alles steuern sollte, lud oft nicht. Das Verhalten trat nur auf, weil ich es zusätzlich in die immer geladene Konfiguration geschrieben hatte.

## Warum es scheiterte

Die Symptome haben verschiedene Ursachen, und wer alles unter „Agenten funktionieren nicht“ zusammenfasst, verdeckt das.

**Zusammenfassungen verlieren Details.** Wenn ein Agent Code schreibt und eine Zusammenfassung zurückgibt, bleibt ein Teil der Details auf der Strecke. Der Lead prüft danach Code, dessen Entstehung er nie gesehen hat. Bei Arbeit, die vor allem aus Schreiben besteht, sinkt die Qualität durch die Art, wie Delegation funktioniert, selbst wenn jeder Aufruf korrekt ist.

**Kontext hat seinen Preis.** Jeder Agent zahlt erneut dafür, sich zu orientieren. Eine Verteilung auf fünf Agenten zahlt fünfmal für Kontext, den die Hauptsitzung schon hatte. Isolation hilft einem Agenten, der nur liest, und kostet einen Agenten, der schreibt.

**Skills laden nicht deterministisch.** Claude Code wählt einen Skill nicht aus einem Index. Das Modell vergleicht deine Anfrage mit der Beschreibung jedes Skills und lädt eher zu wenige. Nichts zwingt einen Skill zum Laden; ein Hook kann das Modell nur daran erinnern. Ein in der Hauptsitzung geladener Skill **geht außerdem nicht auf einen Subagenten über**, also starteten meine delegierten Agenten ohne die Anweisungen, die sie brauchten. Meine damalige Lösung, Regeln, die Agenten die Skill-Dateien von Hand lesen ließen, war die schwächste Option. Die beste, die ich später fand, ist einfach: Beschreibungen schreiben, die sagen, wann der Skill gilt („Use when…“, mit konkreten Auslösern). Diese Änderung bringt für die Aktivierung mehr als jeder Hook.

**Der Engpass war ich.** Selbst wenn zehn Agenten parallel Code geschrieben hätten, prüfe und entscheide ich eins nach dem anderen, weil mir Qualität wichtiger ist als Tempo. Paralleles Generieren hätte die Warteschlange nur auf meinen Schreibtisch verschoben. Ich optimierte einen Teil des Systems, der nicht der Engpass war.

## Was ich nicht geschafft habe: es zu messen

Eine Lücke muss ich zugeben. Ich habe geschlossen, dass es teurer war, weil es offensichtlich war, nicht weil ich es sauber gemessen hätte, und ich habe das Messen mehr als einmal ausgelassen. Genau da liegt das schwierige Problem. Diese Systeme sind nicht deterministisch: Dieselbe Aufgabe, zweimal delegiert, kostet nicht dasselbe und verhält sich nicht gleich, also ist ein sauberer Vorher-nachher-Vergleich schwer zu bekommen. Diese Instrumentierung brauche ich trotzdem, denn Entscheidungen nach Doktrin funktionieren nur, bis die Doktrin falsch liegt.

## Was ich geändert habe

Ich habe aufgehört, Agenten schreiben zu lassen. Das System folgt jetzt zwei Regeln.

1. **Inline zuerst.** Alles, was gebaut und geschrieben wird, passiert in der Hauptsitzung, mit direkten Änderungen. Eine Schreibaufgabe an einen einzelnen Agenten zu geben, lohnt sich nie. Agenten sind nur für reine Lesearbeit da, die parallel laufen kann, und nur, wenn es genug unabhängige Teile gibt, um das zu rechtfertigen.
2. **Ein strukturierter Ablauf mit menschlichen Kontrollpunkten.** Die Arbeit durchläuft explizite Phasen (Umfang, Plan, Entwurf der Prüfungen, Build, Review, Retrospektive), und ich gebe den Übergang von einer Phase zur nächsten frei. Jeder Schritt ist auf dem Papier langsamer, aber die Arbeit konvergiert, ich kann sie debuggen, und sie verbrennt keine Tokens damit, sich erneut zu erklären. Das Risiko ist Zeremonie: Ein Ablauf mit vielen Schritten kann eine kleine Aufgabe überfrachten. Deshalb hängt das Gewicht des Prozesses jetzt von der Größe der Arbeit ab.

## Was wirklich funktionierte

Beim Schreiben sind die Agenten gescheitert, aber Lesen und Prüfen können sie gut, und diese Hälfte funktioniert heute. Ich habe unabhängige Reviewer verteilt und einen Agenten den Befund eines anderen widerlegen lassen. Das fand bei jedem Lauf echte Fehler: falsche Werte, veraltete Zahlen, eine Aussage mit der falschen Quelle. Ein Reviewer mit frischem Kontext hat echte Ergebnisse verändert, statt abzunicken, was man ihm zeigte. Diese Reviewer parallel laufen zu lassen kostet sehr wenig, und das Ergebnis wird besser.

## Wohin das meiner Meinung nach führt

An die Team-Idee glaube ich weiterhin. Agenten, die sich die Arbeit teilen und miteinander reden, sind die Zukunft, auf die ich setzen würde. Im Moment ist das aber auch der unreifste Teil: Agenten kommunizieren kaum, sie können keine spezialisierten Rollen übernehmen oder selbst weiter delegieren, und der ganze Modus ist experimentell und teuer. Also werde ich ihn nicht erzwingen. Ich halte das Schreiben inline, lasse Agenten dort lesen und prüfen, wo sie schon gut funktionieren, und messe die Kosten, um zu sehen, wann sich Delegieren lohnt. Wenn das Werkzeug und meine Messungen so weit sind, probiere ich das Team-Modell wieder aus.

Das System, um das es in diesem Beitrag geht, heißt [Poneglyph](https://github.com/MaciWP/poneglyph) und ist öffentlich.
