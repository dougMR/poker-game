import serverURL from "./server-url.js";


let connected = false;
const setConnected = (value) => {
    connected = value;
};
let seats = [];
const setSeats = (value) => {
    seats = value;
    // Update View
};
let players = [];
const setPlayers = (value) => {
    players = value;
    // Update View
};


//////////////////////////////////
//    v SOCKET LISTENERS
//////////////////////////////////

const connect = () => {
    // socket = io.connect("http://localhost:3011");
    // socket = io.connect("http://localhost:3000");
    socket = io.connect(serverURL);
    socket.on("connect", () => {
        console.log("socket connected --> ID::", socket.id);
        setConnected(true);
    });

    socket.on("updateSeats", (backendSeats) => {
        // console.log("updatePlayer", id, backendPlayer);
        setSeats(backendSeats);
    });
    socket.on("updatePlayers", (backendPlayers) => {
        setPlayers(backendPlayers);
    });











    // Receive a message from the server
    // socket.on("message", (message, ack) => {
    socket.on("message", (message) => {
        console.log("message from server: ", message); // "Hello from the server!"
        // ack(); // Send an acknowledgment to the server
    });

    socket.on("setJoined", (value, callback) => {
        console.log("server says joined is ", value);
        setJoined(value);
        callback("hello from front end");
    });

    socket.on("endGame", (winnerId) => {
        console.log("endGame");
        console.log("winnerId vs socket.id", winnerId, socket.id);
        if (winnerId === socket.id) {
            // I WON!
            showImage(winImg);
            setAlive(true);
        } else {
            // I LOST.
            // showImage(crossBones);
            // showImage(loseImg);
            // setAlive(false);
        }
        setReady(false); // <-- this needs to come from server

        endGame(winnerId);
    });

    socket.on("startGame", () => {
        startGame();
    });

    socket.on("playShoot", () => {
        playSound(fireShot);
    });

    socket.on("playHit", () => {
        playSound(hit);
    });

    socket.on("updatePlayer", (id, backendPlayer) => {
        // console.log("updatePlayer", id, backendPlayer);
        const playerz = { ...playersRef.current };

        // console.log("playerz:", playerz);
        playerz[id] = { ...backendPlayer };

        // console.log("playerz", playerz);
        setPlayers({ ...playerz });
    });

    socket.on("updatePlayers", (backendPlayers) => {
        console.log("updatePlayers() ");
        if (backendPlayers.length !== 0) {
            const playerz = { ...playersRef.current };
            for (const id in backendPlayers) {
                // if (!playerz[id]) {
                playerz[id] = { ...backendPlayers[id] };
                // }
            }
            for (const id in playerz) {
                if (!backendPlayers[id]) {
                    delete playerz[id];
                }
            }
            console.log(
                "playerz[socket.id].isAlive:",
                playerz[socket.id].isAlive
            );
            console.log("alive:", aliveRef.current);
            if (!playerz[socket.id].isAlive && aliveRef.current) die();

            // console.log("playerz", playerz);
            setPlayers({ ...playerz });
        }
        // Am I still in the game?
        // if (getMyPlayer() && playersRef.current[socket.id].hp <= 0) {
        //     // I'm Out!
        //     die();
        // }
    });
    socket.on("updateBullets", (backendBullets) => {
        setBullets(backendBullets);
    });
    socket.on("setObstacles", (obstacles) => {
        // obstacles are axis-aligned rects, {t,r,b,l}
        setObstacles(obstacles);
    });
};

//////////////////////////////////
//    v SOCKET EMITTERS
//////////////////////////////////

socket.emit("player_ready", true, (response) => {
    console.log("player_ready response", response);
    setReady(response);
});

socket.emit("player_ready", true, (response) => {
    console.log("player_ready response", response);
    setReady(response);
});

export {connect};