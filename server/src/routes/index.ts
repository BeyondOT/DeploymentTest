/*import express from 'express';
import { user_routes} from './user.routes';
import cors from 'cors';
import dotenv from 'dotenv';

import SwaggerUI from "swagger-ui-express";
import * as swaggerDocument from "../../swagger.json";



export const routes = express.Router();
routes.use(express.urlencoded({extended: true}));            // for application/json
routes.use(express.json()) 
routes.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocument)); 

routes.use(user_routes);


export default routes;*/