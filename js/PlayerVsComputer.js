import { Chess } from "../node_modules/chess.js/dist/esm/chess.js"
import { evaluateBoard } from "./Evaluation.js";
import { checkGame } from "./GameOver.js";
import { miniMaxCalculation, movesMade, resetMoves } from "./MiniMax.js";

let bestValue = 0;

export function playerVsComputer(playSpeed, npcMode) {
    let currentBoard = null;
    let currentGame = new Chess();

    let whiteSquareHighlight = '#a9a9a9';
    let blackSquareHighlight = '#696969';

    function removeGreySquares() {
        $(`#${'mainBoard'} .square-55d63`).css('background', '');
    }

    function greySquare(square) {
        let $currentSquare = $(`#${'mainBoard'} .square-${square}`);
        
        let background = whiteSquareHighlight;
        if ($currentSquare.hasClass('black-3c85d')) {
            background = blackSquareHighlight;
        }

        $currentSquare.css('background', background);
    }

    function onMouseOutSquare(square, piece) {
        removeGreySquare();
    }

    function onDragStart (source, piece, position, orientation) {
        // Checks if the game is over to prevent moving the pieces.
        if (currentGame.isGameOver()) return false;

        if (piece.search(/^b/) !== -1) return false;

        let possibleMoves = currentGame.moves({
            square: source,
            verbose: true
        });

        if (possibleMoves.length == 0) {
            return false;
        };

        greySquare(source);

        for (const tile in possibleMoves) {
            greySquare(possibleMoves[tile].to)
        }
    }

    function makeRandomMove() {
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
    }

    function evaluateMove() {
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
    }

    function minimaxMove() {
        let possibleMoves = currentGame.moves({ verbose: true });

        if (possibleMoves.length == 0) {
            return;
        };

        let startTime = Date.now();
        resetMoves();

        let [bestMove, nestedValue] = miniMaxCalculation(3, true, currentGame, bestValue, currentGame.turn(), Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        
        console.log('Time to calculate best move:', Date.now() - startTime, 'milliseconds.\n',
                    'Amount of Moves Checked: ', movesMade());

        bestValue = nestedValue;

        currentGame.move(bestMove);
        currentBoard.position(currentGame.fen())
        if (checkGame(currentGame)) {
            console.log(checkGame(currentGame));
            return;
        }
    }
    
    function onDrop (source, target) {
        removeGreySquares();
        
        // Checks if the move is viable.
        try {
            let move = currentGame.move({
                from: source,
                to: target,
                promotion: 'q'
            })
                        
            if (checkGame(currentGame)) {
                console.log(checkGame(currentGame));
                return;
            } else {
                // Calls the move function for the opposing player
                setTimeout(makeMove, playSpeed);
            }
        } catch { // if not, 'snapback' is returned to move the piece back to its previous position before being grabbed.
            return 'snapback';
        }   
    }

    function onSnapEnd() {
        currentBoard.position(currentGame.fen());
    };

    let config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
    }
    let makeMove;

    if (npcMode == 0) {
        makeMove = makeRandomMove;
    } else if (npcMode == 1) {
        makeMove = evaluateMove;
    } else if (npcMode == 2) {
        makeMove = minimaxMove;
    }

    currentBoard = Chessboard('mainBoard', config);
};