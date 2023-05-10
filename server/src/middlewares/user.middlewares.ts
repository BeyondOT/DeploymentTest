import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";

export interface IGetUserAuthInfoRequest extends Request {
  user?: IUser; // or any other type
}

export const authenticateToken = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.jwt as string;
  /* console.log(token); */
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
  // TODO: Rajouter une verification pour check si le token est la !!!!!!!!!!!!!
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) {
      return res.status(401).json(err);
    }
    req.user = user as IUser;

    next();
  });
};
