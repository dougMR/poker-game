import { getHandDetails, handRanks} from "./compare-hands.js";
import { Player } from "./class-player.js";

const cardRanks = "23456789TJQKA";
const cardSuits = "DCHS";

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

const buildHandDisplay = () => {
    const containerEl = document.createElement("div");
    containerEl.classList.add("hand-holder");
    containerEl.innerHTML = `<div class="top-info"><h3 class="player-name"></h3><p class="hand-name"></p></div><div class="cards"></div>`;
    // containerEl.classList.remove("won");
    return containerEl;
};

const applyPlayerCardListeners = () => {
    // Move this to Hand (?)
};

class Hand {
    constructor(player, deck) {
        this._handString;
        this._handDetails;
        this._displayElement = buildHandDisplay();
        this._player;
        this.player = player;
        this._cardsToTrade = [];
        this._maxCardsToTrade = 3; // later we'll set this based on game, or whether  player has an ace
        this._deck = deck;
        //
        this.hideHand = () => {
            this._displayElement.classList.add("hidden");
        };
        this.showHand = () => {
            this._displayElement.classList.remove("hidden");
        };
        this.showHandWon = () => {
            this._displayElement.classList.add("won");
        };
        this.hideHandWon = () => {
            this._displayElement.classList.remove("won");
        };
        this.displayHand = () => {
            console.log("displayHand()");
            this.hideHandWon();
            //
            const cardsHolder = this._displayElement.querySelector(".cards");
            cardsHolder.innerHTML = "";
            const buildCard = (cardString, cardIndex) => {
                const cardEl = document.createElement("div");
                cardEl.classList.add("card");
                const suit = cardString[1];
                const face = cardString[0] === "T" ? "10" : cardString[0];
                cardEl.innerHTML = `<span class="number">${face}</span><span class="suit ${suit}">${getSuitSymbol(
                    suit
                )}</span>`;
                cardEl.addEventListener("pointerdown", (event) => {
                    console.log("clicked card");
                    // const myCard = player.hand.handString.split(" ")[cardIndex];
                    const startLength = this._cardsToTrade.length;
                    if (this._cardsToTrade.includes(cardIndex)) {
                        // deselect card
                        this._cardsToTrade.splice(
                            this._cardsToTrade.indexOf(cardIndex),
                            1
                        );
                    } else if (
                        this._cardsToTrade.length < this._maxCardsToTrade
                    ) {
                        // select card
                        this._cardsToTrade.push(cardIndex);
                    }
                    if (this._cardsToTrade.length != startLength) {
                        cardEl.classList.toggle("dimmed");
                    }
                });
                return cardEl;
            };
            let index = 0;
            for (const card of this._handString.split(" ")) {
                cardsHolder.append(buildCard(card, index));
                index++;
            }
        };
        //
        this.drawCardsFromDeck = (numCards) => {
            console.log("drawCardsFromDeck()");
            this.handString = drawCardsFromDeck(numCards, this._deck);
        };
        this.tradeCards = () => {
            // get rid of cardsToTrade
            const handAr = this.handArray;
            this._cardsToTrade.sort().reverse();
            for (const index of this._cardsToTrade) {
                const newCard = drawCardsFromDeck(1, this._deck);
                handAr.splice(index, 1, newCard);
            }
            // replace traded cards
            this._cardsToTrade.length = 0;
            this.handString = handAr.join(" ");
        };
    }

    get handString() {
        return this._handString;
    }

    set handString(value) {
        if (typeof value === "string") {
            // regex might be cleaner and more accurate test
            if (cardRanks.includes(value[0]) && cardSuits.includes(value[1])) {
                console.log("set handString", value);
                this._handString = value;
                this._handDetails = getHandDetails(value);
                this.displayHand();
                this._handName = handRanks[this._handDetails.rank];
                this._displayElement.querySelector(".hand-name").innerHTML = this._handName;
            }
        }
    }

    get handArray() {
        return this._handString.split(" ");
    }

    get handDetails() {
        return this._handDetails;
    }

    get displayElement() {
        return this._displayElement;
    }

    get player() {
        return this._player;
    }
    set player(value) {
        if (value instanceof Player) {
            this._player = value;
            this._displayElement.querySelector(".player-name").innerHTML = value.name;
        }
    }

    get cardEls() {
        return this._displayElement.querySelectorAll(".card");
    }

    set deck(value) {
        this._deck = value;
    }

    get handName() {
        return getHandName(this._handDetails.rank);
    }
}

export { Hand };
