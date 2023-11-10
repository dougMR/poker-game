// import { getCombinations } from "./combinations.js";
// import {
//     getBestHandWithWildcards,
//     findHandInHands,
//     removeRedundancies,
//     evaluateHand,
// } from "./compare-hands-bitwise.js";
import { getHandDetails } from "./check-hands.js";

const buildDeck = () => {
    const deck = [];
    for (const s of cardSuits.split("")) {
        for (const r of cardRanks.split("")) {
            deck.push(r + s);
        }
    }
    return deck;
};

const cardRanks = "23456789TJQKA";
const cardSuits = "DCHS";
const handRanks = [
    "five of a kind",
    "straight flush",
    "4 of a kind",
    "full house",
    "flush",
    "straight",
    "trips",
    "two pair",
    "pair",
    "high card",
];

const deck = buildDeck();

/*
import { compareHands } from "./compare-hands.js";
// import { buildDeck } from "./game.js";

const buildDeck = () => {
    const deck = [];
    for (const s of cardSuits.split("")) {
        for (const r of cardRanks.split("")) {
            deck.push(r + s);
        }
    }
    return deck;
};


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


const getAllHandsWithWilds = (handString) => { 
    // return all hands from all wildcard substitutions
    const handStringArray = handString.split(" ");
    const nonWildCards = handStringArray.filter((c) => !c.includes("*"));
    const numWilds = handStringArray.length - nonWildCards.length;
    if(numWilds === 0){
        return [handStringArray];
    }
    // 
    const wildCombos = getCombinations(fullDeck, numWilds, true);
    const allHands = [];
    for (const wc of wildCombos) {
        allHands.push([...nonWildCards,...wc]);
    }
    return allHands;
};

const getBestHandWithWildcards = (handString) => {
    // (works with our without wild cards)
    // get all possible hands, with wild cards being every card from a full deck
    const allHands = getAllHandsWithWilds(handString);
    // get every 5-card combination from each of those hands
    console.log('allHands',allHands);
    const all5cardHands = [];
    for(const hand of allHands){
        const fiveCardHands = getCombinations(hand,5);
        all5cardHands.push(...fiveCardHands);
    }
    // get the best of the 5-card hands
    let bestHandString = all5cardHands.splice(0,1)[0].join(" ");
    for (const h of all5cardHands) {
        const handNext = h.join(" ");
        if (compareHands(handNext, bestHandString) === "WIN") {
            bestHandString = handNext;
        }
    }
    return bestHandString;
};





// const buildDeck = () => {
//     const deck = [];
//     for (const s of cardSuits.split("")) {
//         for (const r of cardRanks.split("")) {
//             deck.push(r + s);
//         }
//     }
//     return deck;
// };

const cardRanks = "23456789TJQKA";
const cardSuits = "DCHS";

const deck = buildDeck();
const fullDeck = [...deck];
// console.log('deck.length:',deck.length);

// const handAr = [];
// for(let c=0;c<5;c++){
//     const cardIndex = Math.floor(Math.random()*deck.length);
//     handAr.push(deck.splice(cardIndex,1)[0]);
// }
// // handAr.push('**','**');
// console.log('hand:',handAr);

// const bestHand = getBestHandWithWildcards(handAr.join(" "));

// console.log('best hand: ',bestHand);


// function count(c, a) {
//     c[a] = (c[a] || 0) + 1;
//     return c;
// }
// const cards = ["AS","AS","AS","AS","AS"]
// const faces = cards
//         .map((cardString) => String.fromCharCode([77 - cardRanks.indexOf(cardString[0])]))
//         .sort();
// const counts = faces.reduce(count, {});
// const duplicates = Object.values(counts).reduce(count, {});
// console.log('cards:',cards);
// console.log('faces:',faces);
// console.log('counts:',counts);
// console.log('duplicates:',duplicates);
// console.log(Object.keys(duplicates));

*/

//
// POKER WITH LOOKUP TABLES AND HASHING
//
// https://joshgoestoflatiron.medium.com/july-17-evaluating-poker-hands-with-lookup-tables-and-perfect-hashing-c21e056da130
// (not demoed here)

//
// BITWISE POKER
//
// Great explanation of bitwise poker algorithm here:
// https://jonathanhsiao.com/blog/evaluating-poker-hands-with-bit-math
// First code example we found here:
// https://www.codeproject.com/Articles/569271/A-Poker-hand-analyzer-in-JavaScript-using-bit-math

const hands = [
    { name: "4 of a Kind", rank: 7 },
    { name: "Straight Flush", rank: 8 },
    { name: "Straight", rank: 4 },
    { name: "Flush", rank: 5 },
    { name: "High Card", rank: 0 },
    { name: "1 Pair", rank: 1 },
    { name: "2 Pair", rank: 2 },
    { name: "Royal Flush", rank: 9 },
    { name: "3 of a Kind", rank: 3 },
    { name: "Full House", rank: 6 },
    { name: "Five of a Kind", rank: 10 },
];
// const handRanks = [7, 8, 4, 5, 0, 1, 2, 9, 3, 6,10];
//    "5 of a Kind",
// var A=14, K=13, Q=12, J=11, _ = { "♠":1, "♣":2, "♥":4, "♦":8 };
var A = 14,
    K = 13,
    Q = 12,
    J = 11,
    T = 10,
    suits = { C: 1, D: 2, H: 4, S: 8 },
    faceLetters = { A: 14, K: 13, Q: 12, J: 11, T: 10 };

// isFiveOfAKind() by google Generative AI
function isFiveOfAKind(hand) {
    // Check if the hand has five cards.
    if (hand.length != 5) {
        return false;
    }

    // Count the number of cards of each rank.
    const rankCounts = new Array(13).fill(0);
    for (var i = 0; i < hand.length; i++) {
        rankCounts[hand[i]]++;
    }

    // Check if there is a rank with five cards.
    return rankCounts.includes(5);

    // for (var i = 0; i < rankCounts.length; i++) {
    //   if (rankCounts[i] == 5) {
    //     return true;
    //   }
    // }

    // // No five-of-a-kind.
    // return false;
}

//Calculates the Rank of a 5 card Poker hand using bit manipulations.
// function rankPokerHand(cs,ss) {
//   var v, i, o, s = 1<<cs[0]|1<<cs[1]|1<<cs[2]|1<<cs[3]|1<<cs[4];
//   for (i=-1, v=o=0; i<5; i++, o=Math.pow(2,cs[i]*4)) {v += o*((v/o&15)+1);}
//   v = v % 15 - ((s/(s&-s) == 31) || (s == 0x403c) ? 3 : 1);
//   v -= (ss[0] == (ss[1]|ss[2]|ss[3]|ss[4])) * ((s == 0x7c00) ? -5 : 1);
//   console.log("Hand: " + hands[v] + (s == 0x403c?" (Ace low)":"")+"<br/>");
// }
/*
function rankPokerHand(cs, ss) {
    // console.log('ss:',ss);
    var v,
        i,
        o,
        s =
            (1 << cs[0]) |
            (1 << cs[1]) |
            (1 << cs[2]) |
            (1 << cs[3]) |
            (1 << cs[4]);
    // console.log("v,i,o,s:", v, i, o, s);
    for (i = -1, v = o = 0; i < 5; i++, o = Math.pow(2, cs[i] * 4)) {
        // console.log("i", i);
        v += o * (((v / o) & 15) + 1);
        // console.log("o", o);
        // console.log("v", v);
    }
    // console.log("v", v);
    // v Temp experimenting with hand values
    // return v;
    v = (v % 15) - (s / (s & -s) == 31 || s == 0x403c ? 3 : 1);
    v -= (ss[0] == (ss[1] | ss[2] | ss[3] | ss[4])) * (s == 0x7c00 ? -5 : 1);
    // console.log("v:", v);
    // console.log("hands:", hands);
    // console.log("hands[v]:", hands[v]);
    // console.log(
    //     "Hand: " + hands[v].name + (s == 0x403c ? " (Ace low)" : "") + "<br/>"
    // );

    return hands[v];
}

const evaluateHand = (handAr) => {
    console.log("evaluateHand():", handAr);
    // const handAr = handString.split(" ");
    const faces = handAr
        .map((cardString) => cardString[0])
        .map((f) => Number(f) || faceLetters[f]);
    const fiveOfAKind = isFiveOfAKind(faces);
    if (fiveOfAKind) return "Five of a Kind";
    const handSuits = handAr.map((cardString) => suits[cardString[1]]);
    return rankPokerHand(faces, handSuits);
};

const getValueString = (handArray) => {
    return handArray
        .map((cardName) =>
            String.fromCharCode([77 - cardRanks.indexOf(cardName[0])])
        )
        .sort()
        .join("");
};

const compareHands = (A, B) => {
    // console.log('compareHands()',A,'vs',B);
    const aEv = evaluateHand(A);
    const bEv = evaluateHand(B);
    const aRank = evaluateHand(A).rank;
    const bRank = evaluateHand(B).rank;
    let diff = aRank - bRank;
    // console.log('aEv:',aEv);
    // console.log('bEv:',bEv);
    // console.log('aRank - bRank:',aRank-bRank);
    if (diff === 0) {
        const aString = getValueString(A);
        const bString = getValueString(B);
        return aString < bString ? 1 : aString === bString ? 0 : -1;
    }
    return diff > 0 ? 1 : diff < 0 ? -1 : 0;
};

//   console.log(evaluateHand(['2','2','2','2','2'],[ suits["H"], suits["H"],suits["D"],suits["C"],suits["H"] ]));
// ["2D", "4S", "TH", "AS", "TD"]
// console.log(evaluateHand("2D 4S AH AS TD"));
// const pairV = evaluateHand("2D 4S AH AS TD");
// const tripsV = evaluateHand("2D 2S 2H AS TD");
// const flushV = evaluateHand("2D 4D AD KD 7D");
// console.log("pairV:", pairV.rank);
// console.log("tripsV:", tripsV.rank);
// console.log("flushV:", flushV.rank);

const cardRanks = "23456789TJQKA";
for (const char of cardRanks) {
    const faceIndex = cardRanks.indexOf(char);
    const faceString = String.fromCharCode([77 - faceIndex]);
    console.log(char, faceIndex, faceString);
}
const sortNumbers = (a, b) => {
    return b - a;
};
const getFaceValues = (handString) => {
    return handString
        .split(" ")
        .map((cardName) => cardRanks.indexOf(cardName[0]))
        .sort(sortNumbers);
};
const myHand = "2D 4S AH AS TD";
// console.log('faces:',getFaceValues(myHand));
// console.log(getValueString(myHand.split(" ")));

const H1 = ["2D", "2S", "5H", "AS", "TD"];
const H2 = ["2H", "TS", "TH", "AS", "TD"];
const H1beatH2 = compareHands(H1, H2);
console.log("H1beatH2:", H1beatH2);

// 14077700
console.log(Math.pow(52, 5));


// const wildCombos3 = getCombinations(deck,3,true);
// const combos = getCombinations(deck,5,true);
// console.log('combos.length:',combos.length);

const wildHand = ["2D", "2S", "5H", "AS", "TD", "**", "AD", "KH", "3D"];
const handsAr = [
    ["2D", "2S", "5H", "AS", "TD", "**"],
    ["2D", "2S", "TD", "5S", "5H"],
    ["5H", "TD", "2S", "5S", "2D"],
    ["2D", "2S", "5H", "5S", "TD"],
    ["2D", "6S", "5H", "AS", "3C"],
];
const bestHand = getBestHandWithWildcards(wildHand);
console.log("bestHand:", bestHand);
const subHand = ["2D", "2S", "5H", "AS", "TD"];

removeRedundancies(handsAr)
console.log(handsAr);
// console.log('repeat:',repeat);
// console.log(subHand.every(cardString => wildHand.includes(cardString)))
// console.log(handsAr.some(hand => hand.includes('**')));

// console.log(findHandInHands(handsAr, subHand));

// rankPokerHand([A,A,2,2,2],[ _["♠"], _["♠"], _["♦"], _["♠"], _["♠"] ])

// rankPokerHand([10, J, Q, K, A], [ _["♠"], _["♠"], _["♠"], _["♠"], _["♠"] ] ); // Royal Flush
// rankPokerHand([ 4, 5, 6, 7, 8], [ _["♠"], _["♠"], _["♠"], _["♠"], _["♠"] ] ); // Straight Flush
// rankPokerHand([ 2, 3, 4, 5, A], [ _["♠"], _["♠"], _["♠"], _["♠"], _["♠"] ] ); // Straight Flush
// rankPokerHand([ 8, 8, 8, 8, 9], [ _["♠"], _["♣"], _["♥"], _["♦"], _["♠"] ] ); // 4 of a Kind
// rankPokerHand([ 7, 7, 7, 9, 9], [ _["♠"], _["♣"], _["♥"], _["♠"], _["♣"] ] ); // Full house
// rankPokerHand([10, J, 6, K, 9], [ _["♣"], _["♣"], _["♣"], _["♣"], _["♣"] ] ); // Flush
// rankPokerHand([10, J, Q, K, 9], [ _["♠"], _["♣"], _["♥"], _["♣"], _["♦"] ] ); // Straight
// rankPokerHand([ 2, 3, 4, 5, A], [ _["♠"], _["♣"], _["♥"], _["♣"], _["♦"] ] ); // Straight
// rankPokerHand([ 4, 4, 4, 8, 9], [ _["♠"], _["♣"], _["♥"], _["♠"], _["♣"] ] ); // 3 of a Kind
// rankPokerHand([ 8, 8, J, 9, 9], [ _["♠"], _["♣"], _["♥"], _["♠"], _["♣"] ] ); // 2 Pair
// rankPokerHand([ 8, 8, 3, 5, 9], [ _["♠"], _["♣"], _["♥"], _["♠"], _["♣"] ] ); // 1 Pair
// rankPokerHand([10, 5, 4, 7, 9], [ _["♠"], _["♣"], _["♥"], _["♠"], _["♣"] ] ); // High Card
*/

/*
const bin = '000000000000000000000000000000000000000000001111000000000001';
console.log('bin',bin);
// give parseInt() a string and radix 2
// const dec = parseInt(bin,2);
// or
// give Number() a string starting w '0b'
const dec = Number('0b'+bin);
console.log('dec:',dec);
console.log('dec % 15',dec%15);
*/

const theHand = [];
for (let i = 0; i < 7; i++) {
    if (Math.random() < 0.15) {
        theHand.push("**");
    } else {
        const index = Math.floor(Math.random() * deck.length);
        theHand.push(deck.splice(index, 1)[0]);
    }
}
// ['9S','AH', 'KS', '**', 'JS', '**']
// ['JD', 'JH', '9S', '9H', 'KD', 'TC']
// ['JD', 'JH', '9S', '4C', '9H', '**', '**', '**', '3C', 'QC']
// ['8H', '**', '**', 'KD', '**', '9C', '3S', 'JD', '9S', '**']
// console.log("HAND", ['JS', '4D', '8H', 'TC', '4S', '2D', 'AS', '3C', '**', '**']);
// const myHand = ["7C", "8S", "**", "4S", "**", "TS", "**"];
// console.log(
//     "best:",
//     getHandDetails(myHand).cards,
//     handRanks[getHandDetails(myHand).rank]
// );
const handDetails = getHandDetails(theHand);
console.log('best: ',handDetails.cards, handRanks[handDetails.rank]);

//
// REGEX HAND EVALUATIONS
//
/*
Royal/straight flush: "(2345A|23456|34567|...|9TJQK|TJQKA)#(\\w)\\1{4}"
Four of a kind:       ".*(\\w)\\1{3}.*#.*"
Full house:           "((\\w)\\2\\2(\\w)\\3|(\\w)\\4(\\w)\\5\\5)#.*"
Flush:                ".*#(\\w)\\1{4}"
Straight:             "(2345A|23456|34567|...|9TJQK|TJQKA)#.*"
Three of a kind:      ".*(\\w)\\1\\1.*#.*"
Two pair:             ".*(\\w)\\1.*(\\w)\\2.*#.*"
One pair:             ".*(\\w)\\1.*#.*"
High card:            (none)
*/
