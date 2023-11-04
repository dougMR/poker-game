import { dealAll, dealCard, clientPlayer, players, game } from "./main.js";
import { betting } from "./betting.js";
import { addPlayer } from "./main.js";
import { view } from "./view.js";
// ----------------------------------- dev tools ------------------------------------

let handSelected = null;
const tools = document.getElementById("dev-controls");

// Separate all this between Server and Client-only
const bettingControls = document.getElementById("bet-controls");

tools.querySelector(".deal").addEventListener("pointerdown", (event) => {
    console.log("deal button");
    // Deal cards - how many?
    let currentPlayer = clientPlayer;
    let numCards = Number(prompt("How many?", "5"));
    // console.log('numCards',numCards);
    dealAll(numCards);
});
tools.querySelector(".trade").addEventListener("pointerdown", (event) => {
    handSelected.tradeCards();

    // clientPlayer.hand.displayHand();
});
tools.querySelector(".discard").addEventListener("pointerdown", (event) => {
    handSelected.discardCards();
    // clientPlayer.hand.displayHand();
});
tools.querySelector(".show-hand").addEventListener("pointerdown", (event) => {
    handSelected?.showHand();
});
tools.querySelector(".hide-hand").addEventListener("pointerdown", (event) => {
    handSelected?.hideHand();
});
tools.querySelector(".bet").addEventListener("pointerdown", (event) => {
    const amount = Number(prompt("How much?", "5"));
    // betting.addToBet(amount);
    betting.currentBettor.stack -= amount;
    betting.bet(amount);
});
tools.querySelector(".call").addEventListener("pointerdown", (event) => {
    betting.call();
});
tools.querySelector(".showdown").addEventListener("pointerdown", (event) => {
    game.showdown();
});
tools.querySelector(".start-game").addEventListener("pointerdown", (event) => {
    game.startGame("7 Card Stud");
});
tools.querySelector(".next-phase").addEventListener("pointerdown", (event) => {
    game.nextPhase();
});
tools.querySelector(".num-players").addEventListener("pointerdown", (event) => {
    let numPlayers = Number(prompt("How many?", "5"));
    for (let i = 0; i < numPlayers - 1; i++) {
        const newPlayer = addPlayer("AI-" + i);
        // console.log("newPlayer: ", newPlayer);
        newPlayer.stack = 50;
    }
});
// tools.querySelector(".auto-play").addEventListener("pointerdown", (event) => {
//     startGame();

// });

const setHandsSelection = () => {
    for (const p of players) {
        const hand = p.hand;
        const element = hand.displayElement;
        element.addEventListener("pointerdown", (event) => {
            handSelected = hand;
        });
    }
};

setTimeout(setHandsSelection, 1);
