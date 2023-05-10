import { ObjectId } from "mongoose";
import MsgModel, { IMsg } from "../models/msg.model";

export const msgInsert = async (msg:IMsg): Promise<IMsg | Error> => {
    try{
        let insertedMsg: IMsg = await MsgModel.create(msg);
        return insertedMsg;
    } catch(error){
        return new Error("Error: msgInsert");
    }
}

export const msgFind = async (ida:String, idb:String): Promise<IMsg[] | null | Error> => {    //id1 send to id2
    try{
        let msg: IMsg[] | null = await MsgModel.find({"id1":ida, "id2":idb}).limit(10);
        return msg;
    } catch(error){
        return new Error("Error: msgFind");
    }
}

export const msgRemoveById = async (id: ObjectId): Promise<number | Error> => {
    try{
        let deletedMsg= await MsgModel.deleteOne({"_id":id});
        return deletedMsg.deletedCount;
    } catch(error){
        return new Error("Error: msgRemoveById");
    }
}