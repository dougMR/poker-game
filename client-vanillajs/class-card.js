import { view } from "./view.js";
import { Hand } from "./class-hand.js";

class Card {
    constructor(cardString, hand) {
        // console.log('New Card():',cardString,hand);
        // facing: up, down, hole, community
        this._hand = hand;
        // console.log('hand:',hand);
        this._player = hand.player;
        this._facing = "up";
        view.setCardFacing(this, this._facing);
        // console.log('cardString:',cardString);
        this._string = cardString;
        this._markedToTrade = false;
        this._element = view.buildCardEl(cardString, this);
        // console.log('this._element:',this._element);
        this.hide = () => {
            view.hide(this);
            // this._element.classList.add("hidden");
        };
        this.show = () => {
            view.show(this);
            // this._element.classList.remove("hidden");
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

    get element() {
        return this._element;
    }
    set element(value) {
        this._element = value;
    }
    get hand() {
        return this._hand;
    }
    set hand (value) {
        // maybe players can trade cards?
        if(value instanceof Hand){
            this._hand = hand;
            this._player = hand.player;
        }
    }
    get player () {
        return this._player;
    }
}

export { Card };
