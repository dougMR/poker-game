/*

https://www.geeksforgeeks.org/how-to-manage-users-in-socket-io-in-node-js/
https://www.youtube.com/watch?v=djMy4QsPWiI

*/

import express from "express";
import cors from "cors";
const app = express();
app.use(cors());

// socket.io setup
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server, {
    // frontend should ping every 2 secs
    pingInterval: 2000,
    // if we don't hear from client in 5 secs, time out
    pingTimeout: 5000,
    cors: {
        // origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

//
//     ^ IMPORTS AND SETUP ^
//
//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
//
//     v INIT VARIABLES v
//

////////////////////////
// v SOCKET FUNCTIONS v
////////////////////////
const getSocketById = (id) => {
    return io.sockets.sockets.get(id);
};
const disconnectUser = (id) => {
    getSocketById(id).disconnect();
};

const joinGame = (socket) => {
    console.log("\n\rjoin_game", socket.id);
    // console.log("original id: ", originalId);
    const { error } = addPlayer(socket.id);
    if (error) {
        console.log("error joining: ", error);
        socket.emit("setJoined", false);
    } else {
        socket.emit("setJoined", true, (answer) => {
            console.log("\nANSWER:", answer, "\n");
        });
    }
    // broadcast to all players
    io.emit("updatePlayers", players);
};

//////////////////////////////////////////////////////////////////////
// v SOCKET LISTENERS v
////////////////////////

io.on("connection", (socket) => {
    console.log(`\n\rUser Connected: ${socket.id}`);

    socket.emit("message", `connection noted for player ID ${socket.id}`);

    // Auto join when connect
    joinGame(socket);

    socket.on("join_game", () => {
        // Manual join
        joinGame(socket);
    });

    socket.on("connect_error", (err) => {
        console.log(`\nconnect_error due to ${err.message}\n`);
    });

    socket.on("update_player", (clientPlayer) => {
        players[socket.id] = { ...clientPlayer };
        // to all players except socket sender
        socket.broadcast.emit("updatePlayer", socket.id, clientPlayer);
    });

    socket.on("disconnect", (reason) => {
        // this gets called automatically when client disconnects
        console.log("\n\rDISCONNECT");
        console.log("reason: ", reason);
        socket.emit("message", `disconnected from player ID ${socket.id}`);
        removePlayer(socket.id);
        io.emit("updatePlayers", players);
    });

    socket.on("disconnect_client", (clientUser) => {
        // this is a manual disconnect request
        console.log("disconnect_client", socket.id);
        removePlayer(socket.id);
        disconnectUser(socket.id);
        io.emit("updatePlayers", players);
    });
});

app.get("/", (req, res) => {
    res.send({ hello: "world" });
});

// server.listen(3011, () => {
//     console.log("Server is running on port 3011");
// });
server.listen(3000, () => {
    console.log("server running!  It Lives!");
});
