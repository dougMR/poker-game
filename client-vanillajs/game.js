import { Player } from "./class-player.js";
import { assignClientSeat, assignNextSeat } from "./seats.js";
import { Hand } from "./class-hand.js";
import { view } from "./view.js";
import { betting } from "./betting.js";
import { compareHands } from "./compare-hands.js";

//
// PLAYERS
//
const players = [];

const addPlayer = (name, isClient) => {
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
// GAME
//
const game = {
    type: "",
    phaseIndex: 0,
    currentPhase: null,
    dealer: players[0],
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
        rebuildDeck();
        this.nextDealer();
        for (const p of players) {
            p.inHand = true;
        }
        this.type = gameType;
        this.startPhase();
    },
    nextPhase: function () {
        console.log("nextPhase()");
        // setTimeout(() => {
        this.phaseIndex++;
        this.startPhase();
        // }, 500);
    },
    startPhase: function () {
        console.log("startPhase()");
        // if 1 or fewer players left, end game
        if (this.getPlayersInHand().length <= 1) {
            this.showdown();
            return;
        }
        const currentPhase = (this.currentPhase = {
            ...gameTypes[game.type].phases[game.phaseIndex],
        });
        console.log("Phase: ", currentPhase.type);
        view.output(
            game.type + "<br/>Phase: " + currentPhase.type.toUpperCase()
        );
        // show / hide betting controls
        const bettingControls = document.getElementById("bet-controls");
        view.hideElement(bettingControls);

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
        console.log("game.currentPhase:", game.currentPhase.type);
        return ["draw", "trade", "discard"].includes(game.currentPhase.type);
    },
    showdown: function () {
        // showdown All Players
        console.log("showdown():");
        let winningCircumstance = "";
        let winningPlayer = this.getPlayersInHand()[0];
        if (this.getPlayersInHand().length <= 1) {
            // Hand should end before there's zero players, let's assume 1 left for now
            winningCircumstance = " without opposition.";
        } else {
            // if there's more than 1 player, they must have cards...
            winningPlayer.hand.showHand();
            winningPlayer.hand.showHandName();
            for (const player of this.getPlayersInHand().slice(1)) {
                const result = compareHands(
                    player.hand.bestHand,
                    winningPlayer.hand.bestHand
                );
                if (result === "WIN") {
                    winningPlayer = player;
                }
                player.hand.showHand();
                player.hand.showHandName();
            }
            winningPlayer.hand.showHandWon();
            const rank = winningPlayer.hand.handDetails.rank;
            const articleRanks = [1, 3, 4, 5, 8, 9];
            winningCircumstance =
                " with " +
                (articleRanks.includes(rank) ? "a " : "") +
                winningPlayer.hand.handName;
        }

        view.output(`${winningPlayer.name} WINS${winningCircumstance}`);
        // Award winner.  Handle tie/s
        betting.payPot(winningPlayer);
    },
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
        wildCards: ['2*', 'KH']
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
        player.hand.drawCard(numCards, facing);
    }
};

export { game, addPlayer, players, dealAll, dealCard };
