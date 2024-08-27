import { Chess } from "../node_modules/chess.js/dist/esm/chess.js"
import { checkGame } from "./GameOver.js";
import { evaluateBoard } from "./Evaluation.js";
import { miniMaxCalculation, resetMoves, movesMade } from "./MiniMax.js";

export function computerVsComputer(playSpeed, npcOne, npcTwo) {
    let currentBoard = Chessboard('mainBoard', 'start');
    let currentGame = new Chess();
    let speed = playSpeed;

    function makeRandomMove() {
        try {
            let possibleMoves = currentGame.moves();
    
            if (possibleMoves.length == 0) {
                return;
            };
    
            let randomIndex = Math.floor(Math.random() * possibleMoves.length);
            let nextMove = possibleMoves[randomIndex];
    
            currentGame.move(nextMove);
            currentBoard.position(currentGame.fen())
            if (checkGame(currentGame)) {
                console.log(checkGame(currentGame));
                return;
            }
    
            if (currentGame.turn() == 'b') {
                setTimeout(npcOneMove, playSpeed);
            } else {
                setTimeout(npcTwoMove, playSpeed);
            }
        }  catch {
            console.log('Game Reset')
        }
    }

    function evaluateMove() {
        try {
            let possibleMoves = currentGame.moves({ verbose: true });
    
            if (possibleMoves.length == 0) {
                return;
            };
    
            let startTime = Date.now();
            let bestScore;
            let bestMove;
    
            for (const move of possibleMoves) {
                let tempScore = evaluateBoard(move, bestScore, currentGame.turn());
                if (tempScore > bestScore || bestMove == undefined) {
                    bestScore = tempScore;
                    bestMove = move;
                }
            }
    
            console.log('Time to calculate best move:', Date.now() - startTime, 'milliseconds.\n',
                        'Number of Moves Checked:', possibleMoves.length);
    
            currentGame.move(bestMove);
            currentBoard.position(currentGame.fen())
            if (checkGame(currentGame)) {
                console.log(checkGame(currentGame));
                return;
            }
    
            if (currentGame.turn() == 'b') {
                setTimeout(npcOneMove, playSpeed);
            } else {
                setTimeout(npcTwoMove, playSpeed);
            }
        } catch {
            console.log('Game Reset')
        }
    }

    function minimaxMove() {
        try {
            let possibleMoves = currentGame.moves({ verbose: true });
    
            if (possibleMoves.length == 0) {
                return;
            };
    
            let startTime = Date.now();
            resetMoves();
    
            let [bestMove, bestValue] = miniMaxCalculation(3, true, currentGame, 0, currentGame.turn());
            
            console.log('Time to calculate best move:', Date.now() - startTime, 'milliseconds.\n',
                    'Amount of Moves Checked: ', movesMade());
    
            currentGame.move(bestMove);
            currentBoard.position(currentGame.fen())
            if (checkGame(currentGame)) {
                console.log(checkGame(currentGame));
                return;
            }
    
            if (currentGame.turn() == 'b') {
                setTimeout(npcOneMove, playSpeed);
            } else {
                setTimeout(npcTwoMove, playSpeed);
            }
        } catch {
            console.log('Game Reset')
        }
    }

    let npcOneMove;
    let npcTwoMove;

    if (npcOne == 0) {
        npcOneMove = makeRandomMove;
    } else if (npcOne == 1) {
        npcOneMove = evaluateMove;
    } else if (npcOne == 2) {
        npcOneMove = minimaxMove;
    }

    if (npcTwo == 0) {
        npcTwoMove = makeRandomMove;
    } else if (npcTwo == 1) {
        npcTwoMove = evaluateMove;
    } else if (npcTwo == 2) {
        npcTwoMove = minimaxMove;
    }

    npcOneMove();
};
