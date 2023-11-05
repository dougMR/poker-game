import { clientPlayer } from "./main.js";
import { betting } from "./betting.js";
import { view } from "./view.js";

// This and dev-tools.js and view.js are all client-side code

const betControls = document.querySelector("#bet-controls");
const betButton = betControls.querySelector("button.bet");
const betSpan = betControls.querySelector(".raise-controls .bet-amount");
const checkCallButton = betControls.querySelector(".check-call");
const raiseButton = betControls.querySelector(".raise");
const raiseControls = betControls.querySelector(".raise-controls");
// betSpan.style.border = "2px solid red";
// clientPlayer.hand.element
const foldButton = betControls.querySelector(".fold");

betButton.addEventListener("pointerdown", (event) => {
    // Submit Bet
    betting.bet(Number(betSpan.innerHTML));
});

const addToBet = (amount) => {
    console.log("addToBet:", amount);
    const currentBet = Number(betSpan.innerHTML);
    const total = currentBet + amount;
    if (clientPlayer.stack >= total && total >= 0) {
        view.setBet(currentBet + amount);
        // clientPlayer.addToStack(-amount);
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
    // check or call?
    const label = event.currentTarget.innerHTML;
    if (label === "CALL") {
        betting.call();
    } else if (label === "CHECK") {
        betting.check();
    }
});
raiseButton.addEventListener("pointerdown", (event) => {
    // are we in bettnig phase?
    // Set the bet
    view.showElement(raiseControls);
});

foldButton.addEventListener("pointerdown", (event) => {
    // Fold
    betting.fold(clientPlayer);
});

// tradeButton.addEventListener("pointerdown", (event) => {
//     player.hand.tradeCards();
//     player.hand.displayHand();
//     // show appropriate controls
//     tradeButton.style.display = "none";
//     betControls.style.display = "block";
//     showdownButton.style.display = "inline";
//     nextHandButton.style.display = "none";
//     output("Place your bet, then Press SHOWDOWN button to see the winner.");
// });
