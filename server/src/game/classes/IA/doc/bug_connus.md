# Bug IA

1. (*RESOLU*) Le reveal n'est pas considéré.

![Pas de reveal dans les coups potentiels, alors que mineur et reveal en main](bug01.png) 

**Solution** Test sur cardType au lieu de cardId (même problème que #bug05).

2. (*RESOLU*) Les culs de sacs ne sont pas détectés.

![Pas de collapse dans les coups potentiels, alors que cds sur le plateau, mineur et collapse en main](bug02.png)

**Solution** Appeler IA.deviner lors de l'update.

3. (*RESOLU*) Ne répart pas son objet cassé.

![Pas de bonus-cart dans les coups potentiels, alors que cart cassé et bonuscart en main](bug03.png)

**Solution** Update des données de l'IA avant chaque coup.

4. (*RESOLU*) Se casse son propre outil.

![Se casse son propre outil](bug04.png)

**Solution** Ajout de la condition cible != ia.playerId

5. (*RESOLU*) Reveal est considéré comme un chemin.

![Jouer reveal provoque une exception de Game.casePath()](bug05.png)

**Solution** Test sur cardType au lieu de cardId.

6. (*RESOLU*) L'affichage des items se fait avec un tour de décalage.

![Pick toujours cassé alors que bonuspick a été joué au tour précédent](bug06.png)

**Solution** L'event "*updatePlayerState*" n'est pas envoyé aux joueurs humains.

7. (*RESOLU*) Priorité non respectée.

![Draw préféré à bonuspick alors que bonus est de catégorie sûre](bug07.png)

**Solution** Erreur = au lieu de == dans une condition.

8. (*RESOLU*) Après le collapse sur un cul-de-sac, la liste des culs-de-sac ne se met pas à jour.

**Solution** Le collapse était mal détecté + la fonction n'était pas appelée lorsque l'IA jouait.