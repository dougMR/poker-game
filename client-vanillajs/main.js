import "./socket.io/socket.io.js";
import serverURL from "./server-url.js";
// import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

// import { players, clientPlayer, setClientPlayer } from "./players.js";
import { showPrompt } from "./prompt.js";
import { assignSeats, clearSeats } from "./seats.js";
import { view } from "./view.js";
import "./dev-tools.js";
import "./client-only.js";



//////////////////////////
// Name Prompt Stuff
//////////////////////////
const showNamePrompt = () => {
    const nameEntered = showPrompt("Please enter your player name", handleNameEntered, true);
    console.log('nameEntered: ',nameEntered);
};

const handleNameEntered = (pName) => {
    console.log('handleNameENtered()',pName);
    // Join the Game
    // const pName = promptDialog.querySelector("input").value;
    if (pName && pName.length < 20) {
        connectToServer();
        joinGame(pName);
    }
};

//////////////////////////
// Players Stuff
//////////////////////////
/*
    {
        name:this.name,
        id:this.id,
        stack: this.stack,
        inHand: this.inHand,
        hand: {
                [
                    {
                        string: this.string,
                        isWild: this.isWild,
                        markedToTrade: this.markedToTrade,
                        facing: this.facing,
                    },
                ]
            },
        seatIndex: this.seat.index
    }
*/

const setPlayers = (value) => {
    players = value;
};

const updatePlayers = (backendPlayers) => {
    console.log("updatePlayers()");
    // update clientPlayer
    const clientPlayerIndex = backendPlayers.findIndex(
        (p) => p.id === socket.id
    );
    // update seat elements
    clearSeats();
    assignSeats(backendPlayers, clientPlayerIndex);
    // Update View
    for (const p of backendPlayers) {
        // p.hand.player = p;
        // hand views
        p.hand.element = view.buildHandDisplay(p);
        view.hideHandWon(p);
        // view.hideHandName(p);
        // view.showHandName(p);
        // player views
        view.setStack(p);
        view.inHand(p);
        view.setPlayerName(p);
        view.setStack(p);
        // card views
        // add card elements
        for (const c of p.hand.cards) {
            // c.hand = p.hand;
            c.element = view.buildCardEl(c);
            view.setCardFacing(c);
            view.showWild(c);
            // view.dimCard(c);
            // view.hilightCard(c);
        }
        if (p.isWinner) {
            view.hilightBestHand(p);
        }
        view.refreshCards(p);
        // console.log("player...", p);
        // seats[p.seat.index].player = p;
        if (p.hand.showingHandName) {
            view.showHandName(p);
        } 
        // console.log("IS ACTIVE PLAYER? ", p.name, p.isActivePlayer);
        if (p.isActivePlayer) {
            view.showActivePlayer(p);
        }
    }
    setPlayers(backendPlayers);
    clientPlayer = players[clientPlayerIndex];
    // showWinners();
};

//////////////////////////
// Game Stuff
//////////////////////////

const updateGame = (backendGame) => {
    game = backendGame;
    console.log("updateGame:");
    console.log("game:", backendGame);
    game.dealer = null;
    if (game.dealerId) {
        // set dealer
        game.dealer = players.find((p) => p.id === game.dealerId);
        view.positionDealerButton();
    }
    /*
    {
        type: game.type,
        phaseIndex: game.phaseIndex,
        currentPhase: game.currentPhase,
        dealerId: players.indexOf((p) => p.id === game.dealer.id),
        // isDrawPhase:boolean,
        winnerIds: game.winningPlayers.map((p) => p.id),
    }
    */
    console.log("(updateGame) game.currentPhase.type:", game.currentPhase.type);
    console.log(
        "betting.currentBettor.id:",
        betting?.currentBettor?.id,
        "vs",
        "socket.id",
        socket.id
    );

    if (
        game.currentPhase.type !== "showdown" &&
        betting?.currentBettor?.id === socket.id
    ) {
        // I am active player
        view.showBetControls();
    } else {
        view.hideBetControls();
    }
};

// const showWinners = () => {
//     const winners = players.filter((p) => p.isWinner);
//     for (const player of winners) {
//         console.log("hilight", player.name);
//         view.hilightBestHand(player);
//     }
// };

////////////////////////
// Card Stuff
////////////////////////

const emitCard = (playerId, card) => {
    console.log("emitCard()", card);
    // const cardIndex = clientPlayer.hand.cards.findIndex((c) => c.name === card.name);
    socket.emit("update_card", playerId, card);
};

////////////////////////
// Betting Stuff
////////////////////////
const updateBetting = (backendBetting) => {
    console.log("updateBetting:");
    /*
    {
        pot:betting.pot,
        currentBettor: betting.currentBettor.clientVersion,
        inAnteRound: betting.inAnteRound,
    }
    */
    betting = backendBetting;
    view.setPot(backendBetting.pot);
    // console.log("currentBettor.id", backendBetting.currentBettor.id);
    // console.log("socket.id", socket.id);
    // console.log(
    //     "backendBetting.currentBettor.id === socket.id",
    //     backendBetting.currentBettor.id === socket.id
    // );
    console.log(
        "I'm currentBettor:",
        backendBetting.currentBettor?.id === socket.id
    );
    // console.log(
    //     "backendBetting.currentBettor.id",
    //     "socket.id",
    //     backendBetting.currentBettor.id,
    //     socket.id
    // );
    // console.log('(updateBetting) game:',game);
    // console.log(
    //     "(updateBetting) game.currentPhase.type:",
    //     game.currentPhase.type
    // );
    console.log(
        "betting.currentBettor.id:",
        betting.currentBettor?.id,
        "vs",
        "socket.id",
        socket.id
    );
    if (
        game?.currentPhase?.type !== "showdown" &&
        betting.currentBettor?.id === socket.id
    ) {
        // I am active player
        view.showBetControls();
    } else {
        view.hideBetControls();
    }
};

const bet = (action, amount) => {
    console.log("bet()", action.toUpperCase());
    // call, check, bet(amount),raise(amount),fold(), draw
    amount = amount || 0;
    socket.emit("bettor_action", action, amount);
};

// view.positionDealerButton();
// view.output(game.type + "<br />Phase: " + currentPhase.type.toUpperCase());

// view.hilightPlayer(clientPlayer);

////////////////////////
// Socket Stuff
////////////////////////

const joinGame = (playerName) => {
    // const playerName = prompt("Create a player name.");
    console.log("joinGame()", playerName);
    if (playerName) {
        // Add this Client To Game
        socket.emit("join_game", playerName, (serverResponse) => {
            console.log("server response:", serverResponse);
            if (serverResponse.error) {
                // Show Name Prompt
                alert(serverResponse.error);
                showNamePrompt();
            } else {
                // Turned off for testing
                // alert(serverResponse.success);
            }
        });
    }
};

const connectToServer = () => {
    socket = io(serverURL);

    socket.on("connect", () => {
        console.log("socket connected --> ID::", socket.id);

        // showNamePrompt();
        socket.on("disconnect", (data) => {
            console.log("DISCONNECTED.");
            console.log("BECAUSE:", data);
            // Reset Game Interface
            // clearSeats();
            resetGameStates();
            updatePlayers(players);
            view.hideBetControls();
            // view.removeSeats();
        });

        socket.on("updatePlayers", (serverPlayers) => {
            console.log("updatePlayers:", serverPlayers);
            updatePlayers(serverPlayers);
        });

        socket.on("updateGame", (serverGame) => {
            updateGame(serverGame);
        });

        socket.on("updateBetting", (serverBetting) => {
            updateBetting(serverBetting);
        });

        socket.on("output", (message, add) => {
            // console.log("output", message);
            view.output(message, add);
        });

        socket.on("endHand", () => {
            console.log("\n\nendHand");
            view.hideBetControls();
            // autoPlayOn = false;
        });
    });
};

const startGame = () => {
    console.log("call start_game", "5 Card Draw");
    // autoPlayOn = true;
    socket.emit("start_game", "5 Card Draw");
};

const resetGameStates = () => {
    console.log("resetGameStates()");
    // winnerIds = [];
    players = [];
    game = null;
    betting = null;
    clientPlayer = null;
};

// let winnerIds = [];
let autoPlayOn = false;
let socket = null;
let players = [];
let game = null;
let betting = null;
let clientPlayer = null;

// const namePrompt = document.getElementById("name-prompt");
// namePrompt
//     .querySelector("button")
//     .addEventListener("pointerdown", handleNameEntered);

// 
// Point of Entry
// 

view.hideBetControls();
showNamePrompt();


export {
    clientPlayer,
    players,
    startGame,
    game,
    betting,
    bet,
    emitCard,
    showNamePrompt,
    autoPlayOn,
};
