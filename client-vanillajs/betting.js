import { clientPlayer, players } from "./main.js";
import { getNextOccupiedSeat, seats } from "./seats.js";
// import { showBetControls } from "./client-only.js";
import { view } from "./view.js";
import { game } from "./game.js";

const betting = {
    currentBet: 0,
    pot: 0,
    firstBettor: null,
    currentBettor: null,
    nextBettor: function () {
        console.log("nextBettor()");
        let bettor;
        if (!this.currentBettor) {
            // first bet of game
            bettor = this.findNextBettor(game.dealer);
            this.activateBettor(bettor);
            this.firstBettor = this.currentBettor;
        } else {
            bettor = this.findNextBettor(this.currentBettor);
            this.activateBettor(bettor);
            // have we reached the last bettor?
            if (
                this.currentBettor === this.firstBettor &&
                this.checkAllPlayersCalledSame()
            ) {
                this.currentBettor = this.firsitBettor = null;
                // Everyone has bet.  Betting round over
                this.currentBet = 0;
                view.unhilightAllPlayers();
                game.nextPhase();
            }
        }
    },
    findNextBettor: function (player) {
        // console.log("findNextBetttor()", player.name);
        let bettor = getNextOccupiedSeat(player.seat.index).player;
        while (!bettor.inHand) {
            bettor = getNextOccupiedSeat(bettor.seat.index).player;
        }
        return bettor;
    },
    activateBettor: function (who) {
        console.log("activateBettor()",who.name);
        this.currentBettor = who;
        // console.log("this.currentBettor:", this.currentBettor);
        // enable bettor's controls
        view.hideBetControls();
        for (const player of players) {
            if (player === this.currentBettor) {
                // enable betting controls
                view.hilightPlayer(player);
                if (player === clientPlayer) {
                    view.showBetControls();
                    // view.showElement(bettingControls);
                }
            } else {
                view.unhilightPlayer(player);
            }
        }
    },
    bet: function (amount) {
        const minBet = this.getMinBet();
        if(minBet>this.currentBettor.amountBetThisRound+amount){
            alert("You must bet at least $"+minBet+", or Fold")
        }else{
            betting.raise(amount);
            betting.nextBettor();
        }
        
    },
    raise: function (amount) {
        // console.log('raise()');
        // console.log('currentBet:',typeof this.currentBet);
        // console.log('pot:',typeof this.pot);
        
        this.currentBettor.amountBetThisRound += amount;
        this.currentBettor.stack -= amount;
        this.currentBet += amount-this.currentBet;
        this.pot += amount;
        view.setPot(betting.pot);
    },
    check: function (amount) {
        betting.nextBettor();
    },
    getMinBet: function (){
        return Math.max(0, this.currentBet - this.currentBettor.amountBetThisRound);
      },
    call: function () {
        console.log('betting.call():',this.currentBettor.name);
        const minBet = this.getMinBet();
        console.log('minBet:',minBet);
        if (minBet > 0 && confirm("Call $"+minBet+"?")) {
            console.log('calling...');
            this.bet(minBet);
        }else {
            // checking
            this.check();
        }
    },
    resetBet: function () {
        console.log("resetBet()");
        for(const p of players){
            p.amountBetThisRound = 0;
            console.log(p.name,'amountBetThisRound:',p.amountBetThisRound);
        }
        this.currentBet = 0;
        view.setBet(0);
    },
    fold: function (player) {
        console.log("fold():", player.name);
        player.inHand = false;
        view.foldHand(player.hand);
    },
    checkAllPlayersCalledSame: function () {
        for (const p of players) {
            if (p.inHand && p.amountBetThisRound < this.currentBet) {
                return false;
            }
        }
        return true;
    },
};

export { betting };