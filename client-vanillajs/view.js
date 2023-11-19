// import { betting } from "./betting.js";
import { clientPlayer, players, game, betting, emitCard, autoPlayOn } from "./main.js";

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

const triggerButton = (button) => {
    button.dispatchEvent(new PointerEvent('pointerdown'))
}

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
        // console.log("buildCardEl():", card);
        const cardString = card.name;
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
        // add listener here? Or somewhere else?  Like in updateGame()?
        cardEl.addEventListener("pointerdown", (event) => {
            if (game.isDrawPhase) {
                const playerCards = players.find((p) => p.id === card.playerId)
                    .hand.cards;
                const canTradeMore =
                    playerCards.filter((c) => c.markedToTrade).length <
                    game.currentPhase.tradeLimit;
                if (
                    card.markedToTrade ||
                    (canTradeMore && !card.markedToTrade)
                ) {
                    card.markedToTrade = !card.markedToTrade;
                    event.currentTarget.classList.toggle("selected");
                }
                // Show Draw Button?
                if(playerCards.some(c=>c.markedToTrade)){
                    tradeButton.textContent = "DRAW";
                } else {
                    tradeButton.textContent = "STICK";
                }
                emitCard(clientPlayer.id, card);
            } else if (game.isTurnCardPhase) {
                // turn the card up
                card.facing = "up";
                emitCard(clientPlayer.id, card);
            }
        });
        return cardEl;
    },
    setPlayerName: function (player) {
        player.hand.element.querySelector(".player-name").innerHTML =
            player.name;
    },
    showWild: function (card) {
        // console.log('showWild():',card.isWild);
        if (card.isWild) {
            card.element.classList.add("wild");
        } else {
            card.element.classList.remove("wild");
        }
    },
    setCardFacing: function (card) {
        console.log("setCardFacing():", card.facing);
        // console.log('card:',card);
        const facing = card.facing;
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
            // console.log("card.hand.player:", card.hand.player.id);
            // console.log("clientPlayer:", clientPlayer.id);
            // console.log(
            //     "card.hand.player === clientPlayer",
            //     card.hand.player === clientPlayer
            // );
            if (card.playerId !== clientPlayer.id) {
                this.hide(card);
            } else {
                card.element.classList.add("hole");
            }
        } else if (facing === "community") {
            // this is beyond card's appearance.  Community cards show in pot area, separate from any players hands.
            // card's hand's player should be community, not a player.  Maybe community *is a Player instance?.  With no seat.
        }
    },
    buildHandDisplay: function (player) {
        const containerEl = player.seat.element;
        containerEl.innerHTML = `<div class="hand-holder">
        <div class="top-info"><h3 class="player-name"></h3><p class="hand-name"></p></div>
        <div class="cards"></div>
        <div class="stack money">$100</div></div>`;
        return containerEl.querySelector(".hand-holder");
    },
    refreshCards: function (player) {
        console.log("view.refreshCards()");
        const cardsHolder = player.hand.element.querySelector(".cards");
        cardsHolder.innerHTML = "";
        let index = 0;
        for (const card of player.hand.cards) {
            cardsHolder.append(card.element);
            index++;
        }
    },
    getCardEls: function (player) {
        return player.hand.element.querySelectorAll(".card");
    },
    inHand: function (player) {
        if (player.inHand) {
            player.hand.element.classList.remove("folded");
            player.seat.element.classList.remove("folded");
        } else {
            // Fold Hand
            for (const card of player.hand.cards) {
                if (!card.facing === "down") {
                    setCardFacing(card, "hole");
                }
            }
            player.hand.element.classList.add("folded");
            player.seat.element.classList.add("folded");
        }
    },
    showHandName: function (player) {
        console.log("hand.name:", player.hand.name);
        console.log(
            "name element:",
            player.hand.element.querySelector(".hand-name")
        );
        player.hand.element.querySelector(".hand-name").innerHTML =
            player.hand.name;
    },
    hideHandName: function (player) {
        player.hand.element.querySelector(".hand-name").innerHTML = "";
    },
    hilightBestHand: function (player) {
        const bestHand = player.hand.bestHand;
        console.log("view.hilightBestHand()");
        let handWilds = bestHand.filter((c) => c[1] === "*").length;
        let cNum = player.hand.cards.length;
        while (cNum--) {
            const c = player.hand.cards[cNum];
            // console.log("c:", c);
            // console.log(
            //     "bestHand.includes(c.name):",
            //     bestHand.includes(c.name)
            // );
            // console.log("c.isWild :", c.isWild);
            // console.log("handWilds > 0", handWilds > 0);
            if (bestHand.includes(c.name) || (c.isWild && handWilds > 0)) {
                // console.log("Hilight", c);
                view.hilightCard(c);
                if (c.isWild) handWilds--;
            }
        }
    },
    hideHandWon: function (player) {
        player.hand.element.classList.remove("won");
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
    dimCard: function (card) {
        card.element.classList.add("dimmed");
    },
    setStack: function (player) {
        // console.log("view.setStack()", player.name, amount);
        player.hand.element.querySelector(
            ".stack"
        ).innerHTML = `$${player.stack}`;
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
        console.log('view.hideBetControls');
        this.hideElement(betControls);
    },
    showBetControls: function () {
        console.log("showBetControls()");
        this.showElement(betControls);
        this.hideElement(raiseControls);
        this.setBetControls();
    },
    setBetControls: function () {
        console.log("setBetControls() current bet:", betting.currentBet);
        console.log("IS AUTOPLAY ON? ",autoPlayOn);
        console.log("game.isDrawPhase:", game.isDrawPhase);
        console.log("game.currentPhase:",game.currentPhase);
        console.log("betting.minBet:",betting.minBet);
        if (game.isDrawPhase) {
            // show trade button
            this.showElement(tradeButton);
            tradeButton.textContent = "Stand Pat";
            this.hideElement(checkCallButton);
            this.hideElement(raiseButton);
            this.hideElement(foldButton);
            if(autoPlayOn){
                triggerButton(tradeButton)
            }
        } else {
            this.hideElement(tradeButton);
            this.showElement(checkCallButton);
            this.showElement(foldButton);
            checkCallButton.innerHTML = betting?.minBet > 0 ? "CALL" : "CHECK";
            if (betting.inAnteRound) {
                this.hideElement(raiseButton);
            } else {
                this.showElement(raiseButton);
                raiseButton.innerHTML =
                    betting.currentBet > 0 ? "RAISE" : "BET";
            }
            if(autoPlayOn){
                triggerButton(checkCallButton)
            }
        }
    },
    positionDealerButton: function () {
        if(!game.dealer)return;
        console.log("positionDealerButton()");
        console.log("dealer:", game.dealer);
        const dealerSeatEl = game.dealer.seat.element;
        console.log("dealerSeatEl:", dealerSeatEl);
        console.log("name El: ", dealerSeatEl.querySelector(".player-name"));
        var offsetBB = dealerSeatEl.getBoundingClientRect();
        // these are relative to the viewport, i.e. the window
        const y = offsetBB.top + window.scrollY - dealerButtonElement.offsetHeight;;
        const x = offsetBB.left + window.scrollX;
        // const x = dealerSeatEl.querySelector(".player-name").offsetLeft + 0; //dealerSeatEl.offsetWidth;
        // const y =
        //     dealerSeatEl.querySelector(".player-name").offsetTop -
        //     dealerButtonElement.offsetHeight; //dealerSeatEl.offsetHeight * 0.5;
        console.log("x:", x);
        console.log("y:", y);
        dealerButtonElement.style.left = x + "px";
        dealerButtonElement.style.top = y + "px";
        // console.log("view:postionDealerButton()", x, y);
    },
    showActivePlayer: function (player) {
        player.hand.element.classList.add("active-player");
    },
};

export { view };
