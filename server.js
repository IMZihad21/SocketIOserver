import express from 'express';
const app = express();
import { createServer } from 'http';
const server = createServer(app);
import { config } from 'dotenv';
import { Server } from "socket.io";

config();
const PORT = process.env.PORT || 7000;

const io = new Server(server);

io.on("connection", (socket) => {
    console.log(`*Client connected: ${socket.id}`);
    const { roomName } = socket.handshake.query;
    if (roomName) {
        socket.join(roomName);
        socket
            .to(roomName)
            .emit("newMember", { msg: `${socket.id} joined the chat!`, sender: "server" });
        console.log(`*Client joined room: ${roomName}`);

        socket.on("message", (msg, callback) => {
            socket.to(roomName).emit("updateMessage", msg);
            callback(msg);
        });

        socket.on("disconnect", (reason) => {
            console.log(`*Client disconnected: ${reason}`);
            socket
                .to(roomName)
                .emit("exitMember", { msg: `${socket.id} left the chat!`, sender: "server" });
        });
    } else {
        socket.broadcast.emit("newMember", {
            msg: `${socket.id} joined the chat!`,
            sender: "server"
        });

        socket.on("message", (msg, callback) => {
            socket.broadcast.emit("updateMessage", msg);
            callback(msg);
        });

        socket.on("disconnect", (reason) => {
            console.log(`*Client disconnected: ${reason}`);
            socket.broadcast.emit("exitMember", {
                msg: `${socket.id} left the chat!`,
                sender: "server"
            });
        });
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});