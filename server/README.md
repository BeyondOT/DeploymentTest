
# Getting Started with Server

## Scripts disponibles

Faites bien attention à etre dans le bon sous-dossier avant d'essayer de lancer ces scripts sinon ça ne marchera pas.
Vous devez etre dans le dossier `projet-intergrateur-s6/server`

### `npm run dev`

Ce script lancera le serveur en mode developpement.\
Ce dernier se trouvera à l'adresse [http://localhost:5000](http://localhost:5000).

A chaque fois que vous aller sauvegarder les changements le serveur se relancera automatiquement grace au module "nodemon".

### `npm run test`
Ce script vous permettra de lancer tout les test se trouvant dans le dossier src
TODO: Créer une commande qui permet de lancer les test lié au gameEngine appart et ceux lié au réseau appart

### `npx jest nomFichier.test.ts`
En utilisant cette commande vous pouvez lancer un test sur un fichier de test spécifique.

## Thunder Client
Pour les personnes qui s'occuperont de la partie réseau, je vous conseille d'installer l'extension "Thunder Client" disponible dans Vscode.
Cette extension vous permettra de tester vos requetes. 

## Game Engine
J'ai fais quelques classes pour le game engine mais ils ne sont la que pour l'exemple et pour donner une idée générale, ce n'est pas fonctionnel.
