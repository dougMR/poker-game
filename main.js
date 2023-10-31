import { compareHands, getHandName } from "./compare-hands.js";
import { getCombinations } from "./combinations.js";
import { Player } from "./class-player.js";
import { Hand } from "./class-hand.js";

const players = [];
const addPlayer = (name) => {
    if (
        !players.some(
            (player) => player.name.toLowerCase() === name.toLowerCase()
        )
    ) {
        const newPlayer = new Player(name);
        players.push(newPlayer);
        return newPlayer;
    }
    return null;
};

// /////////////////////////////////////////////////////

const getBestHand = (hand) => {
    // hand needs to be at least 5 cards
    const hands = getCombinations(hand.split(" "), 5);
    const firstHand = hands.splice(0, 1)[0];
    let bestHand = firstHand.join(" ");
    for (const h of hands) {
        const handNext = h.join(" ");
        if (compareHands(handNext, bestHand) === "WIN") {
            bestHand = handNext;
        }
    }
    return bestHand;
};

const getHandWithSuits = (hand) => {
    hand = hand.replaceAll("C", "♣️");
    hand = hand.replaceAll("D", "♦️");
    hand = hand.replaceAll("H", "♥️");
    hand = hand.replaceAll("S", "♠️");
    return hand;
};

const output = (msg, add) => {
    const outputDiv = document.getElementById("output");
    if (add) {
        msg = outputDiv.innerHTML + "<br />" + msg;
    }
    outputDiv.innerHTML = msg;
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

const dealHand = (numCards) => {
    for (const player of players) {
        console.log("deal ", player.name);
        player.hand.drawCardsFromDeck(numCards, deck);
    }
};

const showdown = (hand1, hand2) => {
    const result = compareHands(hand1, hand2);
    const bet = Number(betSpan.innerHTML);
    if (result === "WIN") {
        addToStack(bet * 2);
        player.hand.showHandWon();
    } else if (result === "LOSE") {
        aiPlayer.hand.showHandWon();
    }

    betSpan.innerHTML = "0";
    const playerHandName = getHandName(player.hand.handString);
    const aiHandName = getHandName(aiPlayer.hand.handString);

    output(
        `player hand <br /><strong>${playerHandName}</strong><br /><br /> opponent hand<br /><strong>${aiHandName}</strong><br />`
    );
    output(`Player <strong>${result}</strong> $${bet}`, true);
};

// ////////////////////////////////////////////////////////
// SAMPLE GAME
// /////////////

const addToStack = (amount) => {
    playerStack += amount;
    playerStackEl.innerHTML = "$" + playerStack;
};

const showControls = (elToShow) => {
    betControls.style.display = "none";
    showdownButton.style.display = "none";
};

// Play a hand - of 5 card draw

const startHand = () => {
    rebuildDeck();
    // show / hide appropriate buttons
    tradeButton.style.display = "inline";
    betControls.style.display = "none";
    showdownButton.style.display = "none";
    nextHandButton.style.display = "none";
    // 1 deal cards to Player and AI
    dealHand(5);
    output(
        "Select up to 3 cards to trade in.  When you are ready, click the TRADE button."
    );
    // display hand/s
    // aiPlayer.hand.displayHand();
    aiPlayer.hand.hideHand();
    // player.hand.displayHand();
    // Move this into Hand class
    const aiCardEls = aiPlayer.hand.displayElement.querySelectorAll(".card");
    aiCardEls.forEach((card, index) => {
        card.addEventListener("pointerdown", (event) => {
            const myCard = aiPlayer.hand.handArray[index];
        });
    });

    // aiPlayer.hand.displayHand();
    // applyPlayerCardListeners();
};

const cardRanks = "23456789TJQKA";
const cardSuits = "DCHS";
const deck = [];

// const cardsToTrade = [];
let playerStack = 100;

const tradeButton = document.querySelector("#controls .trade");
const showdownButton = document.querySelector("#controls .showdown");
const nextHandButton = document.querySelector("#controls .next-hand");
const betControls = document.querySelector("#controls .betting");
const betSpan = betControls.querySelector(".bet");
const playerStackEl = document.querySelector("#player-stack");
const handsEl = document.querySelector("#hands");

// const player = new Player('player');
const player = addPlayer("player");
// const aiPlayer = new Player ('ai');
const aiPlayer = addPlayer("ai");
player.hand = new Hand(player, deck);

aiPlayer.hand = new Hand(aiPlayer, deck);

handsEl.append(aiPlayer.hand.displayElement, player.hand.displayElement);

showdownButton.addEventListener("pointerdown", (event) => {
    aiPlayer.hand.showHand();
    // Find winner
    showdown(player.hand.handString, aiPlayer.hand.handString);
    // show appropriate controls
    tradeButton.style.display = "none";
    betControls.style.display = "none";
    showdownButton.style.display = "none";
    nextHandButton.style.display = "inline";
});

nextHandButton.addEventListener("pointerdown", (event) => {
    startHand();
});

betControls.addEventListener("pointerdown", (event) => {
    const betIncrement = 5;
    const currentBet = Number(betSpan.innerHTML);
    if (event.target.classList.contains("up") && playerStack >= betIncrement) {
        betSpan.innerHTML = currentBet + betIncrement;
        addToStack(-betIncrement);
    } else if (
        event.target.classList.contains("down") &&
        currentBet > betIncrement
    ) {
        betSpan.innerHTML = Math.max(0, currentBet - betIncrement);
        addToStack(betIncrement);
    }
});

tradeButton.addEventListener("pointerdown", (event) => {
    player.hand.tradeCards();
    player.hand.displayHand();
    // show appropriate controls
    tradeButton.style.display = "none";
    betControls.style.display = "block";
    showdownButton.style.display = "inline";
    nextHandButton.style.display = "none";
    output("Place your bet, then Press SHOWDOWN button to see the winner.");
});

startHand();
