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
    return handRanks[getHandDetails(hand).rank];
};

const getHandValue = (hand) => {
    const value = getHandDetails(hand).value;
}

function getHandDetails(hand) {
    const cards = hand.split(" ");
    const faces = cards
        .map((a) => String.fromCharCode([77 - cardRanks.indexOf(a[0])]))
        .sort();
    const suits = cards.map((a) => a[1]).sort();
    const counts = faces.reduce(count, {});
    const duplicates = Object.values(counts).reduce(count, {});
    const flush = suits[0] === suits[4];
    const first = faces[0].charCodeAt(0);
    //Also handle low straight
    const lowStraight = faces.join("") === "AJKLM";
    faces[0] = lowStraight ? "N" : faces[0];
    const straight =
        lowStraight ||
        faces.every((f, index) => f.charCodeAt(0) - first === index);
    let rank =
        (duplicates[5] && 0) ||
        (flush && straight && 1) ||
        (duplicates[4] && 2) ||
        (duplicates[3] && duplicates[2] && 3) ||
        (flush && 4) ||
        (straight && 5) ||
        (duplicates[3] && 6) ||
        (duplicates[2] > 1 && 7) ||
        (duplicates[2] && 8) ||
        9;

    return { rank, value: faces.sort(byCountFirst).join("") };

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
    // returns whether h1 beats h2
    let d1 = getHandDetails(h1);
    let d2 = getHandDetails(h2);

    console.log('hand details: ',d1);
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

export { compareHands, getHandDetails, getHandName };
