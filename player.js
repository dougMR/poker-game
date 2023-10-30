const Player = function () {
    let _name, _hand, _stack;
    const instance = {
        name: (value) => {
            if (value && typeof value === "string") {
                _name = value;
            } else {
                return _name;
            }
        },
        hand: (value) => {
            if (value && typeof value === "string") {
                _hand = value;
            } else {
                return _hand;
            }
        },
        stack: () => {
            return _stack;
        },
        addToStack: (amount) => {
            if (amount && typeof amount === "number" && amount > _stack * -1) {
                _stack += amount;
            }
        },
    };
    return instance;
};
const p1 = new Player();
console.log("p1", p1);

export { Player };
