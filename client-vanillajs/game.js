// import { Player } from "./class-player.js";
// import { assignClientSeat, assignNextSeat } from "./seats.js";
// import { Hand } from "./class-hand.js";
import { view } from "./view.js";
import { betting } from "./betting.js";
// import { compareHands } from "./compare-hands-bitwise.js";
import { compareHands } from "./check-hands.js";
// import { getNextOccupiedSeat } from "./seats.js";

//
// PLAYERS
//


//
// GAME (handles Phases)
//
const game = {
    type: "",
    phaseIndex: 0,
    currentPhase: null,
    dealer: players[0],
    
   
    checkWild: function (card) {
        console.log('game.checkWild()')
        // Is this card wild in the current game?
        // return true or false
        const wildCards = this.getCurrentGame().wildCards;
        if (!wildCards) return false;
        for (const wc of wildCards) {
            if (wc[0] === card.string[0]) {
                // face (number) matches
                if (wc[1] === "*") {
                    // any suit
                    return true;
                } else {
                    // specific suit
                    if (wc[1] === card.string[1]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    isDrawPhase: function () {
        // Is this a Phase where we draw/trade cards?
        // return true / false
        return ["draw", "trade", "discard"].includes(this.currentPhase.type);
    },
    showdown: function () {
        // showdown All Players, compare hands and determine winner
        console.log("showdown():");
        // Set phaseIndex in case we got to showdown prematurely (only 1 player left)
        this.phaseIndex = this.getCurrentGame().phases.length - 1;
        let winningCircumstance = "";
        let winningPlayers = [];
        if (this.getPlayersInHand().length <= 1) {
            // Hand should end before there's zero players, let's assume 1 left for now
            winningPlayers = [this.getPlayersInHand()[0]];
            winningCircumstance = " without opposition.";
        } else {
            winningPlayers = [this.getPlayersInHand()[0]];
            winningPlayers[0].hand.arrangeByBest();
            winningPlayers[0].hand.showHand();
            winningPlayers[0].hand.showHandName();

            // if there's more than 1 player, they must have cards...
            for (const player of this.getPlayersInHand().slice(1)) {
                if (winningPlayers.length !== 0) {
                    console.log(
                        "hands:",
                        player.hand.name,
                        "vs",
                        winningPlayers[0].hand.name
                    );
                    console.log(
                        "cards:",
                        player.hand.bestHand,
                        "vs",
                        winningPlayers[0].hand.bestHand
                    );
                    const result = compareHands(
                        player.hand,
                        winningPlayers[0].hand
                    );

                    if (result === 1) {
                        winningPlayers = [player];
                    } else if (result === 0) {
                        winningPlayers.push(player);
                    }

                    player.hand.arrangeByBest();
                    player.hand.showHand();
                    player.hand.showHandName();
                }

                console.log("BEST:", winningPlayers[0].hand.name);
            }

            const rank = winningPlayers[0].hand.handDetails.rank;
            const articleRanks = [1, 3, 4, 5, 8, 9];

            winningCircumstance =
                " with " +
                (articleRanks.includes(rank) ? "a " : "") +
                winningPlayers[0].hand.name;
        }
        let names = "";
        const pluralPlayers = winningPlayers.length > 0 ? "" : "S";
        for (const wp of winningPlayers) {
            wp.hand.showHandWon();
            names +=
                wp.name + winningPlayers.length > 1 &&
                wp !== winningPlayers.slice(-1)[0]
                    ? ", "
                    : "";
            betting.payFromPot(
                wp,
                Math.floor(betting.pot / winningPlayers.length)
            );
        }
        view.output(
            `${names}WIN${pluralPlayers} <br />* * *<br />${winningCircumstance}`
        );
        // Award winner.  Handle tie/s
    },
};


//
// DECK
//
const cardRanks = "23456789TJQKA";
const cardSuits = "DCHS";
const gameTypes = {
    "7 Card Stud": {
        phases: [
            { type: "ante", amount: 5 },
            { type: "deal", up: 0, down: 0, hole: 2, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "showdown" },
        ],
    },
    "5 Card Draw": {
        phases: [
            { type: "ante", amount: 5 },
            { type: "deal", up: 0, down: 0, hole: 5, community: 0 },
            { type: "bet" },
            { type: "draw", tradeLimit: 3 },
            { type: "bet" },
            { type: "showdown" },
        ],
        wildCards: ["2*", "KH", "3*", "4*", "5*", "6*", "T*"],
    },
    Baseball: {
        phases: [
            { type: "ante", amount: 5 },
            { type: "deal", up: 0, down: 0, hole: 2, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "deal", up: 1, down: 0, hole: 0, community: 0 },
            { type: "bet" },
            { type: "showdown" },
        ],
        wildCards: ["3*", "9*"],
        drawAgain: ["4*"],
    },
    /*
    Not ready for no-peeky games
    hand evaluation (getHandDetails()) only set up for 5+ card hands .
    No-peeky needs to compare hands of 1,2,3,4 cards as well
    because active player has to turn cards up until their hand is highest.

    "Night Baseball": {
        phases: [
            { type: "ante", amount: 5 },
            { type: "deal", up: 0, down: 7, hole: 0, community: 0 },
            { type: "turn-cards" },
        ],
        wildCards: ["3*", "9*"],
        drawAgain: ["4*"],
    },
    */
};

export { game };
