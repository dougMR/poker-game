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
    // const totalLoops = Math.min(numCards, deck.length);
    // while (loops < totalLoops && deck.length > 0) {
    //     const cardString = deck.splice(
    //         Math.floor(Math.random() * deck.length),
    //         1
    //     );
    //     hand += `${loops > 0 ? " " : ""}` + cardString;
    //     loops++;
    // }
    // how many could we not get from deck?
    // const numMissing =
    //     hand === "" ? numCards : numCards - hand.split(" ").length;
    // // Not Enough Cards in deck to Trade
    // if (numMissing !== 0) {
    //     console.log("totalLoops", totalLoops);
    //     console.log(`hand:'${hand}'`);
    //     console.log('hand.split(" ")', hand.split(" "));
    //     console.log('hand.split(" ").length', hand.split(" ").length);
    //     console.log("numCards", numCards);
    //     console.log("numMissing: ", numMissing);
    // }

    // for (let i = 0; i < numMissing; i++) {
    //     hand += `${i > 0 ? " " : ""}**`;
    // }
    // console.log("hand:", `[${hand}]`);
    // console.log("deck.length:", deck.length);
    // return hand;
    return cards;
};

const applyPlayerCardListeners = () => {
    // Move this to Hand (?)
};

const getBestHand = (hand) => {
    // console.log('getBestHand():',hand.handString);
    // hand needs to be at least 5 cards
    const hands = getCombinations(hand.handArray, 5);
    const firstHand = hands.splice(0, 1)[0];
    let bestHandString = firstHand.join(" ");
    for (const h of hands) {
        const handNext = h.join(" ");
        // console.log('handNext v bestHandString',handNext,'v',bestHandString);
        if (compareHands(handNext, bestHandString) === "WIN") {
            bestHandString = handNext;
        }
    }
    return bestHandString;
};

class Hand {
    constructor(player, deck) {
        // this._handString = "";
        // this._handDetails;

        this._player = player;
        this._element = view.buildHandDisplay(this._player.seat);
        this.player = player;
        this._cards = [];
        // this._cardsToTrade = [];
        this._maxCardsToTrade = 3; // later we'll set this based on game, or whether  player has an ace
        this._deck = deck;
        //
        this.hideHand = () => {
            // this._element.classList.add("hidden");
            // console.log("this.handArray:", this.handArray);
            for (let c = 0; c < this._cards.length; c++) {
                this.hideCard(c);
            }
        };
        this.showHand = () => {
            // this._element.classList.remove("hidden");
            for (let c = 0; c < this._cards.length; c++) {
                this.showCard(c);
            }
        };
        this.showHandName = () => {
            view.showHandName(this);
        };
        this.hideCard = (index) => {
            // target card element
            // const cardEl = this._element.querySelector(
            //     `.cards :nth-child(${index + 1} of .card)`
            // );
            // console.log("hideCard", cardEl);
            // cardEl.classList.add("hidden");
            this._cards[index].hide();
        };
        this.showCard = (index) => {
            // target card element
            // const cardEl = this._element.querySelector(
            //     `.cards :nth-child(${index + 1} of .card)`
            // );
            // cardEl.classList.remove("hidden");
            this._cards[index].show();
        };
        this.showHandWon = () => {
            // this._element.classList.add("won");
            this.hilightBestHand();
        };
        this.hideHandWon = () => {
            this._element.classList.remove("won");
        };
        this.refreshCardElements = () => {
            // console.log('this.refreshCardElements():',this._cards);
            this.hideHandWon();
            //
            const cardsHolder = this._element.querySelector(".cards");
            cardsHolder.innerHTML = "";

            let index = 0;
            for (const card of this._cards) {
                // console.log('card:',card);
                cardsHolder.append(card.element);
                index++;
            }
        };
        //
        this.drawHand = (numCards, facing) => {
            // console.log("drawHand()");
            this._cards = drawCardsFromDeck(numCards, this._deck);
            for (const card of this._cards) {
                card.facing = facing;
            }
            this.refreshCardElements();
        };
        this.drawCard = (numCards, facing) => {
            // console.log('drawCard()')
            // const space = `${this._handString.length === 0 ? "" : " "}`;
            // const drawString = `${drawCardsFromDeck(
            //     numCards,
            //     this._deck,
            //     facing
            // )}`;
            // const wholeString = space + drawString;
            // this.handString += wholeString;
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
            // const handAr = this.handArray;
            // start w/ highest number, so it doesn't affect the splice index
            // this._cardsToTrade.sort().reverse();

            // for (const index of this._cardsToTrade) {
            //     // replace traded cards
            //     const newCard = drawCardsFromDeck(1, this._deck);
            //     handAr.splice(index, 1, newCard);
            // }

            // this._cardsToTrade.length = 0;
            // this.handString = handAr.join(" ");
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
            // const handAr = this.handArray;
            // // start w/ highest number, so it doesn't affect the splice index
            // this._cardsToTrade.sort().reverse();
            // for (const index of this._cardsToTrade) {
            //     // remove card
            //     handAr.splice(index, 1);
            // }
            // this._cardsToTrade.length = 0;
            // this.handString = handAr.join(" ");
            for (const card of this._cards) {
                if (card.markedToTrade) {
                    const cardIndex = this._cards.indexOf(card);
                    this._cards.splice(cardIndex, 1);
                }
            }
            this.refreshCardElements();
        };
        this.hilightBestHand = () => {
            console.log('hilightBestHand()');

            const bestCards = this.cards.filter(c => this.name.includes(c.name));
            console.log('bestCards:',bestCards)
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
        // console.log(
        //     "get handString():",
        //     this._cards.map((c) => c.name).join(" ")
        // );
        return this._cards.map((c) => c.name).join(" ");
    }

    // set handString(value) {
    //     if (typeof value === "string") {
    //         console.log("adding to handString: ", `[${value}]`);
    //         console.log("value[0]:", value[0]);
    //         // regex might be cleaner and more accurate test
    //         if (cardRanks.includes(value[0]) && cardSuits.includes(value[1])) {
    //             this._handString = value;
    //             this._handDetails = getHandDetails(value);
    //             this.refreshCardElements();
    //             this._handName = handRanks[this._handDetails.rank];
    //             this._element.querySelector(".hand-name").innerHTML =
    //                 this._handName;
    //         }
    //     }
    // }

    get cards() {
        return this._cards;
    }

    get handArray() {
        return this.handString.split(" ");
        // const ar = this._handString.split(" ");
        // if (ar.length === 1 && ar[0] === "") {
        //     return [];
        // } else {
        //     return this._handString.split(" ");
        // }
    }

    get handDetails() {
        console.log("get handDetails():", this.name);
        // getHandDetails(this.bestHand)
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
        // console.log('get handName()',this.handDetails.rank);
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
