

# Chess Game

This is a real-time online chess game built with Node.js and Socket.IO.

Live demo : https://realtime-multiplayer-chess-game.onrender.com/
## Features

- Real-time multiplayer gameplay
- Move validation
- Promotion handling

## How It Works

The server listens for "move" events from the clients (players). When a move event is received, it validates the move based on the current state of the chess game. If the move is valid, it updates the game state and emits a "move" event to all clients, along with the updated board state. If the move is invalid, it emits an "invalidMove" event back to the client that attempted the move.

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `node app.js` to start the server

The server will be running at `http://localhost:3000`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

