import { game } from "./game.js";

const gameForm = document.getElementById("game-settings");
console.log("game-form:", gameForm);
gameForm.addEventListener("submit", (event) => {
    console.log("Submit Game Form");
    event.preventDefault();
    // console.log('selector:',gameForm.querySelector('#game-select').value);
    const gameType = gameForm.querySelector("#game-select").value;
    game.startGame(gameType);
});
