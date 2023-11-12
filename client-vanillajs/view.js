import { betting } from "./betting.js";
import { Card } from "./class-card.js";
import { clientPlayer, players } from "./main.js";
import { game } from "./game.js";

// This lives on the Client side
// All visuals, and all listeners
// Maybe make a server-side view{} that sends messages to client-side view{}

const betControls = document.getElementById("bet-controls");
const checkCallButton = betControls.querySelector(".check-call");
const raiseButton = betControls.querySelector(".raise");
const raiseControls = betControls.querySelector(".raise-controls");

const foldButton = betControls.querySelector(".fold");
const betButton = betControls.querySelector(".bet");
const potElement = document.querySelector(".pot-area .num");
const betSpan = betControls.querySelector(".raise-controls .bet-amount");
const tradeButton = betControls.querySelector(".trade");

const dealerButtonElement = document.getElementById("dealer-button");

const getSuitSymbol = (suitLetter) => {
    let symbol = "";
    switch (suitLetter) {
        case "C":
            symbol = "♣️";
            break;
        case "D":
            symbol = "♦️";
            break;
        case "H":
            symbol = "♥️";
            break;
        case "S":
            symbol = "♠️";
            break;
        case "*":
            symbol = ")";
            break;
        default:
            symbol = suitLetter;
    }
    return symbol;
};

const view = {
    hilightPlayer: function (player) {
        console.log("hilightPlayer()");
        // console.log("player.seat.element:", player.seat.element);
        // hilight current player's seat
        player.seat.element.style.border = "2px solid white";
        player.seat.element.style.boxShadow =
            "inset 0 0 calc(var(--card-unit) * 2) calc(var(--card-unit) * -0.5) black";
    },
    unhilightPlayer: function (player) {
        // console.log('view.unhighlightPlayer():',player.name);
        player.seat.element.style.boxShadow = player.seat.element.style.border =
            "none";
    },
    unhilightAllPlayers: function () {
        for (const player of players) {
            this.unhilightPlayer(player);
        }
    },
    hilightCard: function (card) {
        // console.log('hilightCard():',card);
        card.element.classList.add("hilight");
    },
    unhilightCard: function (card) {
        card.element.classList.remove("hilight");
    },
    buildCardEl: function (card) {
        // console.log('buildCardEl():',card.string)
        const cardString = card.string;
        const cardEl = document.createElement("div");
        cardEl.classList.add("card");
        const suit = cardString[1];
        const face =
            cardString[0] === "T"
                ? "10"
                : cardString[0] === "*"
                ? ":"
                : cardString[0];
        cardEl.innerHTML = `<span class="number">${face}</span><span class="suit ${suit}">${getSuitSymbol(
            suit
        )}</span>`;
        // return cardEl;
        cardEl.addEventListener("pointerdown", (event) => {
            if (game.isDrawPhase()) {
                if (
                    card.markedToTrade ||
                    (!card.markedToTrade &&
                        card.hand.cards.filter((c) => c._markedToTrade).length <
                            game.currentPhase.tradeLimit)
                ) {
                    card.markedToTrade = !card.markedToTrade;
                    event.currentTarget.classList.toggle("selected");
                }
            }
        });
        return cardEl;
    },
    showWild: function (card) {
        // console.log('showWild():',card.isWild);
        if (card.isWild) {
            card.element.classList.add("wild");
        } else {
            card.element.classList.remove("wild");
        }
    },
    setCardFacing: function (card, facing) {
        // console.log('setCardFaceing():',facing);
        // console.log('card:',card);
        // default show card to everyone?
        if (facing === "up") {
            // show card to everyone
            this.show(card);
            card.element.classList.remove("hole");
            card.element.classList.remove("down");
        } else if (facing === "down") {
            // hide from group, and client
            this.hide(card);
        } else if (facing === "hole") {
            // hide from group, show to client
            if (card.hand.player !== clientPlayer) {
                this.hide(card);
            } else {
                card.element.classList.add("hole");
            }
        } else if (facing === "community") {
            // this is beyond card's appearance.  Community cards show in pot area, separate from any players hands.
            // card's hand's player should be community, not a player.  Maybe community *is a Player instance?.  With no seat.
        }
    },
    buildHandDisplay: function (seat) {
        const containerEl = seat.element;
        containerEl.innerHTML = `<div class="hand-holder">
        <div class="top-info"><h3 class="player-name"></h3><p class="hand-name"></p></div>
        <div class="cards"></div>
        <div class="stack">$100</div></div>`;
        return containerEl.querySelector(".hand-holder");
    },
    inHand: function (player){
        player.hand.element.classList.remove("folded");
        player.seat.element.classList.remove("folded");
    },
    foldHand: function (player) {
        // console.log('view:foldHand()');
        const hand = player.hand;
        // console.log('cards:',hand.cards);
        for (const card of hand.cards) {
            if (!card.facing === "down") {
                setCardFacing(card, "hole");
            }
        }
        hand.element.classList.add("folded");
        player.seat.element.classList.add("folded");
    },
    showHandName: function (hand) {
        console.log("hand.name:", hand.name);
        hand.element.querySelector(".hand-name").innerHTML = hand.name;
    },
    hideHandName: function (hand) {
        hand.element.querySelector(".hand-name").innerHTML = '';
    },
    hide: function (instance) {
        // console.log("hide() instance.element:", instance.element);
        this.hideElement(instance.element);
    },
    hideElement: function (element) {
        // console.log('hideElement():',element);
        element.classList.add("hidden");
    },
    show: function (instance) {
        this.showElement(instance.element);
    },
    showElement: function (element) {
        element.classList.remove("hidden");
    },
    dimCard: function(card) {
        card.element.classList.add('dimmed');
    },
    setStack: function (player, amount) {
        // console.log("view.setStack()", player.name, amount);
        player.hand.element.querySelector(".stack").innerHTML = `$${amount}`;
    },
    output: function (msg, add) {
        const outputDiv = document.getElementById("output");
        if (add) {
            msg = outputDiv.innerHTML + "<br />" + msg;
        }
        outputDiv.innerHTML = msg;
    },
    setPot: function (amount) {
        potElement.innerHTML = amount;
    },
    setBet: function (amount) {
        betSpan.innerHTML = amount;
    },

    hideBetControls: function () {
        this.hideElement(betControls);
    },
    showBetControls: function () {
        console.log("showBetControls()");
        this.showElement(betControls);
        this.hideElement(raiseControls);
        this.setBetControls();
    },
    setBetControls: function (player) {
        console.log("setBetControls() current bet:", betting.currentBet);
        console.log("game.isDrawPhase():", game.isDrawPhase());
        if (game.isDrawPhase()) {
            // show trade button
            this.showElement(tradeButton);
            this.hideElement(checkCallButton);
            this.hideElement(raiseButton);
            this.hideElement(foldButton);
        } else {
            this.hideElement(tradeButton);
            this.showElement(checkCallButton);
            this.showElement(foldButton);
            checkCallButton.innerHTML =
                betting.currentBet > 0 ? "CALL" : "CHECK";
            if (betting.inAnteRound) {
                this.hideElement(raiseButton);
            } else {
                this.showElement(raiseButton);
                raiseButton.innerHTML =
                    betting.currentBet > 0 ? "RAISE" : "BET";
            }
        }
    },
    positionDealerButton: function () {
        const dealerSeatEl = game.dealer.seat.element;
        const x = dealerSeatEl.offsetLeft + 30; //dealerSeatEl.offsetWidth;
        const y = dealerSeatEl.offsetTop + 5; //dealerSeatEl.offsetHeight * 0.5;
        dealerButtonElement.style.left = x + "px";
        dealerButtonElement.style.top = y + "px";
        // console.log("view:postionDealerButton()", x, y);
    },
};

export { view };
