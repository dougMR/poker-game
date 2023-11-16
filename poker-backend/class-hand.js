import { Player } from "./class-player.js";
import { Card } from "./class-card.js";
import { deck } from "./config.js";
// import { view } from "./view.js";
// import { game } from "./game.js";
import { getHandDetails } from "./check-hands.js";

console.log("hello from class-hand.js");

const drawCardFromDeck = (hand) => {
    if (deck.length <= 0) {
        return new Card(":)", hand);
    }
    const newCard = new Card(
        deck.splice(Math.floor(Math.random() * deck.length), 1)[0],
        hand
    );
    // console.log("game.checkWild(newCard):", game.checkWild(newCard));
    // newCard.isWild = game.checkWild(newCard);
    // !! Maybe isWild shoud get assigned in the Card class ?
    // !! Or in the game{} ?
    return newCard;
};

class Hand {
    constructor(player) {
        this._player = player;
        // this._element = view.buildHandDisplay(this._player.seat);
        this.player = player;
        this._cards = [];
        this._handString = "";
        this._wildsArray = [];
        this._handDetails = {};
        // this._bestHand = [];
        // this._deck = deck;
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
            // view.showHandName(this);
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
            // view.hideHandWon(this);
        };
        this.refreshCardElements = () => {
            // Update hand display
            this.hideHandWon();
            //
            // view.refreshCards(this);
        };

        this.drawCard = (numCards, facing) => {
            // draw card from deck
            console.log("Hand.drawCard()", numCards, facing);
            let loops = 0;
            while (loops < numCards) {
                const newCard = drawCardFromDeck(this);
                newCard.facing = facing;
                this._cards.push(newCard);
                loops++;
            }
            this.refreshCardElements();
            this.updateProperties();
            // return the last card (only useful when drawing 1?)
            return this._cards.slice(-1)[0];
        };
        this.tradeCards = () => {
            console.log('Hand.tradeCards()');
            // get rid of cardsToTrade
            for (const card of this._cards) {
                if (card.markedToTrade) {
                    const oldFacing = card.facing;
                    const cardIndex = this._cards.indexOf(card);
                    this._cards.splice(cardIndex, 1);
                    // replace that card
                    const newCard = drawCardFromDeck(this);
                    newCard.facing = oldFacing;
                    this._cards.splice(cardIndex, 0, newCard);
                }
            }
            this.refreshCardElements();
            this.updateProperties();
        };
        this.discardCards = () => {
            console.log('Hand.discardCards()')
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
        this.clearHand = () => {
            console.log('Hand.clearHand()')
            // remove all cards from hand
            this._cards.length = 0;
            this.updateProperties();
            this.refreshCardElements();
            // view.hideHandName(this);
        };
        this.arrangeByBest = () => {
            console.log('Hand.arrangeByBest()')
            const newOrder = [];
            const cardsDupe = [...this.cards];
            for (const cardString of this.bestHand) {
                let cardIndex = cardsDupe.findIndex(
                    (c) =>
                        (cardString[1] === "*" && c.isWild) ||
                        c.name === cardString
                );
                // console.log('cardString:',cardString);
                newOrder.push(cardsDupe.splice(cardIndex, 1)[0]);
                // console.log('card:',newOrder.slice(-1)[0]);
            }
            for (const dupe of cardsDupe) {
                // view.dimCard(dupe);
            }
            this._cards.length = 0;
            this._cards.push(...newOrder, ...cardsDupe);
            this.refreshCardElements();
        };
        this.hilightBestHand = () => {
            console.log('Hand.hilightBestHand()');
            // console.log("this.bestHand", this.bestHand);
            // console.log("this.cards:", this.cards);
            let handWilds = this.bestHand.filter((c) => c[1] === "*").length;
            // console.log("handWIlds:", handWilds);
            let cNum = this.cards.length;
            while (cNum--) {
                const c = this.cards[cNum];
                // console.log("c:", c);
                // console.log(
                //     "this.bestHand.includes(c.name):",
                //     this.bestHand.includes(c.name)
                // );
                // console.log("c.isWild :", c.isWild);
                // console.log("handWilds > 0", handWilds > 0);
                if (
                    this.bestHand.includes(c.name) ||
                    (c.isWild && handWilds > 0)
                ) {
                    // console.log("Hilight", c);
                    // view.hilightCard(c);
                    if (c.isWild) handWilds--;
                }
            }
        };
        this.updateProperties = () => {
            console.log("Hand.updateProperties()");
            // when we update the hand (change any cards)
            this._handString = this._cards.map((c) => c.name).join(" ");
            // console.log("this._handString:", this._handString);
            // _handString
            // this._bestHand = getBestHandWithWildcards(this._wildsArray);
            // console.log("this._bestHand:", this._bestHand);
            this._wildsArray = this._cards.map(
                (c) => `${c.isWild ? "**" : c.string}`
            );
            this._handDetails = getHandDetails(this);
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

    get name() {
        // name of hand eg. "two pair"
        return this._handDetails.name;
    }

    get bestHand() {
        // a string
        if(!this._handDetails?.cards)return [];
        return this._handDetails.cards;
    }

    get rank() {
        return this._handDetails.rank;
    }

    get value() {
        return this._handDetails.faces.join("");
    }

    get handDetails() {
        return this._handDetails;
    }

    get player() {
        return this._player;
    }
    set player(value) {
        if (value instanceof Player) {
            this._player = value;
            // view.setPlayerName(this, value.name);
        }
    }

    // get deck() {
    //     return this._deck;
    // }
    // set deck(value) {
    //     this._deck = value;
    // }

    // get element() {
    //     return this._element;
    // }

    get clientVersion() {
        const handObject = {
            name: this.name,
            bestHand: this.bestHand,
            cards: this.cards.map((c) => c.clientVersion),
            playerId: this.player.id
        }
        // for(const card of handObject.cards){
        //     card.hand = handObject;
        // }
        return handObject;
    }
}

export { Hand };
