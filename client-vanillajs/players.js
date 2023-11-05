const players = [];
const addPlayer = (name, isClient) => {
    if (
        !players.some(
            (player) => player.name.toLowerCase() === name.toLowerCase()
        )
    ) {
        const newPlayer = new Player(name);
        // console.log('newPlayer:',newPlayer);
        if (isClient) {
            newPlayer.seat = assignClientSeat(newPlayer);
        } else {
            newPlayer.seat = assignNextSeat(newPlayer);
        }
        newPlayer.hand = new Hand(newPlayer, deck);
        players.push(newPlayer);
        return newPlayer;
    }
    return null;
};

export { addPlayer, players };
