// import { clientPlayer, players } from "./main.js";
import { players } from "./config.js";
import { getNextOccupiedSeat, seats } from "./seats.js";
// import { view } from "./view.js";
import { game } from "./game.js";
import { emitBetting, emitPlayers } from "./server.js";

// TURNS (within a game Phase) Rounds?
const betting = {
    currentBet: 0,
    currentBettor: null,
    pot: 0,
    inAnteRound: false,
    clearStates: function () {
        console.log("betting.clearStates()");
        if (this.inAnteRound) this.endAnte();
        this.currentBet = 0;
        this.currentBettor = null;
        this.resetBet();
    },
    nextBettor: function () {
        // End current bettor's turn
        console.log(" betting.nextBettor(), after", this.currentBettor?.name);
        console.log(players.map((p) => p.name + " hasPlayed?: " + p.hasPlayed));
        console.log("(game phase - ", game.currentPhase.type);
        let bettor;
        if (!this.currentBettor) {
            console.log("no currentBettor");
            // first bettor of game
            bettor = this.findNextBettor(game.dealer);
            this.clearHasPlayed();
            this.activateBettor(bettor);
        } else {
            if (
                game
                    .getPlayersInHand()
                    .findIndex((p) => p.hasPlayed === false) === -1 &&
                this.checkPlayersBetsEven()
            ) {
                // Everyone has had a turn and everyone's even
                // Betting round over
                this.endBettingPhase();
                return;
            } else {
                // Next Bettor
                bettor = this.findNextBettor(this.currentBettor);
                this.activateBettor(bettor);
            }
        }
        this.currentBettor.hasPlayed = true;
        console.log(
            "(end of nextBettor) this.currentBettor: ",
            this.currentBettor?.name
        );
        console.log("--end betting.nextBettor()");
        if (this.currentBettor) emitBetting();
        emitPlayers();
    },
    findNextBettor: function (player) {
        // return the next bettor
        // null if everyone has played
        console.log("betting.findNextBetttor() after", player.name);
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
        console.log("betting.activateBettor()", who.name);
        this.currentBettor = who;
        for (const p of players) {
            p.isActivePlayer = p.id === this.currentBettor.id;
        }
        // enable bettor's controls
        // view.hideBetControls();
        // for (const player of players) {
        //     if (player === this.currentBettor) {
        //         // view.hilightPlayer(player);
        //         // if (player === clientPlayer) {
        //             // all players will be clientPlayers once server is implemented
        //             // enable betting controls - only for active client
        //             // view.showBetControls();
        //         // }
        //     } else {
        //         // view.unhilightPlayer(player);
        //     }
        // }
        // emitBetting();
    },
    clearActivePlayer: function () {
        for (const p of players) {
            p.isActivePlayer = false;
        }
    },
    clearHasPlayed: function () {
        for (const p of players) {
            p.hasPlayed = false;
        }
    },
    startAnte: function (amount) {
        // start ante round
        console.log("betting.startAnte()", amount);
        this.inAnteRound = true;
        if (typeof amount != "number") {
            console.error("betting.startAnte() requires an amount.");
        }
        this.currentBet = amount;
        this.nextBettor();
    },
    endAnte: function () {
        console.log("betting.endAnte()");
        this.inAnteRound = false;
    },
    bet: function (amount) {
        console.log("betting.bet()", this.currentBettor?.name);
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
        console.log("betting.raise()", this.currentBettor?.name);
        // Carry out the bet
        this.currentBettor.amountBetThisRound += amount;
        this.currentBettor.stack -= amount;
        this.currentBet += amount - this.currentBet;
        this.pot += amount;
        // view.setPot(betting.pot);
    },
    check: function (amount) {
        console.log("betting.check()", this.currentBettor?.name);
        betting.nextBettor();
    },
    getMinBet: function () {
        // Return minimum amount to call
        console.log("betting.getMinBet()", this.currentBettor?.name);
        return Math.max(
            0,
            this.currentBet - this.currentBettor?.amountBetThisRound
        );
    },
    call: function () {
        console.log("betting.call():", this.currentBettor.name);
        const minBet = this.getMinBet();
        console.log("minBet:", minBet);
        if (minBet > 0) {
            // How do we handle this from backend?
            // if (confirm("Call $" + minBet + "?")) {
            //     console.log("calling...");
            //     this.bet(minBet);
            // }
            console.error("Can't call. Minimum bet is " + minBet);
        } else {
            // Nothing to call
            // checking
            this.check();
        }
    },
    resetBet: function () {
        console.log("betting.resetBet()");
        // Set bet to zero, for betting and all players
        for (const p of players) {
            p.amountBetThisRound = 0;
        }
        this.currentBet = 0;
        // view.setBet(0);
    },
    fold: function () {
        //
        console.log("betting.fold():", this.currentBettor.name);
        this.currentBettor.inHand = false;
        // view.foldHand(this.currentBettor);
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
        console.log("betting.checkPlayersBetsEven()");
        // Is everyone settled up?
        console.log("...betting.currentBet: ", this.currentBet);
        for (const p of players) {
            console.log("...p.name in for:", p.amountBetThisRound);
            if (p.inHand && p.amountBetThisRound < this.currentBet) {
                return false;
            }
        }
        return true;
    },
    endBettingPhase: function () {
        console.log("betting.endBettingPhase()");
        // if (this.inAnteRound) this.endAnte();
        // this.currentBet = 0;
        // view.unhilightAllPlayers();
        this.clearStates();
        game.nextPhase();
    },
    payFromPot: function (player, amount) {
        console.log("betting.payFromPot()", player.name, amount);
        // give pot to player
        player.stack += amount;
        this.pot -= amount;
        // view.setPot(this.pot);
    },
};

export { betting };
