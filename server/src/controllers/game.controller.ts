import { Request, Response } from "express";
import GamesModel, { IGames } from "../models/games.model";
import { Schema, Document } from "mongoose";
import mongoose from "mongoose";



import { gamesInsert, gamesRemoveById, gamesFindById ,gamesFindByUserId,gamesFindUserByGamesId} from "../database/games.database";



// function to get all games 
export const gamesGetAll = async (req: Request, res: Response) => {
    try {
        const games = await GamesModel.find();
        res.status(200).json({rep:games, message: "all games found"});
    }
    catch (error) {
        res.status(400).json({ message: "error" });
    }
};

// function to get a game by id
export const gamesGetById = async (req: Request, res: Response) => {
  
    try{
        //const id = req.params.id;
        const id = req.params.id;     
        // cast id to ObjectId Schema.Types.ObjectId
     
        const game = await GamesModel.findById({"_id":id});
        res.status(200).json({rep:game, message: "game found by id"});

    }catch (error) {
            res.status(400).json({ message: "error" });
    }
        
        
 };


// function to add a game
export const gamesAdd = async (req: Request, res: Response) => {
    try {
        
        //create a new game
        const game: IGames = new GamesModel();
        //get the id of the user
        game.id_user = req.body.id_user;
        //get the date of the game and set it to the current date
        game.date_debut = new Date();
        game.en_cours = req.body.en_cours;
        const insertedGame = await gamesInsert(game);
        res.status(200).json({rep:insertedGame, message: "inserted game"});
    }
    catch (error) { 
         
        res.status(400).json({ message: "error" });
    }
};


// function to delete a game by id
export const gamesDeleteById = async (req: Request, res: Response) => {

    try {
       const id = req.body.id;
       const deletedGame = await gamesRemoveById(id);
       //res.json(deletedGame);
       // send a message to the client to confirm the deletion
      res.status(200).json({rep:deletedGame, message: "game deleted"});
    }
    catch (error) {
        res.status(400).json({ message: "error" });

    }

};




//function to get all games played by a player by id
export const gamesGetAllByPlayerId = async (req: Request, res: Response) => {
    const userId = req.body.id;
    try { 
        // populate an array with all the games played by user 
        const games = await gamesFindByUserId(userId);
        res.status(200).json({rep:games, message: "games found by user id"});
        
    }catch (error) {
        res.status(400).json({ message: "error" });
    }

};