const seatElements = [];
const playerSeatEl = document.querySelector(".client-player.seat");
const opponentSeatEls = document.querySelectorAll(".opponent-player.seat");
seatElements[0] = playerSeatEl;
for (
    let opponentIndex = 0;
    opponentIndex < opponentSeatEls.length;
    opponentIndex++
) {
    seatElements[opponentIndex + 1] = opponentSeatEls[opponentIndex];
}
const seats = [];
// starts top left
const seatElementsOrder = [0, 6, 4, 1, 2, 3, 5, 7];

let index = 0;
for (const el of seatElements) {
    const elIndex = seatElementsOrder[index];
    seats[index] = {
        element: seatElements[elIndex],
        player: null,
        index: index,
    };
    index++;
}
const getNextOccupiedSeat = (startIndex) => {
    let nextSeatIndex = (startIndex + 1) % seats.length;
    while (seats[nextSeatIndex].player === null) {
        // unoccupied, find another
        nextSeatIndex = (nextSeatIndex + 1) % seats.length;
        if(nextSeatIndex === startIndex){
            // No occupied seat
            console.error('seats: no Occupied Seat')
            return null;
        }
    }
    console.log('found Occupied seat: ',nextSeatIndex);
    return seats[nextSeatIndex];
};
const getAvailableSeat = () => {
    // looking for empty opponent seat
    const indexArray1 = [3, 5, 1, 7];
    const indexArray2 = [4, 2, 6];
    // Check Corner seats
    for (let indexIndex = 0; indexIndex < indexArray1.length; indexIndex++) {
        const seatIndex = indexArray1[indexIndex];
        if (seats[seatIndex].player === null) {
            return seats[seatIndex];
        }
    }
    // Check Sides Seats
    for (let indexIndex = 0; indexIndex < indexArray2.length; indexIndex++) {
        const seatIndex = indexArray2[indexIndex];
        if (seats[seatIndex].player === null) {
            return seats[seatIndex];
        }
    }
    // No Empty Seats
    console.log("no empty seats:");
    return null;
};
const assignSeat = (index, player) => {
    const seat = seats[index];
    seat.player = player;
    seat.isClient = false;
    return seats[index];
};
const assignNextSeat = (player) => {
    const seat = getAvailableSeat();
    try {
        seat.player = player;
        seat.isClient = false;
    } catch (error) {
        console.error(error);
        alert("error assigning seat: " + error);
    }
    return seat;
};
const assignClientSeat = (player) => {
    const seat = assignSeat(0, player);
    seat.isClient = true;
    return seat;
};
const leaveSeat = (player) => {
    seats.find((s) => s.player === player).player = null;
};
export { assignClientSeat, assignNextSeat, seats, getNextOccupiedSeat };
