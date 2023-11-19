import { players } from "./config.js";
// import { emitPlayers } from "./server.js";
import { Player } from "./class-player.js";
import { Hand } from "./class-hand.js";
import { assignNextSeat } from "./seats.js";

console.log("hello from players.js");

const maxPlayers = 8;

const addPlayer = (name, id) => {
    // All players will be Client once Server is implemented
    console.log("addPlayer()", name);
    if (players.length >= maxPlayers) {
        return { error: "Maximum players reached.  Can't add more." };
    }
    if (
        !players.some(
            (player) => player.name.toLowerCase() === name.toLowerCase()
        )
    ) {
        const newPlayer = new Player(name, id);
        newPlayer.seat = assignNextSeat(newPlayer);
        newPlayer.hand = new Hand(newPlayer);
        newPlayer.stack = 100;
        players.push(newPlayer);
        return { success: `${newPlayer.name} added to game.` };
    }
    return { error: "Please choose another name." };
};

const removePlayerById = (id) => {
    console.log("removePlayer()", id, players.find((p) => p.id === id)?.name);
    const playerIndex = players.findIndex((p) => p.id === id);
    players.splice(playerIndex, 1);
};

export { addPlayer, removePlayerById };
