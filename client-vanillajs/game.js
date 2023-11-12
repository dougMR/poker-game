import { Player } from "./class-player.js";
import { assignClientSeat, assignNextSeat } from "./seats.js";
import { Hand } from "./class-hand.js";
import { view } from "./view.js";
import { betting } from "./betting.js";
// import { compareHands } from "./compare-hands-bitwise.js";
import { compareHands } from "./check-hands.js";
import { getNextOccupiedSeat } from "./seats.js";

//
// PLAYERS
//
const players = [];

const addPlayer = (name, isClient) => {
    // All players will be Client once Server is implemented
    if (
        !players.some(
            (player) => player.name.toLowerCase() === name.toLowerCase()
        )
    ) {
        const newPlayer = new Player(name);
        if (isClient) {
            newPlayer.seat = assignClientSeat(newPlayer);
        } else {
            newPlayer.seat = assignNextSeat(newPlayer);
        }
        newPlayer.hand = new Hand(newPlayer, deck);
        players.push(newPlayer);
        return newPlayer;
    }
    return null;
};

//
// GAME (handles Phases)
//
const game = {
    type: "",
    phaseIndex: 0,
    currentPhase: null,
    dealer: players[0],
    getCurrentGame: function () {
        // returns the game object, with phases, wildcards etc
        return gameTypes[this.type];
    },
    nextDealer: function () {
        if (!this.dealer) {
            this.dealer = players[0];
        } else {
            let dealerSeatIndex = this.dealer.seat.index;
            this.dealer = getNextOccupiedSeat(dealerSeatIndex).player;
        }

        console.log("nextDealer()", this.dealer.name);
        view.positionDealerButton();
    },
    getPlayersInHand: function () {
        return players.filter((p) => p.inHand);
    },
    startGame: function (gameType) {
        // Starts hand
        console.log("game.startGame()");
        rebuildDeck();
        for (const p of players) {
            p.inHand = true;
            p.hand.clearHand();
        }
        this.nextDealer();
        this.type = gameType;
        this.phaseIndex = 0;
        this.startPhase();
    },
    checkWild: function (card) {
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
    nextPhase: function () {
        // End the current Phase and move on
        console.log("game.nextPhase()");
        this.phaseIndex++;
        // console.log("this.phaseIndex:", this.phaseIndex);
        if (this.phaseIndex >= this.getCurrentGame().phases.length) {
            // Restart game
            this.startGame(this.type);
        } else {
            this.startPhase();
        }
    },
    startPhase: function () {
        console.log("");
        console.log("game.startPhase()");
        // if 1 or fewer players left, end game
        if (this.getPlayersInHand().length <= 1) {
            this.showdown();
            return;
        }
        this.currentPhase = {
            ...this.getCurrentGame().phases[game.phaseIndex],
        };
        const currentPhase = this.currentPhase;
        console.log("Phase: ", currentPhase.type);
        // Display Game and Phase
        view.output(
            game.type + "<br />Phase: " + currentPhase.type.toUpperCase()
        );
        const wilds = this.getCurrentGame().wildCards;
        if (wilds) {
            // Display list of Wilds
            let wildString = "Wilds: ";
            for (const wName of wilds) {
                if (wilds.indexOf(wName) !== 0) {
                    wildString += ", ";
                }
                wildString += wName[1] === "*" ? wName[0] : wName;
            }
            view.output(wildString, true);
        }

        // show / hide betting controls
        const bettingControls = document.getElementById("bet-controls");
        view.hideElement(bettingControls);

        // Handle Phase type
        if (currentPhase.type === "ante") {
            // betting round where options are Call (ante amount) or Fold
            betting.startAnte(currentPhase.amount);
        } else if (currentPhase.type === "deal") {
            dealAll(currentPhase.up, "up");
            dealAll(currentPhase.down, "down");
            dealAll(currentPhase.hole, "hole");
            dealCommunity(currentPhase.community);
            this.nextPhase();
        } else if (currentPhase.type === "bet") {
            // step through each player in order, starting with left of the dealer
            betting.resetBet();
            betting.nextBettor();
        } else if (currentPhase.type === "draw") {
            // discard and draw from deck
            betting.resetBet();
            betting.nextBettor();
        } else if (currentPhase.type === "trade") {
            // trade w another hand (other player, or even community)
        } else if (currentPhase.type === "discard") {
            //
        } else if (currentPhase.type === "showdown") {
            // find winner
            game.showdown();
        }
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
                    )
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
                // console.log(
                //     "cards:",
                //     player.hand.cards.map((c) => c.name).join(" ")
                // );

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

const dealCommunity = (numCards) => {
    console.log("dealCommunity", numCards);
};

const dealAll = (numCards, facing) => {
    if (numCards > 0) {
        // !! change this to deal in the order of seats, not players
        for (const player of game.getPlayersInHand()) {
            dealCard(numCards, player, facing);
        }
    }
};
const dealCard = (numCards, player, facing) => {
    // console.log("dealCard():", player.name, numCards);
    if (numCards > 0) {
        const cardDealt = player.hand.drawCard(numCards, facing);

        // Is it a Draw Again card?
        const drawAgainCards = game.getCurrentGame().drawAgain;
        if (
            (facing === "up" || facing === "community") &&
            drawAgainCards &&
            drawAgainCards.find((c) =>
                c[1] === "*" ? c[0] == cardDealt.name[0] : c === cardDealt.name
            )
        ) {
            // Draw Again
            dealCard(1, player, facing);
        }
    }
};

//
// DECK
//

const deck = [];
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
};

export { game, addPlayer, players, dealAll, dealCard, buildDeck };
