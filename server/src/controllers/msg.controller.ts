import { Request, Response } from "express";
import MsgModel from "../models/msg.model";
import { msgInsert, msgFind, msgRemoveById } from "../database/msg.database";
import { IMsg } from "../models/msg.model";
import { ResponseLayout,ResponseError } from "@shared/api";


// function to add a message

export const msgAdd = async (req: Request, res: Response) => {
    const msg = req.body.msg;
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const msgin  = { id1: sender, id2: receiver, msg: msg, date_heure: new Date() };
    try {
        const insertedMsg = await msgInsert(msgin as IMsg);
        let response: ResponseLayout = { message: "message added" };
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: "error" });
    }
};


//function to get all messages

export const msgGetAll = async (req: Request, res: Response) => {
    try {
        const msg:IMsg[] = await MsgModel.find().limit(100);
        
        res.status(200).json({rep:msg, message: "messages found"});
    } catch (error) {
        res.status(400).json({ message: "error" });
    }
};


// function to get a message sent  by user id

export const msgGetSentById = async (req: Request, res: Response) => {
     const userid:string = req.params.id;
        try {
            const msg = await MsgModel.find({"id1":userid}).limit(10);
            res.status(200).json({rep:msg, message: "messages sent by user found"});
        
        } catch (error) {
            res.status(400).json({ message: "error" });
        }
};


// function to get a message received by user id

export const msgGetReceivedById = async (req: Request, res: Response) => {
    const userid:string = req.params.id;
        try {
            const msg = await MsgModel.find({"id2":userid}).limit(10);
            res.status(200).json({rep:msg, message: "messages recieved by user found"});
        
        } catch (error) {
            res.status(400).json({ message: "error" });
        }
} ;

// function to get messages sent between two users
export const msgGetBetweenTwoUsers = async (req: Request, res: Response) => {
    const ida:string = req.params.ida;
    const idb:string = req.params.idb;
    try {
        const msg = await msgFind(ida, idb);
        res.status(200).json({rep:msg, message: "messages exchanged between users found"});
       
    } catch (error) {
        res.status(400).json({ message: "error" });
    }
};

export const msgRemove = async (req: Request, res: Response) => {
    const id = req.body.id;
    try {
        const deletedMsg = await msgRemoveById(id);
        res.status(200).json({rep:deletedMsg, message: "message deleted" });
    } catch (error) {
        res.status(400).json({ message: "error" });
    }
}