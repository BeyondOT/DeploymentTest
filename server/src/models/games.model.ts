import { Schema, Document, ObjectId } from "mongoose";
import mongoose from "mongoose";

export interface IGames extends Document{
    _id: ObjectId;
    id_user: String;
    en_cours: Boolean;
    duree: Number;  //en minute
    date_debut: Date;
}

const gamesSchema= new Schema<IGames>({
    id_user: {
        type: String,
        required: true
    },
    en_cours: {
        type: Boolean,
        required: true
    },
    duree: {
        type: Number,   //en minute
    },
    date_debut: {
        type: Date,
        required: true
    }
});

const GamesModel = mongoose.model<IGames>("games", gamesSchema);
export default GamesModel;