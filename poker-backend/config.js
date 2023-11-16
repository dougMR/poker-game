console.log("hello from config.js")

const players = [];

//
// DECK
//

const buildDeck = () => {
    const deck = [];
    for (const s of cardSuits.split("")) {
        for (const r of cardRanks.split("")) {
            deck.push(r + s);
        }
    }
    return deck;
};

const rebuildDeck = () => {
    deck.length = 0;
    deck.push(...buildDeck());
};


const cardRanks = "23456789TJQKA";
const cardSuits = "DCHS";
const deck = buildDeck();

export {players, deck, rebuildDeck};