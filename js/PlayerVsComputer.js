import { Chess } from "../node_modules/chess.js/dist/esm/chess.js"
import { evaluateBoard } from "./Evaluation.js";
import { checkGame } from "./GameOver.js";

export function playerVsComputer(currentBoardID, playSpeed) {
    let currentBoard = null;
    let currentGame = new Chess();

    let whiteSquareHighlight = '#a9a9a9';
    let blackSquareHighlight = '#696969';

    function removeGreySquares() {
        $(`#${currentBoardID} .square-55d63`).css('background', '');
    }

    function greySquare(square) {
        let $currentSquare = $(`#${currentBoardID} .square-${square}`);
        
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
        let possibleMoves = currentGame.moves({ verbose: true });

        if (possibleMoves.length == 0) {
            console.log('Opponent Turn:', 'Game Over')
            return;
        };

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
                setTimeout(makeRandomMove, playSpeed);
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

    currentBoard = Chessboard(currentBoardID, config);
};