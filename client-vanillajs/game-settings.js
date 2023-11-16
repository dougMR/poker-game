import { game } from "./game.js";

// game-selection pulldown

const gameForm = document.getElementById("game-settings");
console.log("game-form:", gameForm);
gameForm.addEventListener("submit", (event) => {
    console.log("Submit Game Form");
    event.preventDefault();
    const gameType = gameForm.querySelector("#game-select").value;
    game.startGame(gameType);
});
