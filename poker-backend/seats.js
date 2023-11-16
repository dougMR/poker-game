// Server-side seats stuff

console.log("hello from seats.js");

const numSeats = 8; // <-- !! set up means for this to dynamically agree with front end?
const seats = [];

for (let index = 0; index < numSeats; index++) {
    seats[index] = {
        player: null,
        index: index,
    };
}

// setSeats(seats);

const clearSeat = (playerId) => {
    console.log('seats.clearSeat()',playerId);
    const seat = seats.find((s) => s.player?.id === playerId);
    if(seat)seat.player = null;
};

const getNextOccupiedSeat = (startIndex) => {
    console.log('(seats)getNextOccupiedSeat()','after',seats[startIndex].player.name)
    let nextSeatIndex = (startIndex + 1) % seats.length;
    while (seats[nextSeatIndex].player === null) {
        // unoccupied, find another
        nextSeatIndex = (nextSeatIndex + 1) % seats.length;
        if (nextSeatIndex === startIndex) {
            // No occupied seat
            // console.error('seats: no Occupied Seat')
            return null;
        }
    }
    // console.log('found Occupied seat: ',nextSeatIndex);
    return seats[nextSeatIndex];
};
const getAvailableSeat = () => {
    console.log("getAvailableSeat()", seats.map(s=>[s.index,s.player?.name]));
    // Check for an empty seat
    for (let seatIndex = 0; seatIndex < seats.length; seatIndex++) {
        if (seats[seatIndex].player === null) {
            console.log("seat: ", seats[seatIndex]);
            return seats[seatIndex];
        }
    }
    // No Empty Seats
    // console.log("no empty seats:");
    return null;
};
const assignSeat = (index, player) => {
    // doesn't care if someone is already there
    const seat = seats[index];
    seat.player = player;
    seat.isClient = false;
    return seats[index];
};
const assignNextSeat = (player) => {
    console.log("assignNextSeat()");
    const seat = getAvailableSeat();
    if (!seat) {
        console.error("No Available Seat for " + player.name);
        return null;
    }
    try {
        seat.player = player;
        console.log("seat.player.name:", seat.player.name);
    } catch (error) {
        console.error("Error assigning seat: ", error);
        // alert("error assigning seat: " + error);
    }
    return seat;
};

const leaveSeat = (player) => {
    seats.find((s) => s.player === player).player = null;
};
export { assignNextSeat, seats, getNextOccupiedSeat, clearSeat };
