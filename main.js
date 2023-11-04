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

const sayHello = () => {
    console.log("hello");
};

const players = [];
const setClientPlayer = (name) => {
    return addPlayer(name, true);
};
const addPlayer = (name, isClient) => {
    if (
        !players.some(
            (player) => player.name.toLowerCase() === name.toLowerCase()
        )
    ) {
        const newPlayer = new Player(name);
        // console.log('newPlayer:',newPlayer);
        if (isClient) {
            newPlayer.seat = assignClientSeat(newPlayer);
        } else {
            newPlayer.seat = assignNextSeat(newPlayer);
        }
        newPlayer.hand = new Hand(newPlayer, deck);
        players.push(newPlayer);
        return newPlayer;
    }
    return null;
};

// /////////////////////////////////////////////////////



const getHandWithSuits = (hand) => {
    hand = hand.replaceAll("C", "♣️");
    hand = hand.replaceAll("D", "♦️");
    hand = hand.replaceAll("H", "♥️");
    hand = hand.replaceAll("S", "♠️");
    return hand;
};

const rebuildDeck = () => {
    deck.length = 0;
    deck.push(...buildDeck());
};

const buildDeck = () => {
    const deck = [];
    for (const s of cardSuits.split("")) {
        for (const r of cardRanks.split("")) {
            deck.push(r + s);
        }
    }
    return deck;
};

const dealCommunity = (numCards) => {
    console.log("dealCommunity", numCards);
};

const dealAll = (numCards, facing) => {
    if (numCards > 0) {
        // !! change this to deal in the order of seats, not players
        for (const player of players) {
            dealCard(numCards, player, facing);
        }
    }
};
const dealCard = (numCards, player, facing) => {
    // console.log("dealCard():", player.name, numCards);
    // for (const player of players) {
    if (numCards > 0) {
        player.hand.drawCard(numCards, facing);
    }

    // }
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

const cardRanks = "23456789TJQKA";
const cardSuits = "DCHS";
const deck = [];

// const cardsToTrade = [];
let playerStack = 100;

// const tradeButton = document.querySelector("#controls .trade");
// const showdownButton = document.querySelector("#controls .showdown");
// const nextHandButton = document.querySelector("#controls .next-hand");
// const betControls = document.querySelector("#controls .betting");

// const playerStackEl = document.querySelector("#player-stack");
// const handsEl = document.querySelector("#hands");

// const player = new Player('player');
const clientPlayer = setClientPlayer("player", true);
clientPlayer.stack = 50;
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
const gameTypes = {
    "7 Card Stud": {
        phases: [
            { type: "deal", up: 0, down: 0, hole: 2, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "showdown" },
        ],
    },
};

// const str = "Hello";
// const myAr = str.split(" ");
// console.log('myAr:',myAr);

// let currentGame = null;
const game = {
    type: "",
    phaseIndex: 0,
    dealer: players[0],
    nextDealer: function () {
        if (!this.dealer) {
            this.dealer = players[0];
        } else {
            let dealerSeatIndex = this.dealer.seat.index;
            this.dealer = getNextOccupiedSeat(dealerSeatIndex).player;
        }

        console.log("nextDealer()", this.dealer.name);
        view.positionDealerButton();
    },
    // seat order is only meaningful to the client
    // to server, all players are same, there is no specific Client Player
    nextPhase: function () {
        console.log("nextPhase()");
        this.phaseIndex++;
        this.startPhase();
        
    },
    startGame: function (gameType) {
        rebuildDeck();
        this.nextDealer();
        for (const p of players) {
            p.inHand = true;
        }
        this.type = gameType;
        this.startPhase();
    },
    startPhase: function () {
        console.log("startPhase()");
        const currentPhase = {
            ...gameTypes[game.type].phases[game.phaseIndex],
        };
        view.output(game.type + "<br/>Phase: " + currentPhase.type.toUpperCase());
        // show / hide betting controls
        const bettingControls = document.getElementById("bet-controls");
        view.hideElement(bettingControls);

        if (currentPhase.type === "deal") {
            dealAll(currentPhase.up, "up");
            dealAll(currentPhase.down, "down");
            dealAll(currentPhase.hole, "hole");
            dealCommunity(currentPhase.community);
            this.nextPhase();
        } else if (currentPhase.type === "bet") {
            // step through each player in order, starting with left of the dealer
            betting.resetBet();
            betting.nextBettor();
        } else if (currentPhase.type === "trade") {
        } else if (currentPhase.type === "discard") {
        } else if (currentPhase.type === "showdown") {
            game.showdown();
        }
    },
    showdown: function () {
        // showdown All Players
        console.log('showdown():');
        let winningPlayer = players[0];
        winningPlayer.hand.showHand();
        winningPlayer.hand.showHandName();
        for (const player of players.slice(1)) {
            // console.log('winningPlayer:',winningPlayer.name)
            // console.log('player:',player.name);
            // console.log('winningHand:',winningPlayer.hand.bestHand);
            // console.log('playerHand:',player.hand.bestHand);
            const result = compareHands(
                // player.hand.handString,
                // winningPlayer.hand.handString
                player.hand.bestHand,
                winningPlayer.hand.bestHand
            );
            if (result === "WIN") {
                winningPlayer = player;
            }
            player.hand.showHand();
            player.hand.showHandName();
        };
        winningPlayer.hand.showHandWon();
        const articleRanks = [1, 3, 4, 5, 8, 9];
        const rank = winningPlayer.hand.handDetails.rank;
        view.output(
            winningPlayer.name +
                " WINS with " +
                (articleRanks.includes(rank) ? "a " : "") +
                winningPlayer.hand.handName
        );
    },
};

const autoStart = () => {
    for (let i = 0; i < 5; i++) {
        
        const newPlayer = addPlayer("AI-" + i);
        // console.log("newPlayer: ", newPlayer);
        newPlayer.stack = 50;
        
    }
    
    game.startGame("7 Card Stud");
    // game.nextPhase();
}
autoStart();

export { dealAll, dealCard, clientPlayer, players, game, addPlayer };
