import { compareHands } from "./compare-hands.js";




function getCombinations(array, depth, allowDuplicates) {
    // console.log('getCombinations():',array.length,depth,allowDuplicates);
    if (depth === 0) {
        return [[]];
    }

    const results = [];
    for (let i = 0; i < array.length; i++) {
        const rest = allowDuplicates ? array : array.slice(i + 1);
        const newCombinations = getCombinations(rest, depth - 1);
        for (let j = 0; j < newCombinations.length; j++) {
            // results.push([array[i]].concat(newCombinations[j]));
            results.push([array[i], ...newCombinations[j]]);
        }
    }
    return results;
}

const getAllWildCombinations = (numWilds) => {
    // console.log('getAllWildCOmbinations()',numWilds);
    return getCombinations(fullDeck, numWilds, true);
};

const getAllHandsWithWilds = (staticCardsAr, numWild) => {
    if(numWild === 0){
        return staticCardsAr;
    }
    const wildCombos = getAllWildCombinations(numWild);
    // console.log('wildCombos:',wildCombos.length);
    const allHands = [];
    for (const wc of wildCombos) {
        allHands.push([...staticCardsAr,...wc]);
    }
    // console.log('allHands.length:',allHands.length);
    return allHands;
};

const getBestHandWithWildcard = (handString) => {
    // console.log('getBestHandWithWildcard()',handString);
    const handStringArray = handString.split(" ");
    const nonWildCards = handStringArray.filter((c) => !c.includes("*"));
    // console.log('non-wild cards:',nonWildCards);
    const numWilds = handStringArray.length - nonWildCards.length;
    // console.log('numWilds:',numWilds);
    const allHands = getAllHandsWithWilds(nonWildCards,numWilds);
    // console.log('allHands:',allHands);
    const all5cardHands = [];
    for(const hand of allHands){
        const fiveCardHands = getCombinations(hand,5);
        all5cardHands.push(...fiveCardHands);
    }
    console.log('all 5-card hands',all5cardHands.length);
    let bestHandString = all5cardHands.splice(0,1)[0].join(" ");
    for (const h of all5cardHands) {
        const handNext = h.join(" ");
        if (compareHands(handNext, bestHandString) === "WIN") {
            bestHandString = handNext;
        }
    }
    return bestHandString;
};





const cardRanks = "23456789TJQKA";
const cardSuits = "DCHS";
const buildDeck = () => {
    const deck = [];
    for (const s of cardSuits.split("")) {
        for (const r of cardRanks.split("")) {
            deck.push(r + s);
        }
    }
    return deck;
};
const deck = buildDeck();
const fullDeck = [...deck];
// console.log('deck.length:',deck.length);

const handAr = [];
for(let c=0;c<5;c++){
    const cardIndex = Math.floor(Math.random()*deck.length);
    handAr.push(deck.splice(cardIndex,1)[0]);
}
handAr.push('**','**');
console.log('hand:',handAr);

const bestHand = getBestHandWithWildcard(handAr.join(" "));

console.log('best hand: ',bestHand);