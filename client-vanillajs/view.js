import { betting } from "./betting.js";
import { Card } from "./class-card.js";
import { clientPlayer,  players } from "./main.js";
import { game } from "./game.js";

// This lives on the Client side
// All visuals, and all listeners

const betControls = document.getElementById("bet-controls");
const checkCallButton = betControls.querySelector(".check-call");
const raiseButton = betControls.querySelector(".raise");
const raiseControls = betControls.querySelector(".raise-controls");

const foldButton = betControls.querySelector(".fold");
const potElement = document.querySelector(".pot-area .num");
const betSpan = betControls.querySelector(".raise-controls .bet-amount");

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
        for(const player of players){
            this.unhilightPlayer(player);
        }
    },
    hilightCard: function (card){
        // console.log('hilightCard():',card);
        card.element.classList.add('hilight');
    },
    unhilightCard: function(card){
        card.element.classList.remove('hilight');
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
        console.log("setBetControls() current bet:",betting.currentBet)
        checkCallButton.innerHTML = betting.currentBet > 0 ? "CALL" : "CHECK";
        raiseButton.innerHTML = betting.currentBet > 0 ? "RAISE" : "BET";
    },
    buildCardEl: function (cardString, card) {
        // console.log('buildCardEl')
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
            card._markedToTrade = !card._markedToTrade;
            event.currentTarget.classList.toggle("dimmed");
        });
        return cardEl;
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
    buildHandDisplay: function (seat) {
        const containerEl = seat.element;
        containerEl.innerHTML = `<div class="hand-holder"><div class="top-info"><h3 class="player-name"></h3><p class="hand-name"></p></div><div class="cards"></div><div class="stack">$100</div></div>`;
        return containerEl.querySelector(".hand-holder");
    },
    foldHand: function ( hand){
        for(const card of hand.cards){
            if(!card.facing==="down"){
                setCardFacing(card,"hole");
            }
        }
        hand.element.classList.add('folded');
    },
    showHandName: function(hand){
        hand.element.querySelector('.hand-name').innerHTML = hand.handName;
    },
    setStack: function (player, amount) {
        console.log("view.setStack()", player.name, amount);
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
    setCardFacing: function (card, facing) {
        // default show card to everyone?
        if (facing === "up") {
            // show card to everyone
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
    positionDealerButton: function () {
        const dealerSeatEl = game.dealer.seat.element;
        const x = dealerSeatEl.offsetLeft + dealerSeatEl.offsetWidth;
        const y = dealerSeatEl.offsetTop + dealerSeatEl.offsetHeight * 0.5;
        dealerButtonElement.style.left = x + "px";
        dealerButtonElement.style.top = y + "px";
        console.log("postionDealerButton()", x, y);
    },
};

export { view };
