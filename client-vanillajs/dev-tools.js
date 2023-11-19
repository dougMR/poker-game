// import { dealAll, dealCard, clientPlayer, players } from "./main.js";
// import { betting } from "./betting.js";
import { startGame, game, betting, players, showNamePrompt } from "./main.js";
// import { game,addPlayer } from "./game.js";
import { view } from "./view.js";
// ----------------------------------- dev tools ------------------------------------

// let handSelected = null;
const tools = document.getElementById("dev-controls");

// Separate all this between Server and Client-only
const bettingControls = document.getElementById("bet-controls");

// tools.querySelector(".deal").addEventListener("pointerdown", (event) => {
//     console.log("deal button");
//     // Deal cards - how many?
//     let currentPlayer = clientPlayer;
//     let numCards = Number(prompt("How many?", "5"));
//     dealAll(numCards);
// });
// tools.querySelector(".trade").addEventListener("pointerdown", (event) => {
//     handSelected.tradeCards();
// });
// tools.querySelector(".discard").addEventListener("pointerdown", (event) => {
//     handSelected.discardCards();
// });
// tools.querySelector(".show-hand").addEventListener("pointerdown", (event) => {
//     handSelected?.showHand();
// });
// tools.querySelector(".hide-hand").addEventListener("pointerdown", (event) => {
//     handSelected?.hideHand();
// });
tools.querySelector(".start-game").addEventListener("pointerdown", (event) => {
    console.log("start-game button pressed");
    startGame();
});
// tools.querySelector(".start-game").addEventListener("pointerdown", (event) => {
//     console.log('start-game button pressed');
//     // game.startGame("7 Card Stud");
// });
// tools.querySelector(".bet").addEventListener("pointerdown", (event) => {
//     const amount = Number(prompt("How much?", "5"));
//     betting.bet(amount);
// });
// tools.querySelector(".call").addEventListener("pointerdown", (event) => {
//     betting.call();
// });
// tools.querySelector(".fold").addEventListener("pointerdown", (event) => {
//     betting.fold();
// });
// tools.querySelector(".showdown").addEventListener("pointerdown", (event) => {
//     game.showdown();
// });

// tools.querySelector(".next-phase").addEventListener("pointerdown", (event) => {
//     game.nextPhase();
// });

tools
    .querySelector(".show-betting-object")
    .addEventListener("pointerdown", (event) => {
        console.log("betting:", betting);
    });
tools
    .querySelector(".show-game-object")
    .addEventListener("pointerdown", (event) => {
        console.log("game:", game);
    });
tools
    .querySelector(".show-players-object")
    .addEventListener("pointerdown", (event) => {
        console.log("players:", players);
    });
tools
    .querySelector(".join-game")
    .addEventListener("pointerdown", (event) => {
        showNamePrompt();
    });
// tools.querySelector(".num-players").addEventListener("pointerdown", (event) => {
//     let numPlayers = Number(prompt("How many?", "5"));
//     for (let i = 0; i < numPlayers - 1; i++) {
//         const newPlayer = addPlayer("AI-" + i);
//         console.log('newPlayer:',newPlayer);
//         newPlayer.stack = 50;
//     }
// });

// document
//     .querySelector(".next-bettor")
//     .addEventListener("pointerdown", (event) => {
//         betting.nextBettor();
//     });

// const setHandsSelection = () => {
//     for (const p of players) {
//         const hand = p.hand;
//         const element = hand.element;
//         element.addEventListener("pointerdown", (event) => {
//             handSelected = hand;
//         });
//     }
// };

// setTimeout(setHandsSelection, 1);
