import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import setupSocket from "./socket.js";

// loading environment variable into process.env
dotenv.config();

const app = express();  // using express for backend server

const databaseURL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 8747;
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];

// using cors to enable interaction of multiple servers
app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    })
);

app.use(cookieParser()); // using cookieParser to access cookies for user auth
app.use(express.json()); // converting express server payload body to json format
app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);

// Connecting to mongoDB Atlas server for database
mongoose.connect(databaseURL, {})
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err.message));

const server = createServer(app);
setupSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
