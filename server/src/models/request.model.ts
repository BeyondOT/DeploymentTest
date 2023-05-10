import { Schema, ObjectId, Document } from "mongoose";
import mongoose from "mongoose";

export interface IReq extends Document{
    _id: ObjectId;
    id1: String;    //id1 send a friend request to id2
    id2: String;
    accepted: boolean;
};

const reqSchema = new Schema<IReq>({
    id1: {
        type: String,
        required: true,
    },
    id2: { type: String,
        required: true,
    },
    accepted: {
        type: Boolean,
        default: false,
    },
});


const ReqModel = mongoose.model<IReq>("req", reqSchema);
export default ReqModel;