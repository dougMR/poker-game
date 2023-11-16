const assignSeats = (players, clientPlayerIndex) => {
    console.log('assignSeats()');
    // Assign the seat elemenmts relative to clientPlayer
    for (let p = 0; p < players.length; p++) {
        const seatIndex = (numSeats + (p - clientPlayerIndex)) % numSeats;
        players[p].seat.element = seatElements[seatIndex];
    }
};

const clearSeats = () => {
    for(const se of seatElements){
        se.innerHTML = '';
    }
}
// Client-side seat stuff
const numSeats = 8;
const seatElements = [];
const clientSeatEl = document.querySelector(".client-player.seat");
const opponentSeatEls = document.querySelectorAll(".opponent-player.seat");

// starting from seat left of clientPlayer (bottom), up around the horn
const opponentSeatElementIndices = [5, 3, 0, 1, 2, 4, 6];

// Set seatElement indices to match seats indices
// with [0] being clientPlayer's seat
seatElements[0] = clientSeatEl;
// Assign seatElements' indices based on clientPlayer's seat index
for (let seatCount = 1; seatCount < numSeats; seatCount++) {
    const nextSeatIndex = seatCount % numSeats;
    const opponentSeatIndex = opponentSeatElementIndices[seatCount - 1];
    seatElements[nextSeatIndex] = opponentSeatEls[opponentSeatIndex];
}
/*
seatElements[0] = clientSeatEl;
for (let seatCount = 1; seatCount < seats.length; seatCount++) {
    const nextSeatIndex = (seatCount) % seats.length;
    const opponentSeatIndex = opponentSeatElementIndices[seatCount - 1];
    seatElements[nextSeatIndex] = opponentSeatEls[opponentSeatIndex];
}
*/

export { assignSeats, clearSeats };
