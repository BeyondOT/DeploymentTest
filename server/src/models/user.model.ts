import mongoose, { Document, Schema } from "mongoose";
import isEmail from "validator/lib/isEmail";

export interface IUser extends Document {
  _id: string;
  pseudo: string;
  email: string;
  games: number;
  win: number;
  friends: string[] | IUser[];
  password: string;
  gold: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    games: {
      type: Number,
      default: 0,
    },
    win: {
      type: Number,
      default: 0,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    gold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("users", userSchema);
export default UserModel;
