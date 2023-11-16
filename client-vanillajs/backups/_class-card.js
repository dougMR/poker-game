import { view } from "./view.js";
import { Hand } from "./class-hand.js";

class Card {
    constructor(cardString, hand) {
        // console.log("new Card()");
        this._hand = hand;
        this._player = hand.player;
        // facing: up, down, hole, community
        this._facing = "up";
        this._string = cardString;
        // isWild gets set externally
        this._isWild = false;
        // if markedToTrade, card will get replaced when "draw" button is pressed
        this._markedToTrade = false;
        // when cards are on server, can they store a reference to their front-end element?
        // maybe view{} sends messages to the clients...
        this._element = view.buildCardEl(this);
        view.setCardFacing(this, this._facing);
        this.hide = () => {
            view.hide(this);
        };
        this.show = () => {
            view.show(this);
            view.setCardFacing(this,"up");
        };
    }
    get facing() {
        return this._facing;
    }
    set facing(value) {
        if (typeof value === "string") {
            this._facing = value;
            view.setCardFacing(this, value);
        }
    }
    get markedToTrade() {
        return this._markedToTrade;
    }
    set markedToTrade(value) {
        if (typeof value === "boolean") {
            this._markedToTrade = value;
        }
    }
    get string() {
        return this._string;
    }
    get name() {
        return this._string;
    }
    get isWild(){
        return this._isWild;
    }
    set isWild(value){
        if(typeof value === "boolean"){
            this._isWild = value;
            view.showWild(this);
        }
    }

    get element() {
        return this._element;
    }
    set element(value) {
        this._element = value;
    }
    get hand() {
        return this._hand;
    }
    set hand(value) {
        // maybe players can trade cards?
        if (value instanceof Hand) {
            this._hand = hand;
            this._player = hand.player;
        }
    }
    get player() {
        return this._player;
    }
}

export { Card };
