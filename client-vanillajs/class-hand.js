import {
    // getHandDetails,
    // getHandName,
    getBestHandWithWildcards,
    evaluateHand
} from "./compare-hands-bitwise.js";
import { Player } from "./class-player.js";
import { Card } from "./class-card.js";
import { view } from "./view.js";
import { game } from "./game.js";

const cardRanks = "*23456789TJQKA";
const cardSuits = "*DCHS";

const drawCardFromDeck = (deck, hand) => {
    if (deck.length <= 0) {
        return new Card(":)", hand);
    }

    const newCard = new Card(
        deck.splice(Math.floor(Math.random() * deck.length), 1)[0],
        hand
    );
    console.log("game.checkWild(newCard):", game.checkWild(newCard));
    newCard.isWild = game.checkWild(newCard);
    // !! Maybe isWild shoud get assigned in the Card class ?
    return newCard;
};

const drawCardsFromDeck = (numCards, deck) => {
    // return string of hand
    // let hand = "";
    const cards = [];
    let loops = 0;
    while (loops < numCards) {
        cards.push(drawCardFromDeck(deck, this));
        loops++;
    }
    return cards;
};

// const getBestHand = (hand) => {
//     // gets bets 5 card hand
//     // doesn't work with fewer than 5 cards
//     const hands = getCombinations(hand.handArray, 5);
//     const firstHand = hands.splice(0, 1)[0];
//     let bestHandString = firstHand.join(" ");
//     for (const h of hands) {
//         const handNext = h.join(" ");
//         if (compareHands(handNext, bestHandString) === "WIN") {
//             bestHandString = handNext;
//         }
//     }
//     return bestHandString;
// };

class Hand {
    constructor(player, deck) {
        this._player = player;
        this._element = view.buildHandDisplay(this._player.seat);
        this.player = player;
        this._cards = [];
        this._handString = "";
        this._wildsArray = [];
        this._bestHand = [];
        this._handDetails = {};
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
            this.updateProperties();
        };
        this.drawCard = (numCards, facing) => {
            console.log("Hand.drawCard()");
            let loops = 0;
            while (loops < numCards) {
                const newCard = drawCardFromDeck(this._deck, this);
                newCard.facing = facing;
                this._cards.push(newCard);
                loops++;
            }
            this.refreshCardElements();
            this.updateProperties();
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
                        drawCardFromDeck(this._deck, this)
                    );
                }
            }
            this.refreshCardElements();
            this.updateProperties();
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
            this.updateProperties();
        };
        this.hilightBestHand = () => {
            // console.log('hilightBestHand()');
            const bestCards = this.cards.filter((c) =>
                this.bestHand.includes(c.name)
            );
            for (const card of bestCards) {
                view.hilightCard(card);
            }
        };
        this.updateProperties = () => {
            console.log("Hand.updateProperties()");
            // when we update the hand (change any cards)
            this._handString = this._cards.map((c) => c.name).join(" ");
            console.log("this._handString:", this._handString);
            // _handString
            this._wildsArray = this._cards
                .map((c) => `${c.isWild ? "**" : c.string}`);
            console.log("this._wildsArray:", this._wildsArray);
            // _wildsArray
            this._bestHand = getBestHandWithWildcards(this._wildsArray);
            console.log("this._bestHand:", this._bestHand);
            // _bestHand // bestHand must be in place for handName to use getHandName()
            this._handDetails = evaluateHand(this._bestHand);
            console.log("this._handDetails:", this._handDetails);
            // _handDetails
        };
    }
    // get name() {
    //     // this is the string of best 5-card hand.
    //     // confusingly different from card.nameString
    //     return this.bestHand;
    // }

    get handString() {
        // the complete string, all cards, not just 5 best
        return this._handString;
    }

    get wildsArray() {
        // replace wildcards with '**'
        return this._wildsArray;
    }

    get cards() {
        return this._cards;
    }

    get handArray() {
        return this.handString.split(" ");
    }

    get handName() {
        // name of hand eg. "two pair"
        return this._handDetails.name;
    }

    get bestHand() {
        // a string
        return this._bestHand;
    }

    get handDetails() {
        return this._handDetails;
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

    get element() {
        return this._element;
    }
}

export { Hand };
