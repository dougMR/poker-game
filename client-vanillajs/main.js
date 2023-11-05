import { compareHands, getHandName } from "./compare-hands.js";
import { getCombinations } from "./combinations.js";
import { Player } from "./class-player.js";
import { Hand } from "./class-hand.js";
import {
    seats,
    assignNextSeat,
    assignClientSeat,
    getNextOccupiedSeat,
} from "./seats.js";
// import "./tree.js";
import { betting } from "./betting.js";
import "./dev-tools.js";
import { view } from "./view.js";
import "./client-only.js";
import { game, players, addPlayer, dealAll, dealCard } from "./game.js";

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



// const showdownPlayerVai = (hand1, hand2) => {
//     //
//     const result = compareHands(hand1, hand2);
//     const bet = Number(betSpan.innerHTML);
//     if (result === "WIN") {
//         addToStack(bet * 2);
//         player.hand.showHandWon();
//     } else if (result === "LOSE") {
//         aiPlayer.hand.showHandWon();
//     }

//     betSpan.innerHTML = "0";
//     const playerHandName = getHandName(player.hand);
//     const aiHandName = getHandName(aiPlayer.hand);

//     // view.output(
//     //     `player hand <br /><strong>${playerHandName}</strong><br /><br /> opponent hand<br /><strong>${aiHandName}</strong><br />`
//     // );
//     // view.output(`Player <strong>${result}</strong> $${bet}`, true);
// };

// ////////////////////////////////////////////////////////
// SAMPLE GAME
// /////////////

// const addToStack = (amount) => {
//     playerStack += amount;
//     playerStackEl.innerHTML = "$" + playerStack;
// };

// const showControls = (elToShow) => {
//     betControls.style.display = "none";
//     showdownButton.style.display = "none";
// };

// Play a hand - of 5 card draw

// const cardsToTrade = [];
// let playerStack = 100;

// const tradeButton = document.querySelector("#controls .trade");
// const showdownButton = document.querySelector("#controls .showdown");
// const nextHandButton = document.querySelector("#controls .next-hand");
// const betControls = document.querySelector("#controls .betting");

// const playerStackEl = document.querySelector("#player-stack");
// const handsEl = document.querySelector("#hands");

// const player = new Player('player');

// for (let i = 0; i < 7; i++) {
//     addPlayer("AI-" + i).stack = 50;
// }

// console.log("players", players);
// const aiPlayer = addPlayer("ai");
// const aiPlayer2 = addPlayer("ai 2");

// console.log("seats:", seats);
// player.hand = new Hand(player, deck);
// aiPlayer.hand = new Hand(aiPlayer, deck);

// for (const p of players) {
//     handsEl.append(p.hand.displayElement);
// }

/*
showdownButton.addEventListener("pointerdown", (event) => {
    aiPlayer.hand.showHand();
    // Find winner
    showdownPlayerVai(player.hand.handString, aiPlayer.hand.handString);
    // show appropriate controls
    tradeButton.style.display = "none";
    betControls.style.display = "none";
    showdownButton.style.display = "none";
    nextHandButton.style.display = "inline";
});

nextHandButton.addEventListener("pointerdown", (event) => {
    startHand();
});

*/

view.output("Hello World");


// const str = "Hello";
// const myAr = str.split(" ");
// console.log('myAr:',myAr);

// let currentGame = null;


const autoStart = () => {
    for (let i = 0; i < 5; i++) {
        const newPlayer = addPlayer("AI-" + i);
        // console.log("newPlayer: ", newPlayer);
        newPlayer.stack = 50;
    }

    game.startGame("7 Card Stud");
    // game.nextPhase();
};

const clientPlayer = setClientPlayer("player", true);
clientPlayer.stack = 50;
autoStart();

export { dealAll, dealCard, clientPlayer, players, addPlayer };
