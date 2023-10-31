import { compareHands, getHandName } from "./compare-hands.js";
import { getCombinations } from "./combinations.js";

const getBestHand = (hand) => {
    // console.log("getBestHand(", hand, ")");
    const hands = getCombinations(hand.split(" "), 5);
    // console.log('hands',hands);
    const firstHand = hands.splice(0, 1)[0];
    let bestHand = firstHand.join(" ");
    for (const h of hands) {
        const handNext = h.join(" ");
        // console.log('h',h);
        // console.log(handNext,'vs',bestHand);
        if (compareHands(handNext, bestHand) === "WIN") {
            // console.log(handNext, "beats", bestHand);
            bestHand = handNext;
        }
    }
    return bestHand;
};

const getSuitSymbol = (suitLetter) => {
    let symbol = "";
    switch (suitLetter) {
        case "C":
            symbol = "♣️";
            break;
        case "D":
            symbol = "♦️";
            break;
        case "H":
            symbol = "♥️";
            break;
        case "S":
            symbol = "♠️";
            break;
        default:
            symbol = suitLetter;
    }
    return symbol;
};

const getHandWithSuits = (hand) => {
    hand = hand.replaceAll("C", "♣️");
    hand = hand.replaceAll("D", "♦️");
    hand = hand.replaceAll("H", "♥️");
    hand = hand.replaceAll("S", "♠️");
    return hand;
};

// Thanks to: https://zr9558.com/2017/02/13/programming-poker-ai/
// https://cowboyprogramming.com/2007/01/04/programming-poker-ai/

/*

A “suit” is an integer in the range 0..3, where 
0=Clubs, 1=Diamonds, 2=Hearts, 3=Spades

A “rank” is an integer in the range 0..12, where 
0 = 2 (deuce), 1 = 3, 11 = King, 12 = Ace. 
This is the cards in a suit arranged in rank order

A “card” is an integer in the range 0..51, hence
card = suit*13 + rank.
Suit = card/13
Rank = card%13

A “Hand” is a 52 bit data type, where each bit represents a single card. This can be stored as four 16 bit words for ease of use, where each 16 bit word represents the potential cards in one suit (using 13 of the 16 bits)

 ♣ - - - A K Q J T 9 8 7 6 5 4 3 2 
 ♦ - - - A K Q J T 9 8 7 6 5 4 3 2 
 ♥ - - - A K Q J T 9 8 7 6 5 4 3 2 
 ♠ - - - A K Q J T 9 8 7 6 5 4 3 2 

A “Hand Type” is an integer representing the type of poker hand you have, where 
0= no pair, 1=pair, 2=two pair, 3=trips, 4=straight, 5=flush, 6=full house, 7=quads, 8=straight flush.

*/

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

const drawCardsFromDeck = (numCards, deck) => {
    // return string of hand
    let hand = "";
    let loops = 0;
    while (loops < numCards) {
        const cardString = deck[Math.floor(Math.random() * deck.length)];
        hand += `${loops > 0 ? " " : ""}` + cardString;
        deck.splice(deck.indexOf(cardString), 1);
        loops++;
    }
    return hand;
};

const cardRanks = "23456789TJQKA";
const cardSuits = "DCHS";
const deck = [];
// rebuildDeck();

const dealHand = (numCards) => {
    const playerHand = drawCardsFromDeck(numCards, deck);
    const aiHand = drawCardsFromDeck(numCards, deck);

    return { playerHand, aiHand };
};

const displayHand = (hand, containerEl) => {
    containerEl.classList.remove('won');
    const cardsEl = containerEl.querySelector(".cards");
    cardsEl.innerHTML = "";
    const buildCard = (cardString) => {
        const el = document.createElement("div");
        el.classList.add("card");
        const suit = cardString[1];
        const face = cardString[0] === "T" ? "10" : cardString[0];
        el.innerHTML = `<span class="number">${face}</span><span class="suit ${suit}">${getSuitSymbol(
            suit
        )}</span>`;
        return el;
    };

    for (const card of hand.split(" ")) {
        cardsEl.appendChild(buildCard(card));
    }
};
const hideHand = (containerEl) => {
    containerEl.classList.add("hidden");
};
const showHand = (containerEl) => {
    containerEl.classList.remove("hidden");
};
const showHandWon = (containerEl) => {
    containerEl.classList.add('won');
}

const showdown = (hand1, hand2) => {
    // console.log("hand1", hand1);
    // console.log("hand2", hand2);
    const result = compareHands(hand1, hand2);
    const bet = Number(betSpan.innerHTML);
    if (result === "WIN") {
        addToStack(bet * 2);
        showHandWon(playerHandEl);
    }else if (result === "LOSE"){
        showHandWon(aiHandEl);
    }

    betSpan.innerHTML = '0';
    // console.log("result:", result);
    const playerHandName = getHandName(hand1);
    const aiHandName = getHandName(hand2);

    // output(
    //     `player hand <br /> <strong>${getHandWithSuits(
    //         hand1
    //     )} <br />${playerHandName}</strong><br /><br /> opponent hand<br /><strong>${getHandWithSuits(
    //         hand2
    //     )}<br />${aiHandName}</strong><br />`
    // );
    output(
        `player hand <br /><strong>${playerHandName}</strong><br /><br /> opponent hand<br /><strong>${aiHandName}</strong><br />`
    );
    output(`Player <strong>${result}</strong> $${bet}`, true);
};

/*
const getBestOfSeven = () => {
    rebuildDeck();
    const sevenCards = drawCardsFromDeck(7, deck);
    const bh = getBestHand(sevenCards);

    console.log("bh", getHandWithSuits(bh));

    output(
        "<br />Best 5 of 7<br />" +
            getHandWithSuits(sevenCards) +
            "<br />" +
            getHandWithSuits(bh) +
            "<br />" +
            getHandName(bh),
        true
    );
};
getBestOfSeven();
*/
// ////////////////////////////////////////////////////////
// SAMPLE GAME
// /////////////

// let tradingCards = false;
let hands;
const cardsToTrade = [];
let playerStack = 100;
const tradeButton = document.querySelector("#controls .trade");
const showdownButton = document.querySelector("#controls .showdown");
const nextHandButton = document.querySelector("#controls .next-hand");
const betControls = document.querySelector("#controls .betting");
const betSpan = betControls.querySelector(".bet");
const playerStackEl = document.querySelector("#player-stack");

const playerHandEl = document.getElementById("player-hand-holder");
const aiHandEl = document.getElementById("ai-hand-holder");

showdownButton.addEventListener("pointerdown", (event) => {
    showHand(aiHandEl);
    // Find winner
    showdown(hands.playerHand, hands.aiHand);
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
    } else if (event.target.classList.contains("down") && currentBet > betIncrement) {
        betSpan.innerHTML = Math.max(0, currentBet - betIncrement);
        addToStack(betIncrement);
    }
});

tradeButton.addEventListener("pointerdown", (event) => {
    hands.playerHand = tradeCards();
    displayHand(hands.playerHand, playerHandEl);
    // show appropriate controls
    tradeButton.style.display = "none";
    betControls.style.display = "block";
    showdownButton.style.display = "inline";
    nextHandButton.style.display = "none";
    output("Place your bet, then Press SHOWDOWN button to see the winner.");
});

const addToStack = (amount) => {
    playerStack += amount;
    playerStackEl.innerHTML = "$" + playerStack;
};

const showControls = (elToShow) => {
    betControls.style.display = "none";
    showdownButton.style.display = "none";
};

const applyPlayerCardListeners = () => {
    const playerCardEls = document.querySelectorAll(
        "#player-hand-holder .cards .card"
    );
    playerCardEls.forEach((card, cardIndex) => {
        card.addEventListener("pointerdown", (event) => {
            const myCard = hands.playerHand.split(" ")[cardIndex];
            console.log('selected card: ',myCard);
            const startLength = cardsToTrade.length;
            if (cardsToTrade.includes(cardIndex)) {
                // deselect card
                cardsToTrade.splice(cardsToTrade.indexOf(cardIndex), 1);
            } else if (cardsToTrade.length < 3) {
                // select card
                cardsToTrade.push(cardIndex);
            }
            if (cardsToTrade.length != startLength) {
                card.classList.toggle("dimmed");
            }
            console.log('cardsToTrade:',cardsToTrade);
        });
    });
};

const tradeCards = () => {
    // get rid of cardsToTrade
    console.log('tradeCards()');
    const playerHand = hands.playerHand.split(" ");
    cardsToTrade.sort().reverse();
    for (const index of cardsToTrade) {
        const newCard = drawCardsFromDeck(1, deck);
        playerHand.splice(index, 1, newCard);
    }
    // replace traded cards
    cardsToTrade.length = 0;
    // console.log('playerHand',playerHand);
    console.log('cardsToTrade (should be empty):',cardsToTrade);
    return playerHand.join(" ");
    
};

// const showdown = () => {
//     showHand(aiHandEl);
//     // Find winner
//     showDown(hands.playerHand, hands.aiHand);
// };

// Play a hand - of 5 card draw

const startHand = () => {
    rebuildDeck();
    // show / hide appropriate buttons
    tradeButton.style.display = "inline";
    betControls.style.display = "none";
    showdownButton.style.display = "none";
    nextHandButton.style.display = "none";
    // 1 deal cards to Player and AI
    hands = dealHand(5);
    output(
        "Select up to 3 cards to trade in.  When you are ready, click the TRADE button."
    );
    // display hand/s
    displayHand(hands.aiHand, aiHandEl);
    hideHand(aiHandEl);
    const aiCardEls = aiHandEl.querySelectorAll(".card");

    console.log("aiCardEls", aiCardEls);
    aiCardEls.forEach((card, index) => {
        card.addEventListener("pointerdown", (event) => {
            console.log("clicked ", event.target);
            const myCard = hands.aiHand.split(" ")[index];
        });
    });
    displayHand(hands.playerHand, playerHandEl);
    applyPlayerCardListeners();
};

// 2 allow player to draw up to 3 cards (4 if they have an Ace)
// tradingCards = true;

// 3 have AI exchange cards

// 4 showdown

startHand();
