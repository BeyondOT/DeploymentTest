# Socket

Documentation des échanges entre le front et le back.

## Evènements reçus par le serveur

### "connection"

- socket (Socket) la socket du client

**Déclenchement :** Déclenché lors de la connection au serveur.

**Action :** Un nouveau Player est associé à la socket et les handlers sont appelés.

**Callback :** N'émet rien en retour.

### "authSuccess"

- data (IAuthSocket) les informations sur le propriétaire de la socket.

**Déclenchement :** Déclenché lors de l'arrivée sur la *homepage*.

**Action :** Le SocketPlayer est initialisé.

**Callback :** 'ok' en cas de succès, 'failed' sinon avec un message d'erreur.

### "createRoom"

- roomParam (CreateRoomParam) les paramètres de la room à créer

**Déclenchement :** Déclenché lorsque le client clique sur le bouton 
*Create Party!*.

**Action :** Crée une nouvelle room avec les paramètres demandés si c'est 
possible et y fait entrer le joueur. 

**Callback :** 'ok' en cas de succès, 'failed' sinon avec un message d'erreur.

### "joinRoom"

- roomParam (CreateRoomParam) les paramètres de la room à rejoindre

**Déclenchement :** Déclenché lorsque le client clique sur le bouton 
*Join Party*.

**Action :** Rejoint la room demandée.

**Callback :** 'ok' en cas de succès, 'failed' sinon avec un message d'erreur.


### "createGameTest"

- roomParam (CreateRoomParam) les paramètres de la room à créer.

**Déclenchement :** Déclenché lorsque le client clique sur le bouton 
*Create Party!* en ayant coché la case *Game Test*.

**Action :** Créer une room et lance une partie avec 2 IAs qui ne font que des 
discards.

**Callback :** 'ok' en cas de succès, 'failed' sinon avec un message d'erreur.

### "disconnect"

- roomParam (CreateRoomParam) les paramètres de la room à rejoindre

**Déclenchement :** Déclenché lorsqu'une socket se déconnecte.

**Action :** Supprime le joueur de la room où il était, le remplace 
éventuellement par une IA et supprime la room si c'était le dernier joueur.

**Callback :** Aucun.

### "playerPlayed"

- move (Move) le coup joué

**Déclenchement :** Déclenché lorsque le joueur joue un coup.

**Action :** L'état du jeu est mis-à-jour à partir du coup joué.

**Callback :** 'ok' en cas de succès, 'failed' sinon avec un message d'erreur.

### "sendChatMessage"

-msg (IMessage) le message reçu

**Déclenchement :** Déclenché lorsque le joueur envoie un chat lors d'une partie.

**Action :** Le message est retransmis à tous les autres joueurs s'il est valide.

**Callback :** 'ok' en cas de succès, 'failed' sinon avec un message d'erreur.

### "sendDM"

-msg (IMessage) le message reçu

**Déclenchement :** Déclenché lorsque le joueur envoie un DM dans la *homepage*.

**Action :** Le message est retransmis au destinataire s'il est valide.

**Callback :** 'ok' en cas de succès, 'failed' sinon avec un message d'erreur.

## Evènements émis par le serveur

### "endOfRound"

- state (IEnd) l'état de fin de round

**Déclenchement :** Déclenché lorsqu'une équipe gagne le round.

### "updatePlayerState"

- playerInfos (PlayerInfos) les informations privées d'un joueur.

**Déclenchement :** Déclenché une fois au début de la partie, puis à chaque fois 
qu'un joueur fait un update.

### "updateGameState"

- gameState (GameState) les informations publiques de la partie.

**Déclenchement :** Déclenché une fois au début de la partie, puis à chaque fois 
qu'un joueur fait un update.

### "gameBegins"

- initialSend (IInitialSend) les playerInfos et le gameState.

**Déclenchement :** Déclenché lorsque la room est pleine.

### "lobbyInfos"

- data (ILobbyInfos) la liste des joueurs et un message d'info.

**Déclenchement :** Déclenché lorsqu'un joueur rejoint ou quitte la room.

### "receiveChatMessage"

-msg (IMessage) le message reçu

**Déclenchement :** Déclenché lorsque le serveur reçoit un chat dans une partie.

### "recvDM"

-msg (IMessage) le message reçu

**Déclenchement :** Déclenché lorsque le serveur reçoit un DM dans la *homepage*.