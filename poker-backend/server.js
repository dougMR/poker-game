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

console.log("hello from server.js");

import { clearSeat } from "./seats.js";
import { addPlayer, removePlayerById } from "./players.js";
import { players } from "./config.js";
import { game } from "./game.js";
import { betting } from "./betting.js";

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

// const joinGame = (socket) => {
//     console.log("\n\rjoin_game", socket.id);
// const { error } = addPlayer(socket.id);
// if (error) {
//     console.log("error joining: ", error);
//     socket.emit("setJoined", false);
// } else {
//     socket.emit("setJoined", true, (answer) => {
//         console.log("\nANSWER:", answer, "\n");
//     });
// }
// broadcast to all players
// io.emit("updatePlayers", players);
// };

const emitPlayers = () => {
    console.log("emitPlayers()");
    // Send players state to all players
    const playersClientVersion = players.map((p) => p.clientVersion);
    // console.log('playersClientVersion:',playersClientVersion);
    // for(const p of players){
    //     console.log(p.id);
    // }
    // for(const p of playersClientVersion){
    //     console.log(p.id);
    // }
    io.emit("updatePlayers", playersClientVersion);
};

const emitGame = () => {
    // Send game state to all players
    const gameForClient = game.getClientVersion();
    console.log("emitGame())");
    io.emit("updateGame", gameForClient);
};

const emitBetting = () => {
    console.log("emitBetting()");
    const bettingForClient = {
        pot: betting.pot,
        currentBettor: betting.currentBettor.clientVersion,
        inAnteRound: betting.inAnteRound,
        minBet: betting.getMinBet(),
    };
    // console.log(
    //     "betting.currentBettor:",
    //     betting.currentBettor.name,
    //     betting.currentBettor.id
    // );
    // console.log(
    //     "bettingForClient.currentBettor:",
    //     bettingForClient.currentBettor.id
    // );
    io.emit("updateBetting", bettingForClient);
};

const output = (message, add) => {
    io.emit("output", message, add);
};

//////////////////////////////////////////////////////////////////////
// v SOCKET LISTENERS v
////////////////////////

io.on("connection", (socket) => {
    console.log(`\n\rUser Connected: ${socket.id}`);

    // socket.emit("message", `connection noted for player ID ${socket.id}`);

    socket.on("join_game", (playerName, callback) => {
        // Manual join
        console.log("join_game", playerName);
        const result = addPlayer(playerName, socket.id);
        if (result?.success) {
            emitPlayers();
            emitGame();
        }
        callback(result);
        socket.emit("output", "Hello, " + playerName);
        socket.emit("output", "from Server", true);
    });

    socket.on("start_game", (gameType) => {
        console.log("start_game", gameType);
        game.startGame(gameType);
        // emitGame();
        // emitPlayers();
    });

    socket.on("bettor_action", (action, amount) => {
        console.log("bettor_action", action, amount);
        switch (action) {
            case "bet":
                betting.bet(amount);
                break;
            // case "raise":
            //     break;
            case "check":
                betting.check();
                break;
            case "call":
                betting.call();
                break;
            case "fold":
                betting.fold();
                break;
            case "draw":
            case "trade":
                players.find((p) => p.id === socket.id).hand.tradeCards();
                betting.nextBettor();
                break;
            case "discard":
                players.find((p) => p.id === socket.id).hand.discard();
                betting.nextBettor();
                break;
            default:
            // check?
        }
    });

    socket.on("update_card", (playerId, clientCard) => {
        console.log("update_card");
        const card = players
            .find((p) => p.id === playerId)
            .hand.cards.find((c) => c.name === clientCard.name);
        // console.log('card:',card);
        // console.log('clientCard:',clientCard);
        /*
            {
                name: this.string,
                string: this.string,
                isWild: this.isWild,
                markedToTrade: this.markedToTrade,
                facing: this.facing,
            }
            */
        card.markedToTrade = clientCard.markedToTrade;
        card.facing = clientCard.facing;
        // console.log('updated card:',card);
    });

    // socket.on("player_ready", (isReady, callback) => {
    //     if (!players[socket.id]) {
    //         addPlayer(socket.id);
    //     }
    //     playerReady(socket.id);
    //     callback(players[socket.id].isReady);

    //     // if all players ready, start game
    //     if (checkAllPlayersReady()) {
    //         startGame();
    //     }

    //     io.emit("updatePlayers", players);
    // });

    // socket.on("connect_error", (err) => {
    //     console.log(`\nconnect_error due to ${err.message}\n`);
    // });

    // socket.on("update_player", (clientPlayer) => {
    //     players[socket.id] = { ...clientPlayer };
    //     // to all players except socket sender
    //     socket.broadcast.emit("updatePlayer", socket.id, clientPlayer);
    // });

    socket.on("disconnect", (reason) => {
        // this gets called automatically when client disconnects
        console.log("\n\rDISCONNECT");
        console.log("reason: ", reason);
        socket.emit("message", `disconnected from player ID ${socket.id}`);
        clearSeat(socket.id);
        removePlayerById(socket.id);
        emitPlayers();
        // io.emit("updatePlayers", players);
    });

    // socket.on("disconnect_client", (clientUser) => {
    //     // this is a manual disconnect request
    //     console.log("disconnect_client", socket.id);
    //     removePlayer(socket.id);
    //     disconnectUser(socket.id);
    //     io.emit("updatePlayers", players);
    // });
});

app.get("/", (req, res) => {
    res.send({ hello: "world" });
});

// server.listen(3011, () => {
//     console.log("Server is running on port 3011");
// });
server.listen(3011, () => {
    console.log("server running!  It Lives!");
});

export { emitPlayers, emitGame, emitBetting, output };
