---
title: "Construire une couche d'orchestration pour Claude Code : une rétrospective honnête"
description: "Je voulais 5 à 10 agents en parallèle. Il n'en a lancé qu'un, a consommé bien plus de tokens et les skills ne se chargeaient pas. Ce qui a raté et pourquoi."
pubDate: 2026-06-18
tags: ["claude-code", "ai-agents", "orchestration", "developer-tools", "retrospective"]
draft: false
heroImage: "/images/blog/orchestration.svg"
heroImageAlt: "Schéma abstrait : un nœud lead se ramifiant en agents parallèles qui convergent vers un résultat unique"
---

<!-- Traduction française du billet en anglais (src/content/blog/en). Les chiffres
     112k / ~278k sont réels (plans 007/017 de poneglyph) ; à relire avant publication. -->

Pendant un temps, l'essentiel de mon travail avec [Claude Code](https://www.anthropic.com/claude-code) tournait autour d'une couche d'orchestration que je construisais par-dessus. L'étape suivante semblait évidente. Au lieu d'un seul assistant qui traite une tâche, la couche découperait le travail en petits morceaux et lancerait **cinq ou dix agents en parallèle**. Chaque agent aurait son propre contexte et sa propre part du travail, et ils se parleraient pour se coordonner. J'attendais plus de débit, moins de contexte gonflé et des résultats plus rapides.

J'ai obtenu l'inverse sur les trois points. Ça a coûté plus cher, c'était plus lent, et la qualité a baissé. Voici ce qui s'est passé.

## Le plan

Je voulais une équipe. Un agent « lead » planifierait le travail et le répartirait. Les morceaux indépendants tourneraient en même temps comme des agents séparés, chacun avec un contexte isolé pour garder la conversation principale propre, et ils se passeraient le relais là où un morceau dépendait d'un autre. Sur le papier, c'est ainsi qu'un seul assistant devient quelque chose qui passe à l'échelle.

Claude Code fournit les briques : des **subagents** pour déléguer, des **skills** pour les instructions réutilisables et des **hooks** pour les scripts qui s'exécutent sur des événements. Je les ai reliés dans une logique qui décidait quand découper le travail et quelle skill utiliser à chaque étape.

## Ce qui s'est réellement passé

Voici comment je l'ai raconté à l'époque :

> Je croyais que l'étape suivante était d'avoir 5 ou 10 agents en parallèle pour aller beaucoup plus vite, mais ça a beaucoup d'inconvénients. Il n'y a pas de communication entre eux. Souvent la session principale voulait faire le travail et je devais me forcer à changer ma façon de travailler — et quand j'y arrivais, un seul agent était invoqué, donc ça consommait plus de tokens, beaucoup plus, et ça n'améliorait rien : plus lent, plus cher, moins de qualité. Au final, je les ai tous retirés.

Quatre choses ont cassé.

1. **Il lançait un agent à la fois.** J'attendais une répartition en parallèle, et le système continuait de lancer un seul agent et de l'attendre. Pas de concurrence, pas de gain de vitesse, seulement une couche de plus entre le travail et moi.
2. **Le coût en tokens se multipliait.** Chaque délégation renvoie le contexte à l'agent et résume le résultat au retour. Une seule exécution déléguée d'une skill a coûté environ 112k tokens et plus de huit minutes sans aucun parallélisme, en grande partie à relire des fichiers que la session principale avait déjà. Une autre fois, un panel de revue lancé trop tard a consommé environ 278k tokens sans rien rendre, parce que les agents ont atteint la limite de session avant de donner un verdict.
3. **Les agents ne pouvaient pas se parler.** Toute mon idée d'équipe reposait sur la coordination, et elle n'était pas vraiment là.
4. **Les skills ne se chargeaient pas.** Les agents ignoraient la skill censée guider une étape. La skill d'orchestration qui devait tout piloter ne se chargeait souvent pas non plus. Le comportement n'existait que parce que je l'avais aussi écrit dans la configuration chargée en permanence.

## Pourquoi ça a échoué

Les symptômes ont des causes différentes, et tout ranger sous « les agents ne marchent pas » le masque.

**Les résumés perdent du détail.** Quand un agent écrit du code et rend un résumé, une partie du détail reste en route. Le lead relit ensuite du code qu'il n'a jamais vu écrire. Pour un travail qui consiste surtout à écrire, la qualité baisse à cause du fonctionnement même de la délégation, même quand chaque appel est correct.

**Le contexte a un prix.** Chaque agent paie de nouveau pour s'orienter. Une répartition sur cinq agents paie cinq fois un contexte que la session principale avait déjà. L'isolement aide l'agent qui ne fait que lire et pénalise celui qui écrit.

**Les skills ne se chargent pas de façon déterministe.** Claude Code ne choisit pas une skill dans un index. Le modèle compare votre demande à la description de chaque skill, et il a tendance à en charger trop peu. Rien n'oblige une skill à se charger ; un hook peut seulement le rappeler au modèle. Une skill chargée dans la session principale **ne passe pas non plus à un subagent**, si bien que mes agents délégués démarraient sans les instructions dont ils avaient besoin. Ma correction de l'époque, des règles demandant aux agents de lire les fichiers de skill à la main, était l'option la plus faible. Celle qui marche le mieux, trouvée plus tard, est simple : écrire des descriptions qui disent quand utiliser la skill (« Use when… », avec des déclencheurs concrets). Ce changement fait plus pour l'activation que n'importe quel hook.

**Le goulot d'étranglement, c'était moi.** Même si dix agents avaient écrit du code en parallèle, je relis et je décide une chose à la fois, parce que la qualité compte plus pour moi que la vitesse. Générer en parallèle n'aurait fait que déplacer la file d'attente sur mon bureau. J'optimisais une partie du système qui n'était pas la contrainte.

## Ce que je n'ai pas su faire : le mesurer

Je dois reconnaître un manque. J'ai conclu que ça coûtait plus cher parce que c'était évident, pas parce que je l'avais bien mesuré, et j'ai renoncé à mesurer plus d'une fois. C'est là que se trouve le problème difficile. Ces systèmes ne sont pas déterministes : la même tâche déléguée deux fois ne coûte pas pareil et ne se comporte pas pareil, donc un avant-après propre est difficile à obtenir. J'ai besoin de cette instrumentation de toute façon, parce que décider par doctrine ne marche que jusqu'au jour où la doctrine se trompe.

## Ce que j'ai changé

J'ai arrêté de demander aux agents d'écrire. Le système repose maintenant sur deux règles.

1. **Inline d'abord.** Tout ce qui se construit et s'écrit se fait dans la session principale, avec des modifications directes. Confier une tâche d'écriture à un seul agent n'en vaut jamais la peine. Les agents servent uniquement au travail en lecture seule qui peut tourner en parallèle, et seulement quand il y a assez de morceaux indépendants pour le justifier.
2. **Un flux structuré avec des points de contrôle humains.** Le travail passe par des phases explicites (périmètre, plan, conception des vérifications, build, revue, rétrospective), et j'approuve le passage d'une phase à la suivante. Chaque étape est plus lente sur le papier, mais le travail converge, je peux le déboguer et il ne brûle pas de tokens à se réexpliquer. Le risque, c'est la cérémonie : un flux à nombreuses étapes peut surcharger une petite tâche. Le poids du processus dépend donc maintenant de la taille du travail.

## Ce qui a vraiment marché

Les agents ont échoué à écrire, mais ils sont bons pour lire et vérifier, et cette moitié-là fonctionne aujourd'hui. J'ai réparti des relecteurs indépendants et demandé à un agent de réfuter la conclusion d'un autre. Ça a attrapé de vraies erreurs à chaque exécution : des chiffres faux, des nombres périmés, une affirmation attribuée à la mauvaise source. Un relecteur au contexte neuf a changé de vrais résultats au lieu d'approuver ce qu'on lui montrait. Lancer ces relecteurs en parallèle coûte très peu, et le résultat est meilleur.

## Où je pense que ça va

Je crois toujours à l'idée d'équipe. Des agents qui se répartissent le travail et se parlent, c'est l'avenir sur lequel je parierais. Pour l'instant, c'est aussi la partie la moins mûre : les agents communiquent à peine, ils ne peuvent ni prendre des rôles spécialisés ni déléguer à leur tour, et tout le mode reste expérimental et coûteux. Je ne vais donc pas le forcer. Je garde l'écriture inline, je laisse les agents lire et vérifier là où ils marchent déjà bien, et je mesure le coût pour voir quand la délégation devient rentable. Quand l'outil et mes mesures seront prêts, je réessaierai le modèle d'équipe.

Le système dont parle ce billet s'appelle [Poneglyph](https://github.com/MaciWP/poneglyph), et il est public.
