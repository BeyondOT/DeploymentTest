import express from "express";
import { gamesAdd, gamesDeleteById, gamesGetAll, gamesGetById,gamesGetAllByPlayerId } from "../controllers/game.controller";
const  gameRoutes = express.Router();

gameRoutes.get("/getgames", gamesGetAll);
gameRoutes.get("/getgame/:id", gamesGetById);
gameRoutes.post("/addgame", gamesAdd);
gameRoutes.patch("/delgame", gamesDeleteById);
gameRoutes.get("/getgamesbyplayerid/:id", gamesGetAllByPlayerId);

export default gameRoutes;