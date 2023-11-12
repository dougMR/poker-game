import { clientPlayer, players } from "./main.js";
import { getNextOccupiedSeat, seats } from "./seats.js";
import { view } from "./view.js";
import { game } from "./game.js";

// TURNS (within a game Phase)
const betting = {
    currentBet: 0,
    pot: 0,
    firstBettor: null,
    currentBettor: null,
    inAnteRound: false,
    nextBettor: function () {
        // End current bettor's turn
        console.log("nextBettor()");
        let bettor;
        if (!this.currentBettor) {
            // first bet of game
            bettor = this.findNextBettor(game.dealer);
            for (const p of players) {
                p.hasPlayed = false;
            }
            // What if bettor is null?
            this.activateBettor(bettor);
            this.firstBettor = this.currentBettor;
        } else {
            this.currentBettor.hasPlayed = true;
            if (
                game
                    .getPlayersInHand()
                    .findIndex((p) => p.hasPlayed === false) === -1 &&
                this.checkPlayersBetsEven()
            ) {
                // Everyone has had a turn and everyone's even
                // Everyone has bet.  Betting round over
                this.endBettingPhase();
            } else {
                // Next
                bettor = this.findNextBettor(this.currentBettor);
                this.activateBettor(bettor);
            }
        }
    },

    findNextBettor: function (player) {
        // return the next bettor
        // null if everyone has played
        console.log("findNextBetttor() after", player.name);
        let bettor = getNextOccupiedSeat(player.seat.index).player;
        let tempLoops = 0;
        while (!bettor.inHand) {
            bettor = getNextOccupiedSeat(bettor.seat.index).player;
            if (!bettor || bettor === player || tempLoops > 9) {
                // we don't seem to ever reach here
                // but keep it as a safety net
                console.error("betting: no player inHand");
                console.log("temploops:", tempLoops);
                // maybe we should start next phase?
                return null;
            }
            tempLoops++;
        }
        return bettor;
    },
    activateBettor: function (who) {
        // hilight this player (un-hilight others)
        // show betting controls for this player
        console.log("activateBettor()", who.name);
        this.currentBettor = who;
        // enable bettor's controls
        view.hideBetControls();
        for (const player of players) {
            if (player === this.currentBettor) {
                view.hilightPlayer(player);
                if (player === clientPlayer) {
                    // all players will be clientPlayers once server is implemented
                    // enable betting controls - only for active client
                    view.showBetControls();
                }
            } else {
                view.unhilightPlayer(player);
            }
        }
    },
    startAnte: function (amount) {
        // start ante round
        console.log("betting.startAnte()");
        this.inAnteRound = true;
        if (typeof amount != "number") {
            console.error("betting.startAnte() requires an amount.");
        }
        this.currentBet = amount;
        this.nextBettor();
    },
    endAnte: function () {
        this.inAnteRound = false;
    },
    bet: function (amount) {
        // Submit a bet
        const minBet = this.getMinBet();
        if (minBet > this.currentBettor.amountBetThisRound + amount) {
            alert("You must bet at least $" + minBet + ", or Fold");
        } else {
            // bet is legit, apply it
            betting.raise(amount);
            betting.nextBettor();
        }
    },
    raise: function (amount) {
        // Carry out the bet
        this.currentBettor.amountBetThisRound += amount;
        this.currentBettor.stack -= amount;
        this.currentBet += amount - this.currentBet;
        this.pot += amount;
        view.setPot(betting.pot);
    },
    check: function (amount) {
        betting.nextBettor();
    },
    getMinBet: function () {
        // Return minimum amount to call
        // console.log("getMinBet()");
        return Math.max(
            0,
            this.currentBet - this.currentBettor.amountBetThisRound
        );
    },
    call: function () {
        console.log("betting.call():", this.currentBettor.name);
        const minBet = this.getMinBet();
        console.log("minBet:", minBet);
        if (minBet > 0) {
            if (confirm("Call $" + minBet + "?")) {
                console.log("calling...");
                this.bet(minBet);
            }
        } else {
            // Nothing to call
            // checking
            this.check();
        }
    },
    resetBet: function () {
        // Set bet to zero, for betting and all players
        for (const p of players) {
            p.amountBetThisRound = 0;
        }
        this.currentBet = 0;
        view.setBet(0);
    },
    fold: function () {
        //
        console.log("fold():", this.currentBettor.name);
        this.currentBettor.inHand = false;
        view.foldHand(this.currentBettor);
        // Anyone left in hand?
        if (game.getPlayersInHand().length === 1) {
            // One player left, they win
            this.endBettingPhase();
            // Should we end the hand, or leave that to another part of the app, such as 'game'?
        } else {
            this.nextBettor();
        }
    },
    checkPlayersBetsEven: function () {
        // Is everyone settled up?
        for (const p of players) {
            if (p.inHand && p.amountBetThisRound < this.currentBet) {
                return false;
            }
        }
        return true;
    },
    endBettingPhase: function () {
        if (this.inAnteRound) this.endAnte();
        this.currentBettor = null;
        this.currentBet = 0;
        view.unhilightAllPlayers();
        game.nextPhase();
    },
    payFromPot: function (player, amount) {
        // give pot to player
        player.stack += amount;
        this.pot -= amount;
        view.setPot(this.pot);
    },
};

export { betting };
