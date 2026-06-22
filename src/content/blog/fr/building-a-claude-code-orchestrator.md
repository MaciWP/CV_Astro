---
title: "Construire une couche d'orchestration pour Claude Code : une rétrospective honnête"
description: "Je voulais 5 à 10 agents travaillant en parallèle, se répartissant le travail et communiquant entre eux. Il en lançait un seul, consommait bien plus de tokens, était plus lent, et les skills ne se chargeaient même pas. Voici ce qui n'a pas marché, pourquoi, et le flux itératif que j'ai adopté à la place."
pubDate: 2026-06-18
tags: ["claude-code", "ai-agents", "orchestration", "developer-tools", "retrospective"]
draft: false
heroImage: "/images/blog/orchestration.svg"
heroImageAlt: "Schéma abstrait : un nœud lead se ramifiant en agents parallèles qui convergent vers un résultat unique"
---

<!-- Traduction française du billet en anglais (src/content/blog/en). Les chiffres
     112k / ~278k sont réels (plans 007/017 de poneglyph) ; à relire avant publication. -->

Pendant un temps, le cœur de mon travail avec [Claude Code](https://www.anthropic.com/claude-code) était une couche d'orchestration que je construisais par-dessus. L'idée semblait être l'étape suivante évidente : au lieu d'un seul assistant traitant une tâche, qu'il la découpe en morceaux atomiques et lance **cinq ou dix agents en parallèle** — chacun avec son contexte ciblé, chacun responsable d'une partie bien définie, communiquant entre eux pour se coordonner. Plus de débit, moins de contexte superflu, des résultats plus rapides.

Il a fait l'inverse des trois. Ça a coûté plus cher, c'était plus lent, et la qualité a baissé. Voici le compte rendu honnête.

## Le rêve

Ce que je cherchais, c'était une équipe, pas un outil. Un « lead » planifierait le travail et le répartirait ; les morceaux indépendants tourneraient comme des agents séparés en même temps ; chaque agent aurait un contexte isolé pour garder la conversation principale propre ; et ils communiqueraient pour articuler les parties interdépendantes. Sur le papier, c'est ainsi qu'on transforme un assistant unique en quelque chose qui passe à l'échelle.

Claude Code fournit les briques : des **subagents** pour déléguer, des **skills** pour les instructions réutilisables, et des **hooks** pour les scripts déclenchés par événements. Je les ai assemblés dans une logique qui décidait quand diviser le travail et quelle skill utiliser à chaque étape.

## Ce qui s'est réellement passé

La réalité, avec mes propres mots de l'époque :

> Je croyais que l'étape suivante était d'avoir 5 ou 10 agents en parallèle pour aller beaucoup plus vite, mais ça a beaucoup d'inconvénients. Il n'y a pas de communication entre eux. Souvent la session principale voulait faire le travail et je devais me forcer à changer ma façon de travailler — et quand j'y arrivais, un seul agent était invoqué, donc ça consommait plus de tokens, beaucoup plus, et ça n'améliorait rien : plus lent, plus cher, moins de qualité. Au final, je les ai tous retirés.

Concrètement, quatre choses se sont cassées :

- **Ça se sérialisait sur un seul agent.** Là où j'attendais une répartition parallèle, le système continuait à lancer *un* agent et à l'attendre. Aucune concurrence, aucun gain de vitesse — juste une couche de plus entre le travail et moi.
- **Le coût en tokens se multipliait.** Chaque délégation renvoie le contexte à l'agent puis résume le résultat. Une seule exécution déléguée d'une skill a coûté ~112k tokens et plus de huit minutes pour *zéro* parallélisme, en grande partie à relire des fichiers que la session principale avait déjà. Une autre fois, un panel de révision lancé tard a consommé ~278k tokens et n'a rien renvoyé, car les agents ont atteint la limite de session avant de produire un verdict.
- **Les agents ne pouvaient pas communiquer.** La seule chose dont dépendait mon idée d'« équipe » — la coordination — n'était pas vraiment là.
- **Les skills ne s'activaient pas.** Les agents ignoraient la skill censée régir une étape. L'ironie a culminé quand j'ai réalisé que la skill d'orchestration *censée tout piloter* ne se chargeait souvent jamais — le comportement n'avait lieu que parce que je l'avais aussi écrit dans la configuration toujours chargée.

## Pourquoi ça a échoué

La partie intéressante, c'est le diagnostic, car les symptômes ont des causes racines *différentes*. Tout ranger dans « les agents ne marchent pas » le masque.

**Le goulot d'étranglement du résumé.** Quand un agent écrit du code et renvoie un résumé, le détail se perd dans ce résumé. Le lead doit alors relire un code qu'il n'a jamais « vu naître ». Pour le travail d'écriture, la qualité baisse *par conception* — pas à cause d'une mauvaise invocation.

**L'économie du contexte.** Chaque agent paie de nouveau le coût de s'orienter. Une répartition de cinq paie cinq fois le contexte que la session principale avait déjà amorti. L'isolation aide celui qui *lit* ; elle pénalise celui qui *écrit*.

**Les skills sont non déterministes à dessein.** Claude Code ne choisit pas une skill depuis un index — le modèle apparie sémantiquement votre demande à la description de chaque skill, et il a tendance à *sous*-déclencher. Aucun mécanisme ne force l'activation ; un hook ne peut que pousser. Et une skill chargée dans la session principale **ne se transmet pas à un subagent** — mes agents délégués démarraient donc sans les instructions dont ils avaient justement besoin. Ma solution de l'époque (des règles disant aux agents de lire les fichiers de skill à la main) était l'option la moins efficace possible. La plus efficace, que j'ai découverte ensuite, est presque gênante : écrire des descriptions plus directives (« Use when… », avec des déclencheurs concrets). Ce seul changement déplace l'activation plus que n'importe quel hook.

**Et le recadrage qui a tout réorganisé :** même si dix agents *généraient* du code en parallèle, le goulot d'étranglement du système, c'est *moi*. Donner la priorité à la qualité veut dire que je relis et décide en série. Paralléliser la génération n'accélère pas le système — ça ne fait que déplacer la file vers moi. J'optimisais la partie qui n'était pas la contrainte.

## Ce que je n'ai pas pu faire : le mesurer

Je veux être honnête sur une lacune. J'ai conclu « ça a coûté plus cher » parce que c'était *évident*, pas parce que je l'ai mesuré proprement. J'ai renoncé à mesurer plus d'une fois. Et c'est là le vrai problème difficile : ces systèmes sont non déterministes, donc la même tâche déléguée deux fois ne coûte ni ne se comporte pareil, et un avant/après net est difficile à établir. J'aurai besoin de cette instrumentation de toute façon — décider par doctrine plutôt que par les données ne marche que jusqu'à ce que la doctrine ait tort.

## Ce que j'ai changé

J'ai arrêté d'essayer de faire écrire les agents. Le système fonctionne maintenant sur deux règles :

1. **Inline d'abord.** Tout le travail de construction et d'écriture se fait dans la session principale, avec des éditions directes. Un seul agent ne vaut jamais le coup. Les agents sont réservés au travail vraiment parallèle et *en lecture seule*, et seulement quand il y a assez d'unités indépendantes pour le justifier.
2. **Un flux structuré et itératif plutôt qu'un essaim.** Le travail passe par des phases explicites — cadrage, plan, conception des validations, build, revue, rétrospective — chacune avec une porte humaine. Plus lent par étape sur le papier, mais ça converge, c'est débogable, et ça ne brûle pas de tokens à se réexpliquer. (Le piège ici, c'est la cérémonie : un flux à nombreuses étapes peut sur-traiter une petite tâche. Le remède est un triage adaptatif — ajuster le poids du processus à la taille du travail.)

## Ce qui a vraiment marché

Tout n'a pas échoué avec les agents — je les avais pointés vers la mauvaise moitié du problème. La moitié qui marche *aujourd'hui*, c'est la lecture seule, la vérification. Répartir des relecteurs indépendants et faire qu'un agent tente de *réfuter* la trouvaille d'un autre a attrapé de vraies erreurs à chaque fois que je l'ai lancé : chiffres faux, nombres périmés, une affirmation mal citée. Cette vérification adversariale n'est pas de la cérémonie — c'est là que vit vraiment la rigueur. Un relecteur indépendant au contexte neuf a changé de vrais résultats au lieu de se contenter d'approuver. Là, le parallélisme est presque gratuit, et il améliore le résultat.

## Vers où je pense que ça va

Je n'ai pas abandonné l'idée d'équipe — des agents qui se répartissent le travail et communiquent reste la version du futur sur laquelle je parierais. Mais soyons honnêtes sur son état : c'est la partie la *moins* mûre pour l'instant. La communication entre agents est minimale, les agents ne peuvent pas encore endosser des rôles spécialisés ni déléguer davantage, et tout le mode est expérimental et coûteux. Donc mon plan n'est pas de le forcer. C'est de garder l'écriture inline, de laisser les agents faire la lecture et la vérification là où ils excellent déjà, d'instrumenter le coût pour *voir* quand la délégation est rentable — et de reprendre le modèle d'équipe quand l'outillage, et mes mesures, seront prêts.
