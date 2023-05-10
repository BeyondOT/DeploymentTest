import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "./config/database";
//import { routes } from "./routes";
import cookieParser from "cookie-parser";
import SwaggerUI from "swagger-ui-express";
import * as swaggerDocument from "../swagger.json";
import authRoutes from "./routes/auth.routes";
import gameRoutes from "./routes/game.routes";
import msgRoutes from "./routes/msg.routes";
import userRoutes from "./routes/user.routes";
import { SocketManager } from "./sockets/SocketManager";

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));

const corsOptions: CorsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "https://217.160.170.97"],
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type", "Authorization", "jwt"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/users", userRoutes);
app.use("/api/msg", msgRoutes);
//app.use(routes);
// Sockets
const socketManager = new SocketManager(io);
socketManager.init();

app.use(express.static(__dirname + "/dist"));

httpServer.listen(process.env.PORT, () =>
  console.log(`Server is running on Port ${process.env.PORT}`)
);
