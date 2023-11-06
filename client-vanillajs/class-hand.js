import { getHandDetails, getHandName,compareHands } from "./compare-hands.js";
import { getCombinations } from "./combinations.js";
import { Player } from "./class-player.js";
import { Card } from "./class-card.js";
import { view } from "./view.js";

const cardRanks = "*23456789TJQKA";
const cardSuits = "*DCHS";

const drawCardFromDeck = (deck, hand) => {
    if (deck.length <= 0) {
        return new Card(":)", hand);
    }

    return new Card(
        deck.splice(Math.floor(Math.random() * deck.length), 1)[0],
        hand
    );
};

const drawCardsFromDeck = (numCards, deck) => {
    // return string of hand
    // let hand = "";
    const cards = [];
    let loops = 0;
    while (loops < numCards) {
        cards.push(drawCardFromDeck(deck,this));
        loops++;
    }
    return cards;
};

const getBestHand = (hand) => {
    // gets bets 5 card hand
    // doesn't work with fewer than 5 cards
    const hands = getCombinations(hand.handArray, 5);
    const firstHand = hands.splice(0, 1)[0];
    let bestHandString = firstHand.join(" ");
    for (const h of hands) {
        const handNext = h.join(" ");
        if (compareHands(handNext, bestHandString) === "WIN") {
            bestHandString = handNext;
        }
    }
    return bestHandString;
};

class Hand {
    constructor(player, deck) {
        this._player = player;
        this._element = view.buildHandDisplay(this._player.seat);
        this.player = player;
        this._cards = [];
        // this._maxCardsToTrade = 3; // later we'll set this based on game, or whether  player has an ace
        this._deck = deck;
        //
        this.hideHand = () => {
            for (let c = 0; c < this._cards.length; c++) {
                this.hideCard(c);
            }
        };
        this.showHand = () => {
            for (let c = 0; c < this._cards.length; c++) {
                this.showCard(c);
            }
        };
        this.showHandName = () => {
            view.showHandName(this);
        };
        this.hideCard = (index) => {
            // target card element
            this._cards[index].hide();
        };
        this.showCard = (index) => {
            // target card element
            this._cards[index].show();
        };
        this.showHandWon = () => {
            this.hilightBestHand();
        };
        this.hideHandWon = () => {
            this._element.classList.remove("won");
        };
        this.refreshCardElements = () => {
            this.hideHandWon();
            //
            const cardsHolder = this._element.querySelector(".cards");
            cardsHolder.innerHTML = "";

            let index = 0;
            for (const card of this._cards) {
                cardsHolder.append(card.element);
                index++;
            }
        };
        //
        this.drawHand = (numCards, facing) => {
            this._cards = drawCardsFromDeck(numCards, this._deck);
            for (const card of this._cards) {
                card.facing = facing;
            }
            this.refreshCardElements();
        };
        this.drawCard = (numCards, facing) => {
            console.log('Hand.drawCard()')
            let loops = 0;
            while (loops < numCards) {
                const newCard = drawCardFromDeck(this._deck, this);
                newCard.facing = facing;
                this._cards.push(newCard);
                loops++;
            }
            this.refreshCardElements();
        };
        this.tradeCards = () => {
            // get rid of cardsToTrade
            for (const card of this._cards) {
                if (card.markedToTrade) {
                    const cardIndex = this._cards.indexOf(card);
                    this._cards.splice(cardIndex, 1);
                    // replace that card
                    this._cards.splice(
                        cardIndex,
                        0,
                        drawCardFromDeck(this._deck,this)
                    );
                }
            }
            this.refreshCardElements();
        };
        this.discardCards = () => {
            // get rid of cardsToTrade
            for (const card of this._cards) {
                if (card.markedToTrade) {
                    const cardIndex = this._cards.indexOf(card);
                    this._cards.splice(cardIndex, 1);
                }
            }
            this.refreshCardElements();
        };
        this.hilightBestHand = () => {
            // console.log('hilightBestHand()');
            const bestCards = this.cards.filter(c => this.name.includes(c.name));
            for(const card of bestCards){
                view.hilightCard(card);
            }
        }
    }
    get name(){
        // this is the string of best 5-card hand.
        // confusingly different from card.nameString
        return this.bestHand;
    }
    get handString() {
        // the complete string, all cards, not just 5 best
        return this._cards.map((c) => c.name).join(" ");
    }

    get cards() {
        return this._cards;
    }

    get handArray() {
        return this.handString.split(" ");
    }

    get handDetails() {
        console.log("get handDetails():", this.name);
        return getHandDetails(this.bestHand);
    }

    get displayElement() {
        return this._element;
    }

    get player() {
        return this._player;
    }
    set player(value) {
        if (value instanceof Player) {
            this._player = value;
            this._element.querySelector(".player-name").innerHTML = value.name;
        }
    }

    get cardEls() {
        return this._element.querySelectorAll(".card");
    }

    get deck() {
        return this._deck;
    }
    set deck(value) {
        this._deck = value;
    }

    get handName() {
        // name of hand eg. "two pair"
        return getHandName(this);
    }

    get bestHand() {
        return getBestHand(this);
    }

    get element() {
        return this._element;
    }
}

export { Hand };
