import { clientPlayer, betting, bet, game } from "./main.js";
// import { betting, bet } from "./betting.js";
import { view } from "./view.js";
// import { game } from "./game.js";

// This and dev-tools.js and view.js are all client-side code

const betControls = document.querySelector("#bet-controls");
const betButton = betControls.querySelector("button.bet");
const betSpan = betControls.querySelector(".raise-controls .bet-amount");
const checkCallButton = betControls.querySelector(".check-call");
const raiseButton = betControls.querySelector(".raise");
const raiseControls = betControls.querySelector(".raise-controls");
// clientPlayer.hand.element
const foldButton = betControls.querySelector(".fold");
const tradeButton = betControls.querySelector(".trade");

betButton.addEventListener("pointerdown", (event) => {
    // Submit Bet
    bet("bet", Number(betSpan.innerHTML));
});

const addToBet = (amount) => {
    console.log("addToBet:", amount);
    const currentBet = Number(betSpan.innerHTML);
    const total = currentBet + amount;
    if (clientPlayer.stack >= total && total >= 0) {
        view.setBet(currentBet + amount);
    }
};

raiseControls.addEventListener("pointerdown", (event) => {
    const betIncrement = 5;
    const currentBet = Number(betSpan.innerHTML);
    if (
        event.target.classList.contains("up") &&
        clientPlayer.stack >= betIncrement
    ) {
        // raise Bet
        addToBet(betIncrement);
    } else if (
        event.target.classList.contains("down") &&
        currentBet >= betIncrement
    ) {
        // reduce Bet
        addToBet(-betIncrement);
    }
});

// Check, Call, Raise, Fold
checkCallButton.addEventListener("pointerdown", (event) => {
    console.log("check-call button pressed");
    // check or call?
    const label = event.currentTarget.innerHTML;
    if (label === "CALL") {
        // betting.call();
        if (confirm("Call $" + betting.minBet + "?")) {
            console.log("calling...");
            bet("bet", betting.minBet);
        }
        // bet("call");
    } else if (label === "CHECK") {
        // betting.check();
        bet("check");
    }
});
raiseButton.addEventListener("pointerdown", (event) => {
    // are we in bettnig phase?
    // Set the bet
    view.showElement(raiseControls);
    // set starting amount
    addToBet(betting.currentBet - clientPlayer.amountBetThisRound);
});

foldButton.addEventListener("pointerdown", (event) => {
    // Fold
    // betting.fold();
    bet("fold");
});

tradeButton.addEventListener("pointerdown", (event) => {
    switch (game.currentPhase.type) {
        case "draw":
            // clientPlayer.hand.tradeCards();
            // game.nextPhase();
            // betting.nextBettor();
            bet("draw");
            break;
        case "discard":
            clientPlayer.hand.discardCards();
            break;
    }
});
