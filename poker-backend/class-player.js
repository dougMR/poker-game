// is this overkill just so we can check instanceof in set hand()?
import { Hand } from "./class-hand.js";
// import { view } from "./view.js";
// ?? How to handle all the view stuff?
// ?? Tell clients about changes to player instance, they will update necessary visuals.

console.log("hello from class-player.js");

class Player {
    constructor(name, id) {
        console.log("new Player()", name, id);
        if (name) {
            this._name = name;
        } else {
            this._name = "No Name";
        }
        this._id = id;
        this._stack = 0;
        this._amountBetThisRound = 0;
        this._seat = null;
        this._hand = null;
        this._inHand = true;
        this._hasPlayedThisHand = false;
        this.addToStack = (amount) => {
            if (
                amount &&
                typeof amount === "number" &&
                amount >= this._stack * -1
            ) {
                this._stack += amount;
                // view.setStack(this, this._stack);
            }
        };
    }
    get inHand() {
        return this._inHand;
    }
    set inHand(value) {
        if (typeof value === "boolean") {
            this._inHand = value;
            // if (this._inHand === true) {
            //     view.inHand(this);
            // }
        }
    }
    get name() {
        return this._name;
    }
    get id() {
        return this._id;
    }
    get stack() {
        return this._stack;
    }
    set stack(value) {
        if (value && typeof value === "number") {
            this._stack = value;
            // view.setStack(this, this._stack);
        }
    }
    get seat() {
        return this._seat;
    }
    set seat(value) {
        console.log('Player set seat()',value.index)
        if (typeof value === "object" && value !== null) {
            this._seat = value;
        }
    }
    get hand() {
        return this._hand;
    }
    set hand(value) {
        if (value instanceof Hand) {
            this._hand = value;
        }
    }
    get amountBetThisRound() {
        return this._amountBetThisRound;
    }
    set amountBetThisRound(value) {
        if (typeof value === "number") {
            this._amountBetThisRound = value;
            console.log(this.name, "set amountBet:", value);
        }
    }
    get hasPlayed() {
        return this._hasPlayedThisHand;
    }
    set hasPlayed(value) {
        if (typeof value === "boolean") {
            this._hasPlayedThisHand = value;
        }
    }

    get clientVersion() {
        
        const playerObject = {
            name: this.name,
            id: this.id,
            stack: this.stack,
            inHand: this.inHand,
            hand: this.hand.clientVersion,
            seat: { index: this.seat.index },
        };
        // console.log('clientVersion:',playerObject)
        // playerObject.hand = playerObject;
        return playerObject;
    }
}

export { Player };
