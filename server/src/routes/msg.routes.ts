
import express from "express";
import { msgAdd, msgGetAll, msgGetReceivedById, msgGetSentById, msgGetBetweenTwoUsers,msgRemove } from "../controllers/msg.controller";
const msgRoutes = express.Router();


msgRoutes.post("/add", msgAdd);
msgRoutes.get("/getAll", msgGetAll);
msgRoutes.get("/getSentById/:id", msgGetSentById);
msgRoutes.get("/getReceivedById/:id", msgGetReceivedById);
msgRoutes.get("/getBetweenTwoUsers/:ida/:idb", msgGetBetweenTwoUsers);
msgRoutes.delete("/remove", msgRemove);


export default msgRoutes;


