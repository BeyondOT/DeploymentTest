# IA

## Phase 1

### Général

- [X] deviner()

Dès qu'un coup est joué, si la carte jouée est un cul de sac, alors le joueur 
qui a joué est suspecté d'être un saboteur et le cul-de-sac est marqué.

- [X] piocher()

Défausse la carte la moins intéressante de sa main.

- [X] jouer()

Choisit au hasard un coup possible.

### Mineur

- [X] construireChemin()

Continue le chemin le plus long vers un des objectifs ou vers l'or si elle a 
été révélée.

- [X] saboterChemin()

Supprime le dernier cul-de-sac posé.

- [X] saboterJoueur()

Sabote l'outil du saboteur ayant le moins d'outils cassés.

- [X] reparerJoueur()

Répare ses outils cassés.

- [X] reveler()

Révèle une carte s'il ne connait pas la position de l'or.


### Saboteur

- [X] construireChemin()

Pose des culs-de-sac sur le chemin le plus long.

- [X] saboterChemin()

Supprime un chemin à côté de l'échelle.

- [X] saboterJoueur()

Sabote l'outil du mineur ayant le moins d'outils cassés.

- [X] reparerJoueur()

Répare ses outils cassés.


## Phase 2

### Mineur

- [ ] saboterChemin()

Supprime le cul-de-sac le plus gênant.

- [ ] reparerJoueur()

Peut également réparer les outils d'un allié.


### Saboteur

- [ ] reparerJoueur()

Peut également réparer les outils d'un allié.

- [ ] feinter()

Joue comme s'il était mineur.
