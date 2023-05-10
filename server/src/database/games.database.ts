import GamesModel, { IGames } from "../models/games.model";
import { ObjectId } from "mongoose";
import { IUser } from "../models/user.model";

export const gamesInsert= async (game:IGames): Promise<IGames | Error> => {
    try {
        let insertedGame: IGames = await GamesModel.create(game);
        return insertedGame;
    } catch(error){
        return new Error("Error: gamesInsert");
    }
}

export const gamesRemoveById= async (id: ObjectId): Promise<number | Error> => {
    try {
        let deletedGame = await GamesModel.deleteOne({"_id":id});
        return deletedGame.deletedCount;
    } catch(error){
        return new Error("Error: gamesRemoveById");
    }
}

export const gamesFindById= async (id: ObjectId): Promise<IGames | null | Error> => {
    try{
        let game: IGames | null = await GamesModel.findById({"_id":id});
        return game;
    } catch(error){
        return new Error("Error: gamesFindById");
    }
}

export const gamesFindByUserId= async (id: ObjectId): Promise<IGames | null | Error> => {
    try{
        let game: IGames | null = await GamesModel.findOne({"id_user":id});
        return game;
    } catch(error){
        return new Error("Error: gamesFindByUserId");
    }
}

export const gamesFindUserByGamesId= async (id: ObjectId): Promise<IUser | null | Error> => {
    try{
        let user: IUser | null = await GamesModel.findOne({"id_user":id}).populate("id_user");
        return user;
    } catch(error){
        return new Error("Error: gamesFindUserByGamesId");
    }
}