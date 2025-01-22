import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";

// loading environment variable into process.env
dotenv.config();

const app = express();  // using express for backend server

const databaseURL = process.env.DATABASE_URL;

// using cors to enable interaction of multiple servers
app.use(
    cors({
        origin: '*',
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    })
);

app.use(cookieParser()); // using cookieParser to access cookies for user auth
app.use(express.json()); // converting express server payload body to json format

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);

// Connecting to mongoDB Atlas server for database
mongoose.connect(databaseURL, {})
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err.message));

// The Vercel function should be exported and not listen on a port
export default app;
