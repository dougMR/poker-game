// import { compareHands } from "./compare-hands-bitwise.js";
// import { getCombinations } from "./combinations.js";
import { Player } from "./class-player.js";
import { Hand } from "./class-hand.js";
import {
    seats,
    assignNextSeat,
    assignClientSeat,
    getNextOccupiedSeat,
} from "./seats.js";
import { betting } from "./betting.js";
import "./dev-tools.js";
import { view } from "./view.js";
import "./client-only.js";
import { game, players, addPlayer, dealAll, dealCard } from "./game.js";
import "./game-settings.js";

const sayHello = () => {
    console.log("hello");
};

const setClientPlayer = (name) => {
    return addPlayer(name, true);
};

// /////////////////////////////////////////////////////

const getHandWithSuits = (hand) => {
    hand = hand.replaceAll("C", "♣️");
    hand = hand.replaceAll("D", "♦️");
    hand = hand.replaceAll("H", "♥️");
    hand = hand.replaceAll("S", "♠️");
    return hand;
};

// view.output("Hello World");

const autoStart = () => {
    for (let i = 0; i < 6; i++) {
        const newPlayer = addPlayer("AI-" + i);
        newPlayer.stack = 50;
    }
    // game.startGame("7 Card Stud")
    game.startGame("5 Card Draw");
    // game.startGame("Baseball");
};

const clientPlayer = setClientPlayer("player", true);
clientPlayer.stack = 50;
autoStart();

export { dealAll, dealCard, clientPlayer, players, addPlayer };
