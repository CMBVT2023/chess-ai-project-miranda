import { Chess } from "./node_modules/chess.js/dist/esm/chess.js"

function randomMove() {
    let possibleMoves = newGame.moves();

    if (newGame.isGameOver()) {
        if (newGame.isCheckmate()) {
            console.log(newGame.turn() + " is the loser.")
        } else if (newGame.isStalemate() || newGame.isDraw()) {
            let reason = newGame.isStalemate() ? 'Stalemate' : 'Draw' 
            console.log("This one is a", reason)
        }
        return
    }

    let randomIdx = Math.floor(Math.random() * possibleMoves.length);
    newGame.move(possibleMoves[randomIdx]);
    mainBoard.position(newGame.fen())

    setTimeout(randomMove, 1);
};

let mainBoard = Chessboard('mainBoard', 'start');
const newGame = new Chess();

setTimeout(randomMove, 1)