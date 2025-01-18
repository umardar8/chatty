import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";

// loading environment variable into process.env
dotenv.config();

const app = express();  // using express for backend server
const port = process.env.PORT || 3001 // port for server
const databaseURL = process.env.DATABASE_URL; // uri of database on mongoDB Atlas

// using cors to enable interaction of multiple servers
app.use(
    cors({
        origin: ["https://chatty-client-tau.vercel.app"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    })
);

app.use("/uploads/profiles", express.static("uploads/profiles"))

app.use(cookieParser()); // using cookieParser to access cookies for user auth
app.use(express.json()); // converting express server payload body to json format

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes)
app.use("/api/messages", messagesRoutes)

// starting express server for backend
const server = app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`)
});

setupSocket(server)

// connecting to mongoDB Atlas server for database
mongoose.connect(databaseURL, {})
    .then(() => console.log("database connected"))
    .catch(err=>console.log(err.message));