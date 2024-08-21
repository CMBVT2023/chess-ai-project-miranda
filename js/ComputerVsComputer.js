import { Chess } from "../node_modules/chess.js/dist/esm/chess.js"

export function computerVsComputer(playSpeed) {
    let currentBoard = Chessboard('mainBoard', 'start');
    let currentGame = new Chess();
    let speed = playSpeed;

    function makeRandomMove() {
        let possibleMoves = currentGame.moves();
    
        if (currentGame.isGameOver()) {
            if (currentGame.isCheckmate()) {
                console.log(currentGame.turn() + " is the loser.")
            } else if (currentGame.isStalemate() || currentGame.isDraw()) {
                let reason = currentGame.isStalemate() ? 'Stalemate' : 'Draw' 
                console.log("This one is a", reason)
            }
            return
        }
    
        let randomIdx = Math.floor(Math.random() * possibleMoves.length);
        currentGame.move(possibleMoves[randomIdx]);
        currentBoard.position(currentGame.fen())
    
        setTimeout(makeRandomMove, speed);
    }

    makeRandomMove();
};
