import { getCombinations } from "./combinations.js";

// Thanks Mike Talbot!
// https://dev.to/miketalbot/real-world-javascript-map-reduce-solving-the-poker-hand-problem-3eie

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

const getHandName = (hand) => {
    console.log("getHandName()", hand.bestHand);
    console.log("rank: ", hand.handDetails.rank);
    return handRanks[hand.handDetails.rank];
};

const getHandValue = (hand) => {
    const value = getHandDetails(hand).value;
};

function getHandDetails(handString) {
    // console.log("getHandDetails()", handString);
    const cards = handString.split(" ");
    const faces = cards
        .map((a) => String.fromCharCode([77 - cardRanks.indexOf(a[0])]))
        .sort();
    const suits = cards.map((a) => a[1]).sort();
    const counts = faces.reduce(count, {});
    const duplicates = Object.values(counts).reduce(count, {});
    if (
        Object.keys(duplicates).includes("5") ||
        Object.keys(duplicates).includes("5")
    ) {
        console.log("\n================= getHandDetails()", handString);
        console.log("cards:", cards);
        console.log("faces:", faces);
        console.log("counts:", counts);
        console.log("duplicates:", duplicates);
        console.log("duplicates[5]:", duplicates[5]);
        console.log(
            "(duplicates[5] && '0') || (1 > 0 && 1):",
            (duplicates[5] && '0') || (1 > 0 && 1)
        );
    }

    const flush = suits[0] === suits[4];
    const first = faces[0].charCodeAt(0);
    //Also handle low straight
    const lowStraight = faces.join("") === "AJKLM";
    faces[0] = lowStraight ? "N" : faces[0];
    const straight =
        lowStraight ||
        faces.every((f, index) => f.charCodeAt(0) - first === index);
    let rank =
        (duplicates[5] && "0") ||
        (flush && straight && 1) ||
        (duplicates[4] && 2) ||
        (duplicates[3] && duplicates[2] && 3) ||
        (flush && 4) ||
        (straight && 5) ||
        (duplicates[3] && 6) ||
        (duplicates[2] > 1 && 7) ||
        (duplicates[2] && 8) ||
        9;
    rank = Number(rank);
    return {
        handString,
        rank,
        value: faces.sort(byCountFirst).join(""),
        name: handRanks[rank],
    };

    function byCountFirst(a, b) {
        //Counts are in reverse order - bigger is better
        const countDiff = counts[b] - counts[a];
        if (countDiff) return countDiff; // If counts don't match return
        return b > a ? -1 : b === a ? 0 : 1;
    }
    function count(c, a) {
        c[a] = (c[a] || 0) + 1;
        return c;
    }
}

function compareHands(h1, h2) {
    // console.log('compareHands()',h1,'v',h2)
    // returns whether h1 beats h2
    let d1 = getHandDetails(h1);
    let d2 = getHandDetails(h2);

    // console.log("hand details: ", d1);
    if (d1.rank === d2.rank) {
        if (d1.value < d2.value) {
            return "WIN";
        } else if (d1.value > d2.value) {
            return "LOSE";
        } else {
            return "DRAW";
        }
    }
    return d1.rank < d2.rank ? "WIN" : "LOSE";
}

const getAllHandsWithWilds = (handString) => {
    console.log("getAllHandsWithWilds():", handString);
    // return all hands from all wildcard substitutions
    const handStringArray = handString.split(" ");
    const nonWildCards = handStringArray.filter((c) => !c.includes("*"));
    const numWilds = handStringArray.length - nonWildCards.length;
    if (numWilds === 0) {
        return [handStringArray];
    }
    //
    const wildCombos = getCombinations(fullDeck, numWilds, true);
    console.log("wildCombos:", wildCombos.length);
    const allHands = [];
    for (const wc of wildCombos) {
        allHands.push([...nonWildCards, ...wc]);
    }
    console.log("allHands:", allHands.length);
    return allHands;
};

const getBestHandWithWildcards = (handString) => {
    console.log("getBestHandWithWildcards():", handString);
    // (works with our without wild cards)
    // get all possible hands, with wild cards being every card from a full deck
    const allHands = getAllHandsWithWilds(handString);
    // get every 5-card combination from each of those hands
    const all5cardHands = [];
    for (const hand of allHands) {
        const fiveCardHands = getCombinations(hand, 5);
        all5cardHands.push(...fiveCardHands);
    }
    // get the best of the 5-card hands
    let bestHandString = all5cardHands.splice(0, 1)[0].join(" ");
    for (const h of all5cardHands) {
        const handNext = h.join(" ");
        if (compareHands(handNext, bestHandString) === "WIN") {
            bestHandString = handNext;
        }
    }
    console.log("bestHandString: ", bestHandString);
    return bestHandString;
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
    getHandDetails,
    getHandName,
    handRanks,
    getBestHandWithWildcards,
};
