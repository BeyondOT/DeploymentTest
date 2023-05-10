import { ObjectId } from "mongodb";
import ReqModel, { IReq } from "../models/request.model";

export const requestInsert = async (req: IReq): Promise<IReq | Error> => {
    try{
        let ifReq: IReq[] | null = await ReqModel.find( { $and: [ {"id1":req.id1}, {"id2":req.id2} ] } );
        if(ifReq==null){
            let insertedReq: IReq = await ReqModel.create(req);
            return insertedReq;
        } else {return new Error("Error: requestInsert(existe deja)")};
    } catch(error) {
        return new Error("Error: requestInsert(Error)");
    }
};

export const requestAccept = async (req: IReq): Promise<IReq | null | Error> => {
    try{
        let updatedReq: IReq | null = await ReqModel.findOneAndUpdate(
            {"_id":req.id},
            {$set: {accepted: true}}, 
            {new:true}
        );
        return updatedReq;
    } catch(error) {
        return new Error("Error: requestAccept");
    }
}

export const requestRemoveById = async (req: ObjectId): Promise<number | Error> => {
    try{
        let deletedReq = await ReqModel.deleteOne( {_id:req});
        return deletedReq.deletedCount;
    } catch(error) {
        return new Error("Error: requestRemoveById");
    }
};