import { getCombinations } from "./combinations.js";

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

const A = 14,
    K = 13,
    Q = 12,
    J = 11,
    T = 10,
    suits = { C: 1, D: 2, H: 4, S: 8 },
    faceLetters = { A: 14, K: 13, Q: 12, J: 11, T: 10 },
    cardSuits = "DCHS",
    cardRanks = "23456789TJQKA";

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
}

//Calculates the Rank of a 5 card Poker hand using bit manipulations.
function rankPokerHand(cs, ss) {
    console.log('rankPokerHand()',cs,ss);
    // cs = card face #s, ss = card suits #s
    var v,
        i,
        o,
        s = 1 << cs[0] |
    (1 << cs[1]) |
    (1 << cs[2]) |
    (1 << cs[3]) |
    (1 << cs[4]);
    // let ssBits = ss[1];
    // for (let cardNum = 1; cardNum < cs.length; cardNum++) {
    //     s = s | cs[cardNum];
    //     if (cardNum < cs.length - 2) {
    //         ssBits = ssBits | ss[cardNum + 1];
    //     }
    // }
    for (i = -1, v = o = 0; i < 5; i++, o = Math.pow(2, cs[i] * 4)) {
        v += o * (((v / o) & 15) + 1);
    }
    // for (
    //     i = -1, v = o = 0;
    //     i < cs.length;
    //     i++, o = Math.pow(2, cs[i] * (cs.length - 1))
    // ) {
    //     v += o * (((v / o) & 15) + 1);
    // }
    v = (v % 15) - (s / (s & -s) == 31 || s == 0x403c ? 3 : 1);
    v -= (ss[0] == (ss[1] | ss[2] | ss[3] | ss[4])) * (s == 0x7c00 ? -5 : 1);
    // v -= (ss[0] == ssBits) * (s == 0x7c00 ? -1 * cs.length : 1);

    return hands[v];
}

const evaluateHand = (handAr) => {
    // console.log("evaluateHand():", handAr);
    // const handAr = handString.split(" ");
    const faces = handAr
        .map((cardString) => cardString[0])
        .map((f) => Number(f) || faceLetters[f]);
    const fiveOfAKind = isFiveOfAKind(faces);
    if (fiveOfAKind) return hands[10];
    const handSuits = handAr.map((cardString) => suits[cardString[1]]);
    return rankPokerHand(faces, handSuits);
};

const getValueString = (handArray) => {
    // handArray is array of card names.  eg. 'AH'
    return handArray
        .map((cardName) =>
            String.fromCharCode([77 - cardRanks.indexOf(cardName[0])])
        )
        .sort()
        .join("");
};

const compareHands = (A, B) => {
    // Uses arrays of hand names ["AH","2S", etc]
    // return 1 (A beats B), 0 (tie), -1 (B beats A)
    const aRank = evaluateHand(A).rank;
    const bRank = evaluateHand(B).rank;
    let rankDiff = aRank - bRank;
    if (rankDiff === 0) {
        const aString = getValueString(A);
        const bString = getValueString(B);
        return aString < bString ? 1 : aString === bString ? 0 : -1;
    }
    return rankDiff > 0 ? 1 : rankDiff < 0 ? -1 : 0;
};

const findHandInHands = (handsAr, handAr) => {
    return handsAr.some((hand) =>
        handAr.every((cardString) => hand.includes(cardString))
    );
};

const getAllHandsWithWilds = (handArray) => {
    // console.log("getAllHandsWithWilds():", handString);
    // return all hands from all wildcard substitutions
    // const handArray = handString.split(" ");
    const nonWildCards = handArray.filter((c) => !c.includes("*"));
    const numWilds = handArray.length - nonWildCards.length;
    if (numWilds === 0) {
        return [handArray];
    }
    //
    const wildCombos = getCombinations(fullDeck, numWilds, true);
    console.log("wildCombos:", wildCombos.length);
    removeRedundancies(wildCombos);
    console.log("wilcCombos2: ", wildCombos.length);
    const allHands = [];
    for (const wc of wildCombos) {
        allHands.push([...nonWildCards, ...wc]);
        // console.log([...nonWildCards, ...wc])
        // console.log("allHands:", allHands);
    }
    // for(const hand of allHands){
    //     console.log('hand',hand);
    // }
    return allHands;
};

const removeRedundancies = (hands) => {
    // const uniqueArray = array.filter((element, index) => array.indexOf(element) === index);
    const uniqueArray = hands.filter(
        (hand, index) =>
            hands.findIndex((otherHand) =>
                otherHand.every(
                    (otherCard, index) => hand.indexOf(otherCard) === index
                )
            ) === index
    );
    // console.log('hands.length',hands);
    // console.log('uniqueArray:',uniqueArray);
    hands.length = 0;
    hands.push(...uniqueArray);
};

const getBestHandWithWildcards = (handArray) => {
    console.log("\n\rgetBestHandWithWildcards():", handArray);
    // (works with our without wild cards)
    // get all possible hands, with wild cards being every card from a full deck
    const allHands = getAllHandsWithWilds(handArray);
    console.log("allHands.length:", allHands.length);
    console.log("allHands:", allHands);
    removeRedundancies(allHands);
    console.log("allHands.length2:", allHands.length);
    // get every 5-card combination from each of those hands
    let all5cardHands = [];
    for (const hand of allHands) {
        // console.log("\nget Combinations for hand", hand);
        const fiveCardHands = getCombinations(hand, 5);
        // console.log('fiveCardHands:',fiveCardHands.length);
        all5cardHands.push(...fiveCardHands);
    }
    console.log("all5cardHands.length", all5cardHands.length);
    removeRedundancies(all5cardHands);
    //
    console.log("all5cardHands.length2", all5cardHands.length);
    // all5cardHands = [...new Set(all5cardHands)];
    // console.log('5cardsSet.length:',all5cardHands.length);
    // get the best of the 5-card hands
    let bestHandArray = all5cardHands.splice(0, 1)[0];
    for (const h of all5cardHands) {
        // const handNext = h.join(" ");
        if (compareHands(h, bestHandArray) === 1) {
            bestHandArray = h;
        }
    }
    console.log("bestHandArray: ", bestHandArray);
    return bestHandArray;
};

const buildDeck = () => {
    const deck = [];
    for (const s of cardSuits.split("")) {
        for (const r of cardRanks.split("")) {
            deck.push(r + s);
        }
    }
    return deck;
};

const fullDeck = buildDeck();

export {
    compareHands,
    // getHandDetails,
    // getHandName,
    // handRanks,
    getBestHandWithWildcards,
    findHandInHands,
    removeRedundancies,
    evaluateHand,
};
