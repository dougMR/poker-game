// is this overkill just so we can check instanceof in set hand()?
import { Hand } from "./class-hand.js";
import { view } from "./view.js";

class Player {
    constructor(name) {
        if (name) {
            this._name = name;
        } else {
            this._name = "";
        }

        this._stack = 0;
        this._amountBetThisRound = 0;
        this._seat = null;
        this._hand = null;
        this._inHand = true;
        this.addToStack = (amount) => {
            if (
                amount &&
                typeof amount === "number" &&
                amount >= this._stack * -1
            ) {
                this._stack += amount;
                view.setStack(this, this._stack);
            }
        };
    }
    get inHand() {
        return this._inHand;
    }
    set inHand(value) {
        if (typeof value === "boolean") this._inHand = value;
    }
    get name() {
        return this._name;
    }
    get stack() {
        return this._stack;
    }
    set stack(value) {
        if (value && typeof value === "number") {
            this._stack = value;
            view.setStack(this, this._stack);
        }
    }
    get seat() {
        return this._seat;
    }
    set seat(value) {
        if (typeof value === "object") {
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
            console.log(this.name, 'set amountBet:',value);
        }
    }
}

// const Player = function () {
//     let _name, _hand, _stack;
//     const instance = {
//         name: (value) => {
//             if (value && typeof value === "string") {
//                 _name = value;
//             } else {
//                 return _name;
//             }
//         },
//         hand: (value) => {
//             if (value && typeof value === "string") {
//                 _hand = value;
//             } else {
//                 return _hand;
//             }
//         },
//         stack: () => {
//             return _stack;
//         },
//         addToStack: (amount) => {
//             if (amount && typeof amount === "number" && amount > _stack * -1) {
//                 _stack += amount;
//             }
//         },
//     };
//     return instance;
// };
// const p1 = new Player();
// console.log("p1", p1);

export { Player };
