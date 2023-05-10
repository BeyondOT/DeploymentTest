import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";


interface JwtPayload {
    id: string;
}




// dont forget to create a config jwt secret
// jwtPayload = <any>jwt.verify(token, config.jwtSecret);
//  const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
const SECRET="saboteur"
// function to check authorization

 export const  authorize = async (req: Request, res: Response, next: NextFunction) => {
    if(req.headers.authorization){
    try {
        const {token} = req.cookies;
        if(!token){
            return next('Please login to access the data');
        }
        const verify = await jwt.verify(token, SECRET) as JwtPayload;
        const user = await User.findById(verify.id);
        if (!user) {
            return next('User not found');
          }
        req.body.userId = user.id;
        next();
    } catch (error) {
       return next(error); 
    }
}
  };

  

