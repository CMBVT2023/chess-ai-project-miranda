import { Chess } from "../node_modules/chess.js/dist/esm/chess.js"
import { checkGame } from "./GameOver.js";
import { evaluateBoard } from "./Evaluation.js";

export function computerVsComputer(playSpeed) {
    let currentBoard = Chessboard('mainBoard', 'start');
    let currentGame = new Chess();
    let speed = playSpeed;

    function makeRandomMove() {
        let possibleMoves = currentGame.moves({verbose: true});
        
        if (possibleMoves.length == 0) {
            return;
        }
        
        let bestMove;
        let highestScore = 0;

        for (const movement of possibleMoves) {
            let currentScore = evaluateBoard(movement, highestScore, movement.color)
            if (currentScore > highestScore || bestMove == undefined) {
                highestScore = currentScore;
                bestMove = movement;
            }
        }


        
        currentGame.move(bestMove);
        currentBoard.position(currentGame.fen())
        if (checkGame(currentGame)) {
            console.log(checkGame(currentGame));
            return;
        }
        setTimeout(makeRandomMove, speed);
    }

    makeRandomMove();
};
