import { players } from "./main.js";


// let currentGame = null;
const game = {
    type: "",
    phaseIndex: 0,
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
    // seat order is only meaningful to the client
    // to server, all players are same, there is no specific Client Player
    nextPhase: function () {
        console.log("nextPhase()");
        this.phaseIndex++;
        this.startPhase();
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
    startPhase: function () {
        console.log("startPhase()");
        const currentPhase = {
            ...gameTypes[game.type].phases[game.phaseIndex],
        };
        view.output(
            game.type + "<br/>Phase: " + currentPhase.type.toUpperCase()
        );
        // show / hide betting controls
        const bettingControls = document.getElementById("bet-controls");
        view.hideElement(bettingControls);

        if (currentPhase.type === "ante") {
            
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
        } else if (currentPhase.type === "trade") {
        } else if (currentPhase.type === "discard") {
        } else if (currentPhase.type === "showdown") {
            game.showdown();
        }
    },
    showdown: function () {
        // showdown All Players
        console.log("showdown():");
        let winningPlayer = players[0];
        winningPlayer.hand.showHand();
        winningPlayer.hand.showHandName();
        for (const player of players.slice(1)) {
            // console.log('winningPlayer:',winningPlayer.name)
            // console.log('player:',player.name);
            // console.log('winningHand:',winningPlayer.hand.bestHand);
            // console.log('playerHand:',player.hand.bestHand);
            const result = compareHands(
                // player.hand.handString,
                // winningPlayer.hand.handString
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
        const articleRanks = [1, 3, 4, 5, 8, 9];
        const rank = winningPlayer.hand.handDetails.rank;
        view.output(
            winningPlayer.name +
                " WINS with " +
                (articleRanks.includes(rank) ? "a " : "") +
                winningPlayer.hand.handName
        );
    },
};

export {game};