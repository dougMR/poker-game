/*
    Somewhat spaghetti, but works!
*/
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

//
//  Hand evaluator
//
function getCardFromRank(rank) {
    return cardRanks[rank];
}
function getRankFromCard(cardString) {
    return cardRanks.indexOf(cardString[0]);
}
function getFaceFromCardString(cardString) {
    return String.fromCharCode(77 - getRankFromCard(cardString));
}
function getFacesFromCards(cardsAr) {
    return cardsAr.map((c) => getFaceFromCardString(c));
}
function getCardStringFromFace(face) {
    // console.log('getCardStringFromFace() face:',face);
    const rankIndex = 77 - face.charCodeAt(0);
    // console.log(face,'--',cardRanks[rankIndex]);
    return cardRanks[rankIndex];
}

function getHandDetails(hand) {
    /*
        Look through all cards of hand, and find best 5-card poker hand
        Assumes hand is 5 or more cards
        Hand can include wilds

        Return object:
        {
            cards: array of 5 cards,
            faces: same cards, but with A-M representation -> used to be important for hand comparisons,
            rank: index of hand in handRanks[],
            name: name of hand, eg. "high card"
        }
    */
    const handLength = 5;
    // hand is instance of Hand class
    const handArray = [];
    for (const c of hand.cards) {
        handArray.push(c.isWild ? "**" : c.name);
    }
    if (handArray.length < handLength) {
        // Set hand to High Card
        return {
            cards: handArray,
            faces: getFacesFromCards(handArray),
            rank: 9,
            name: handRanks[9],
        };
    }
    console.log("getHandDetails()", handArray);
    const cards = handArray.filter((card) => card !== "**");
    cards.sort(sortByCharCode);
    console.log("cards:", cards);
    const numWild = handArray.length - cards.length;
    const faces = cards.map((a) => getFaceFromCardString(a)).sort();
    // console.log(faces.map(face=>getCardStringFromFace(face)));
    const suits = cards.map((a) => a[1]);
    console.log("suits:", suits);
    const suitCounts = Object.values(suits).reduce(count, {});
    console.log("suitCounts:", suitCounts);
    const counts = faces.reduce(count, {});
    // console.log("counts:", counts);
    const duplicates = Object.values(counts).reduce(count, {});
    console.log("faces:", faces);
    console.log("duplicates:", duplicates);
    // ---------------------
    //  Check All Hand Ranks
    // ---------------------
    const fiveOfAKind = getBest5ofAKind();
    if (fiveOfAKind) {
        fiveOfAKind.rank = 0;
        fiveOfAKind.name = handRanks[0];
        return fiveOfAKind;
    }
    const straightResults = checkStraight();
    let bestStraightFlush = straightResults.bestStraightFlush;
    if (bestStraightFlush) {
        bestStraightFlush.rank = 1;
        bestStraightFlush.name = handRanks[1];
        return bestStraightFlush;
    }
    const fourOfAKind = getBest4ofAKind();
    if (fourOfAKind) {
        fourOfAKind.rank = 2;
        fourOfAKind.name = handRanks[2];
        return fourOfAKind;
    }
    const fullHouse = getBestFullHouse();
    if (fullHouse) {
        fullHouse.rank = 3;
        fullHouse.name = handRanks[3];
        return fullHouse;
    }
    const flush = getBestFlush();
    if (flush) {
        flush.rank = 4;
        flush.name = handRanks[4];
        return flush;
    }
    const straight = straightResults.bestStraight;
    if (straight) {
        straight.rank = 5;
        straight.name = handRanks[5];
        return straight;
    }
    const threeOfAKind = getBest3ofAKind();
    if (threeOfAKind) {
        threeOfAKind.rank = 6;
        threeOfAKind.name = handRanks[6];
        return threeOfAKind;
    }
    const twoPair = getBestTwoPair();
    if (twoPair) {
        twoPair.rank = 7;
        twoPair.name = handRanks[7];
        return twoPair;
    }
    const pair = getBest2ofAKind();
    if (pair) {
        pair.rank = 8;
        pair.name = handRanks[8];
        return pair;
    }
    const highCard = getBestHighCardHand();
    if (highCard) {
        highCard.rank = 9;
        highCard.name = handRanks[9];
        return highCard;
    }

    // ---------------------
    // 5 of a kind?
    // ---------------------
    // highest duplicates key + numWild >= 5
    // console.log("5 kind", isFiveOfAKind);
    console.log("best 5 of a kind: ", getBest5ofAKind()?.cards);
    function getBest5ofAKind() {
        const handLength = 5;
        let naturals;
        if (numWild >= handLength) {
            naturals = new Array(handLength).fill("A*");
        } else {
            let best5face = Object.entries(counts).find(
                ([k, v]) => v + numWild >= 5
            );
            best5face = best5face && best5face[0];
            if (!best5face) return false;
            const best5card = getCardStringFromFace(best5face);
            naturals = getNaturals(best5card);
            naturals.length = Math.min(naturals.length, 5);
            // console.log("5naturals:", naturals);
            let wildsLeft = numWild;
            while (naturals.length < 5 && wildsLeft > 0) {
                naturals.unshift(best5card + "*");
                wildsLeft--;
            }
        }

        // No kicker
        // console.log("best5:", best5card);
        return {
            cards: naturals,
            faces: getFacesFromCards(naturals),
        };
    }

    // ---------------------
    // Straight Flush?
    // ---------------------
    // const straightResults = checkStraight();
    // let bestStraightFlush = straightResults.bestStraightFlush?.cards;
    console.log("bestStraightFlush:", bestStraightFlush);

    // ---------------------
    //  4 of a kind?
    // ---------------------

    console.log("best 4 kind: ", getBest4ofAKind()?.cards);
    function getBest4ofAKind() {
        let best4face = Object.entries(counts).find(
            ([k, v]) => v + numWild >= 4
        );
        best4face = best4face && best4face[0];
        if (!best4face) return false;
        const best4card = getCardStringFromFace(best4face);
        // console.log("best4:", best4card);
        // find the best kicker
        // console.log("cards:", cards);
        const naturals = getNaturals(best4card);
        naturals.length = Math.min(naturals.length, 4);
        // const finalHand = addWildsToMatching(naturals,best4card,4);
        // function addWildsToMatching(matchesSoFarAr,matchString,matchLength){
        let wildsLeft = numWild;
        // cards.filter(c=>c[0]===best4card);
        // console.log("naturals:", naturals);
        // console.log("wildsLeft:", wildsLeft);
        while (naturals.length < 4 && wildsLeft > 0) {
            naturals.unshift(best4card + "*");
            wildsLeft--;
        }
        // Kicker

        if (wildsLeft > 0) {
            // in this case, the hand is really 4 of a kind
            naturals.push(`${best4face === "A" ? "K" : "A"}*`);
            wildsLeft--;
        } else {
            // add next-highest card from cards
            naturals.push(cards.find((c) => !naturals.includes(c)));
        }

        return { cards: naturals, faces: getFacesFromCards(naturals) };
    }

    // ---------------------
    //  Full House?
    // ---------------------
    // const dupeKeys = Object.entries(duplicates).reduce(
    //     (accumulator, [key, val]) => {
    //         for (let v = 0; v < val; v++) {
    //             accumulator.push(key);
    //         }
    //         return accumulator;
    //     },
    //     []
    // ).reverse();
    // console.log('dupeKeys:',dupeKeys);
    const bestFullHouse = getBestFullHouse();

    function getBestFullHouse() {
        let best3 = Object.entries(counts).find(([k, v]) => v + numWild >= 3);
        if (best3) {
            best3 = best3[0];
            let wildsLeft = numWild - Math.max(0, 3 - counts[best3]);
            let best2 = Object.entries(counts).find(
                ([k, v]) => v + wildsLeft >= 2 && k !== best3
            );
            if (best2) {
                best2 = best2[0];
                const naturals3 = getNaturals(getCardStringFromFace(best3));
                naturals3.length = Math.min(naturals3.length, 3);
                const naturals2 = getNaturals(getCardStringFromFace(best2));
                naturals2.length = Math.min(naturals2.length, 2);
                wildsLeft = numWild;
                while (naturals3.length < 3 && wildsLeft > 0) {
                    naturals3.unshift(getCardStringFromFace(best3) + "*");
                    wildsLeft--;
                }
                while (naturals2.length < 2 && wildsLeft > 0) {
                    naturals2.unshift(getCardStringFromFace(best2) + "*");
                    wildsLeft--;
                }

                // no kicker
                return {
                    faces: [best3, best3, best3, best2, best2],
                    cards: [...naturals3, ...naturals2],
                };
            }
        }
        return false;
    }

    console.log("bestFullHouse ", bestFullHouse?.cards);
    // ---------------------
    //  Flush?
    // ---------------------

    console.log("bestFlush", getBestFlush());
    function getBestFlush() {
        const handLength = 5;
        // console.log("getBestFlush()");
        // use cards in order, preceded by all wilds
        const wilds = new Array(numWild).fill("A*");
        // starting with first (highest) card,
        for (let c = 0; c < cards.length; c++) {
            const flushHand = [...wilds, cards[c]];
            let firstSuit = cards[c][1];
            // console.log("flushHand:", flushHand);
            // see if we can make a flush with that as high
            for (let rest = c + 1; rest < cards.length; rest++) {
                // does this card match firstCard?
                const nextCard = cards[rest];
                const nextSuit = nextCard[1];
                if (firstSuit === "*" && nextSuit !== "*") firstSuit = nextSuit;
                // console.log("nextCard:", nextCard);
                if (nextSuit === "*" || nextSuit === firstSuit) {
                    flushHand.push(nextCard);
                    // console.log("flushHand:", flushHand);
                }
                if (flushHand.length >= handLength) {
                    flushHand.length = handLength;
                    return {
                        cards: flushHand,
                        faces: getFacesFromCards(flushHand),
                    };
                    // break;
                }
            }
        }
        return false;
        let bestSuit = Object.entries(suitCounts).find(
            ([k, v]) => v + numWild >= 5
        );
        console.log("bestSuit:", bestSuit);
        bestSuit = bestSuit && bestSuit[0];
        if (bestSuit) {
            // Find those cards
            const flushCards = cards
                .filter((c) => c[1] === bestSuit)
                .slice(0, 5 - numWild);
            let wildsLeft = numWild;
            let prevRank = cardRanks.length - 1;
            for (const c of flushCards) {
                // while there's room before and we still have wilds, add wild before
                const cardRank = getRankFromCard(c);
                let tempLoops = 0;
                while (
                    prevRank - cardRank > 1 &&
                    wildsLeft > 0 &&
                    tempLoops < 100
                ) {
                    tempLoops++;
                    prevRank--;
                    const fillCard = getCardFromRank(prevRank) + "*";
                    const cardIndex = flushCards.indexOf(c);
                    flushCards.splice(cardIndex - 1, 0, fillCard);
                    wildsLeft--;
                }
            }
            prevRank = getRankFromCard(flushCards[flushCards.length - 1]);
            // Any wilds left to add to the end of the hand?
            let tempLoops = 0;
            while (wildsLeft > 0 && prevRank > 0 && tempLoops < 100) {
                tempLoops++;
                // Add wilds after the last card
                // get last Card's rank
                prevRank--;
                const fillCard = getCardFromRank(prevRank) + "*";
                flushCards.push(fillCard);
                wildsLeft--;
            }
            return flushCards;
        }
        return null;
    }
    // ---------------------
    // Straight?
    // ---------------------
    let bestStraight = straightResults.bestStraight?.cards;
    console.log("bestStraight:", bestStraight);

    // ---------------------
    //  3 of a kind?
    // ---------------------

    console.log("best 3 of a kind: ", getBest3ofAKind()?.cards);
    function getBest3ofAKind() {
        const handLength = 5;
        let best3 = Object.entries(counts).find(([k, v]) => v + numWild >= 3);
        best3 = best3 && best3[0];
        if (!best3) return false;
        // console.log("best3:", best3);
        const naturals = getNaturals(getCardStringFromFace(best3));
        naturals.length = Math.min(naturals.length, 3);
        let wildsLeft = numWild;
        while (naturals.length < 3 && wildsLeft > 0) {
            naturals.unshift(getCardStringFromFace(best3) + "*");
            wildsLeft--;
        }
        // Kickers
        while (naturals.length < handLength) {
            if (wildsLeft > 0) {
                // in this case, the hand is really 4 of a kind
                for (const r of [...cardRanks].reverse()) {
                    if (!naturals.find((c) => c[0] === r)) {
                        naturals.push(r + "*");
                        wildsLeft--;
                        break;
                    }
                }
            } else {
                // add next-highest card from cards
                naturals.push(cards.find((c) => !naturals.includes(c)));
            }
        }
        // console.log("best3:", best3);
        if (naturals.length === handLength) {
            return {
                cards: naturals,
                faces: getFacesFromCards(naturals),
            };
        }
        return false;
    }

    // ---------------------
    //  2 Pair?
    // ---------------------

    console.log("best 2 pair: ", getBestTwoPair()?.cards);
    function getBestTwoPair() {
        // console.log("getBestTwoPair()");
        let best2 = Object.entries(counts).find(([k, v]) => v + numWild >= 2);
        if (best2) {
            best2 = best2[0];
            // console.log("best2-", best2);
            let wildsLeft = numWild - Math.max(0, 2 - counts[best2]);
            let nextBest2 = Object.entries(counts).find(
                ([k, v]) => v + wildsLeft >= 2 && k !== best2
            );
            if (nextBest2) {
                nextBest2 = nextBest2[0];
                const naturals2a = getNaturals(getCardStringFromFace(best2));
                naturals2a.length = Math.min(naturals2a.length, 3);
                const naturals2b = getNaturals(
                    getCardStringFromFace(nextBest2)
                );
                naturals2b.length = Math.min(naturals2b.length, 2);
                wildsLeft = numWild;
                while (naturals2a.length < 2 && wildsLeft > 0) {
                    naturals2a.unshift(getCardStringFromFace(best2) + "*");
                    wildsLeft--;
                }
                while (naturals2b.length < 2 && wildsLeft > 0) {
                    naturals2b.unshift(getCardStringFromFace(nextBest2) + "*");
                    wildsLeft--;
                }
                // Kicker
                let kicker = "";
                if (wildsLeft > 0) {
                    for (const r of [...cardRanks].reverse()) {
                        if (
                            !(
                                naturals2a.find((c) => c[0] === r) ||
                                naturals2b.find((c) => c[0] === r)
                            )
                        ) {
                            kicker = r + "*";
                            break;
                        }
                    }
                } else {
                    kicker = cards.find(
                        (c) =>
                            !naturals2a.includes(c) && !naturals2b.includes(c)
                    );
                }

                return {
                    faces: [
                        best2,
                        best2,
                        nextBest2,
                        nextBest2,
                        getFaceFromCardString(kicker),
                    ],
                    cards: [...naturals2a, ...naturals2b, kicker],
                };
            }
        }
        return false;
    }
    // ---------------------
    //  2 of a kind?
    // ---------------------
    console.log("best 2 of a kind: ", getBest2ofAKind()?.cards);
    function getBest2ofAKind() {
        // console.log("getBest2ofAKind()");
        const handLength = 5;
        let best2 = Object.entries(counts).find(([k, v]) => v + numWild >= 2);
        best2 = best2 && best2[0];
        if (!best2) return false;
        // console.log("best2:", best2);
        // console.log("best2 card:",getCardStringFromFace(best2));
        const naturals = getNaturals(getCardStringFromFace(best2));

        naturals.length = Math.min(naturals.length, 2);
        let wildsLeft = numWild;
        while (naturals.length < 2 && wildsLeft > 0) {
            naturals.unshift(getCardStringFromFace(best2) + "*");
            wildsLeft--;
        }
        // Kickers
        while (naturals.length < handLength) {
            if (wildsLeft > 0) {
                // in this case, the hand is really 3 of a kind or better
                for (const r of [...cardRanks].reverse()) {
                    if (!naturals.find((c) => c[0] === r)) {
                        // console.log(r, "not in", naturals);
                        naturals.push(r + "*");
                        wildsLeft--;
                        break;
                    }
                }
            } else {
                // add next-highest card from cards
                naturals.push(
                    cards.find((c) => !naturals.find((n) => n[0] === c[0]))
                );
            }
        }
        // console.log("best2:", best2);
        if (naturals.length === handLength) {
            // console.log("2-kind cards:", naturals);
            // console.log("2-kind faces:", getFacesFromCards(naturals));
            return {
                cards: naturals,
                faces: getFacesFromCards(naturals),
            };
        }
        return false;
    }
    // ---------------------
    //  High Card?
    // ---------------------

    console.log("best high card hand:", getBestHighCardHand()?.cards);
    function getBestHighCardHand() {
        const handLength = 5;
        const handCards = [];
        let loopTemp = 0;
        while (handCards.length < handLength && loopTemp < cards.length) {
            const nextCard = cards[loopTemp];
            if (!handCards.find((f) => nextCard[0] === f[0])) {
                handCards.push(nextCard);
            }
            loopTemp++;
        }
        let wildsLeft = numWild;
        while (wildsLeft > 0 && handCards.length < handLength) {
            handCards.push(
                [...cardRanks]
                    .reverse()
                    .find((c) => !handCards.find((f) => f[0] === c[0])) + "*"
            );
        }
        loopTemp = 0;
        //  Out of options, this will no longer be a high-card hand
        while (handCards.length < handLength && loopTemp < cards.length) {
            const nextCard = cards[loopTemp];
            if (!handCards.includes(nextCard)) {
                handCards.push(nextCard);
            }
            loopTemp++;
        }
        handCards.sort(sortByCharCode);
        //  console.log('handCards: ',handCards);
        return {
            cards: handCards,
            faces: getFacesFromCards(handCards),
        };
    }

    // console.log("isStraight:", isStraight);

    // const isStraight = sequence.every(
    //     (f, index) => f.charCodeAt(0) - firstFace === index
    // );
    // !! WRONG.  the straight cards don't have to be in sequence if there are wilds to span the gaps
    // !! ALSO, there might be repeated numbers (eg. 2,3,3,3,4,5,6) so neighbors won't be a sequence

    // break;
    // const flush = suits[0] === suits[4];
    // const first = faces[0].charCodeAt(0);
    //Also handle low straight
    // const lowStraight = faces.join("") === "AJKLM";
    // const lowStraight = faces.join("").includes("AJKLM");
    // faces[0] = lowStraight ? "N" : faces[0];
    // const straight =
    //     lowStraight ||
    //     faces.every((f, index) => f.charCodeAt(0) - first === index);
    /*let rank =
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
    console.log("rank:", rank);
    console.log("value:", faces.sort(byCountFirst).join(""));
    console.log("best:");
    console.log("name:", handRanks[rank]);
    return {
        rank,
        value: faces.sort(byCountFirst).join(""),
        name: handRanks[rank],
    };
*/

    function getNaturals(cardToMatch) {
        cardToMatch = cardToMatch[0];
        const cardsDupe = [...cards];
        const naturals = [];
        let c = cardsDupe.length;
        while (c--) {
            if (cardsDupe[c][0] === cardToMatch) {
                naturals.push(cardsDupe.splice(c, 1)[0]);
            }
        }
        return naturals;
    }

    function cardCode(cardString) {
        return cardString.charCodeAt(0);
    }

    function sortByCharCode(a, b) {
        const aFace = getFaceFromCardString(a);
        const bFace = getFaceFromCardString(b);
        // console.log('aCode,bCode',aCode,bCode);
        return aFace > bFace ? 1 : bFace === aFace ? 0 : -1;
    }
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

    function checkStraight() {
        // !!! Make this check for low straight too (A,2,3,4,5)
        const handLength = 5;
        // const minStraightLength = handLength - numWild;
        // console.log("minStraightLength", minStraightLength);
        const straights = [];
        const straightCards = [];
        let sequence = null;
        let sequenceCards = null;
        let wcLeft = 0;
        // !! Need to add wilds before or after faces to make straights
        // !! eg. faces=['B','C','D','E','G'], 2 wilds
        // !! we can make ABCDE and DEFGH
        for (let charIndex = 0; charIndex <= faces.length - 1; charIndex++) {
            wcLeft = numWild;
            sequence = [faces[charIndex]];
            sequenceCards = [cards[charIndex]];
            // console.log('Start sequence:',sequence);
            let nextIndex = charIndex + 1;
            while (sequence.length < handLength && nextIndex < faces.length) {
                // go until we have a sequence of handLength
                let nextFace = faces[nextIndex];
                // console.log("check next:",nextFace);
                while (
                    sequence.includes(nextFace) &&
                    nextIndex < faces.length - 2
                ) {
                    // next card num is already in sequence, get next card
                    nextIndex++;
                    nextFace = faces[nextIndex];
                    // console.log('skip duplicate, check next:',nextFace);
                }
                let gap = cardCode(nextFace) - getEndCode() - 1;
                // console.log('gap, wcLeft:',gap,wcLeft);
                while (
                    wcLeft >= gap &&
                    gap > 0 &&
                    sequence.length < handLength
                ) {
                    // fill the gap with wilds
                    wcLeft--;
                    gap--;
                    const wildFace = String.fromCharCode(getEndCode() + 1);
                    sequence.push(wildFace); // + "*");
                    sequenceCards.push(getCardStringFromFace(wildFace) + "*");
                    // console.log('fill gap, ',sequence);
                }
                checkAddWildsBefore();
                if (gap === 0 && sequence.length < handLength) {
                    // console.log("Add ", nextFace, "to sequence");
                    sequence.push(nextFace);
                    sequenceCards.push(cards[nextIndex]);
                }
                checkAddWildsBefore();
                // console.log("end sequence:", sequenceCards);
                // Check for low straight - !!! Make it work for hands other than 5 cards
                if (
                    sequenceCards.length === 4 &&
                    sequenceCards[0][0] == 5 &&
                    sequenceCards[3][0] == 2
                ) {
                    const aceIndex = cards.findIndex((c) => c[0] === "A");
                    // console.log("sequenceCards:", sequenceCards);
                    // console.log("aceIndex:", aceIndex);
                    // console.log("faces:", faces);
                    // console.log("cards:", cards);
                    if (aceIndex !== -1) {
                        sequenceCards.push(cards[aceIndex]);
                        sequence.push(faces[aceIndex]);
                    }
                }
                if (sequence.length >= handLength) {
                    // console.log("push sequence:", sequenceCards);
                    straights.push(sequence);
                    straightCards.push(sequenceCards);
                    break;
                } else if (gap > 0) {
                    // Continue for loop, this sequence is no good.
                    break;
                }

                nextIndex++;
            }
            // if (sequence.length < handLength) {
            //     continue;
            // }
        }
        // console.log("straights:", straights);
        const straightFlushes = [];
        let bestStraight = null;
        let bestStraightCards = null;
        let highestCard = Infinity;
        for (let s = 0; s < straights.length; s++) {
            //
            // Check for straight flush
            //
            // console.log("straight:", straights[s]);
            // console.log("straightCards:", straightCards[s]);
            const highCode = cardCode(straights[s][0]);
            // console.log(highCode);
            if (highCode < highestCard) {
                highestCard = highCode;
                bestStraight = straights[s];
                bestStraightCards = straightCards[s];
            }
            // Flush?
            const nonWild = straightCards[s].filter((c) => c[1] !== "*");
            // we can assume the rest are wild (?)
            const flush = nonWild.every((c) => c[1] === nonWild[0][1]);
            // console.log("flush:", flush);
            if (flush) {
                straightFlushes.push({
                    faces: straights[s],
                    cards: straightCards[s],
                });
            } else {
                // can we make it a flush with leftover wilds?
                let wcLeft = numWild - (handLength - nonWild.length);
                // which suit is there the most of?
                const suits = nonWild.map((a) => a[1]);
                // console.log("straight suits:", suits);
                const suitCounts = Object.values(suits).reduce(count, {});
                // console.log("straightSuitCounts:", suitCounts);
                // get highest occurring suit
                const mostSuit = Object.keys(suitCounts).reduce((a, b) =>
                    suitCounts[a] > suitCounts[b] ? a : b
                );
                // console.log('nonWild.length:',nonWild.length);
                // console.log('suitCounts[mostSuit]:',suitCounts[mostSuit]);
                // console.log('wcLeft:',wcLeft);
                // console.log('suitCounts[mostSuit] + wcLeft:',suitCounts[mostSuit]+wcLeft)
                if (suitCounts[mostSuit] + wcLeft >= nonWild.length) {
                    // This can be a straight flush.  Make it
                    // console.log("straight hand: ", straightCards[s]);
                    const suitOnlyHand = straightCards[s].map((c) =>
                        c[1] !== mostSuit ? c[0] + "*" : c
                    );
                    // console.log("suitOnlyHand: ", suitOnlyHand);
                    // console.log('Straight Flush: ',suitOnlyHand)
                    straightFlushes.push({
                        faces: straights[s],
                        cards: suitOnlyHand,
                    });
                }
            }
        }
        // console.log("bestStraight: ", bestStraight);
        // console.log("straight flushes:", straightFlushes.length);
        let bestStraightFlush = null;
        highestCard = Infinity;
        for (const sf of straightFlushes) {
            // console.log("sf:", sf);
            const highCode = cardCode(sf.faces[0]);
            // console.log(highCode);
            if (highCode < highestCard) {
                highestCard = highCode;
                bestStraightFlush = sf;
            }
        }
        // console.log("bestStraightFlush:", bestStraightFlush);
        if (bestStraight) {
            bestStraight = {
                faces: bestStraight,
                cards: bestStraightCards,
            };
        }
        return { bestStraight, bestStraightFlush };
        //
        function getEndCode() {
            // console.log("endCode:", cardCode(sequence.slice(-1)[0]));
            return cardCode(sequence.slice(-1)[0]);
        }

        function checkAddWildsBefore() {
            if (
                wcLeft > 0 &&
                wcLeft + sequence.length >= handLength &&
                cardCode(sequence[0]) - cardCode("A") >= 1
            ) {
                // Put wildcards at the high end of the sequence
                // console.log("Add Wildcards Before ", sequence);
                for (wcLeft; wcLeft > 0; wcLeft--) {
                    if (sequence[0] === "A") {
                        // try adding after
                        const face = String.fromCharCode(getEndCode() + 1);
                        // console.log("Add ", face, " to end of ", sequence);
                        sequence.push(face);
                        sequenceCards.push(getCardStringFromFace(face) + "*");
                    } else {
                        // add before
                        const face = String.fromCharCode(
                            cardCode(sequence[0]) - 1
                        );
                        // console.log("Add ", face, " to front of ", sequence);
                        sequence.unshift(face);
                        sequenceCards.unshift(
                            getCardStringFromFace(face) + "*"
                        );
                    }
                }
            }
        }
    }
}
function compareHands(h1, h2) {
    // h1 h2 instances of Hand class
    // returns 1, 0, -1.  1 = h1 beats h2
    console.log("ranks, h1, h2:", h1.rank, h2.rank);
    console.log("values, h1, h2:", h1.value, h2.value);
    if (h1.rank === h2.rank) {
        if (h1.value < h2.value) {
            return 1;
        } else if (h1.value > h2.value) {
            return -1;
        } else {
            return 0;
        }
    }
    return h1.rank < h2.rank ? 1 : -1;
}
export { getHandDetails, compareHands };
