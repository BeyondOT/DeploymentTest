import { Schema, ObjectId, Document } from "mongoose";
import mongoose from "mongoose";

export interface IMsg extends Document{
   _id: ObjectId
   id1: String;       //id1 send to id2
   id2: String;
   msg: string;
   date_heure: Date;
}

const msgSchema = new Schema<IMsg>({
   id1: {
      type: String,
      required: true
   },
   id2: {
      type: String,
      required: true
   },
   msg: {
    type: String,
    required: true
   },
   date_heure: {
    type: Date,
    required: true
   },
});

const MsgModel = mongoose.model<IMsg>("msg", msgSchema);
export default MsgModel;