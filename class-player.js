// is this overkill just so we can check instanceof in set hand()?
import { Hand } from "./class-hand.js";

class Player {
    constructor(name) {
        if (name) {
            this._name = name;
        }else{
            this._name = "";
        }

        this._stack = 0;
        this._hand = null;
    }
    get name() {
        return this._name;
    }
    get stack() {
        return this._stack;
    }
    set stack(value) {
        if (value && typeof value === "number") {
            stack = value;
        }
    }
    get hand() {
        return this._hand;
    }
    set hand(value){
        if(value instanceof Hand){
            this._hand = value;
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
