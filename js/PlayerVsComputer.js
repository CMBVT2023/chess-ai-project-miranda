import { Chess } from "./chess.js"
import { evaluateBoard } from "./Evaluation.js";
import { checkGame } from "./GameOver.js";
import { miniMaxCalculation, movesMade, resetMoves } from "./MiniMax.js";

export function playerVsComputer(playSpeed, npcMode, gameDisplay) {
    let currentBoard = null;
    let currentGame = new Chess();
    const [timeDisplay, moveDisplay] = gameDisplay.querySelectorAll('span');
    const currentTurnStatus = document.getElementById('current-turn');
    const currentGameStatus = document.getElementById('game-status');
    currentGameStatus.innerHTML = 'In Progress...';

    let whiteSquareHighlight = '#235FB9';
    let blackSquareHighlight = '#194990';

    let globalValue = 0;

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

    function displayInfo(milliseconds, moveAmount) {
        timeDisplay.innerHTML = `${(milliseconds / 1000)}`;
        moveDisplay.innerHTML = moveAmount;
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
            currentGameStatus.innerHTML = `${checkGame(currentGame)}`;
            return;
        } else {
            currentTurnStatus.innerHTML = 'White';
        }
    }

    function evaluateMove() {
        let possibleMoves = currentGame.simpleMoves();

        if (possibleMoves.length == 0) {
            return;
        };

        let startTime = Date.now();
        let tempScore;
        let bestMove;

        for (const move of possibleMoves) {
            let currentScore = evaluateBoard(move, globalValue, 'b');
            if (currentScore > tempScore || bestMove == undefined) {
                tempScore = currentScore;
                bestMove = move;
            }
        }

        displayInfo(Date.now() - startTime, possibleMoves.length);
        
        globalValue = evaluateBoard(bestMove, globalValue, 'b');
        currentGame.move(bestMove);
        currentBoard.position(currentGame.fen())
        if (checkGame(currentGame)) {
            currentGameStatus.innerHTML = `${checkGame(currentGame)}`;
            return;
        } else {
            currentTurnStatus.innerHTML = 'White';
        }
    }

    function minimaxMove() {
        let possibleMoves = currentGame.moves();

        if (possibleMoves.length == 0) {
            return;
        };

        let startTime = Date.now();
        resetMoves();

        let [bestMove, nestedValue] = miniMaxCalculation(3, true, currentGame, globalValue, 'b', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        
        displayInfo(Date.now() - startTime, movesMade())

        globalValue = evaluateBoard(bestMove, globalValue, 'b');

        currentGame.move(bestMove);
        currentBoard.position(currentGame.fen())
        if (checkGame(currentGame)) {
            currentGameStatus.innerHTML = `${checkGame(currentGame)}`;
            return;
        } else {
            currentTurnStatus.innerHTML = 'White';
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

            // Evaluates the current positioning of the board from blacks perspective and updates the global value variable.
            globalValue = evaluateBoard(move, globalValue, 'b');
                        
            if (checkGame(currentGame)) {
                currentGameStatus.innerHTML = `${checkGame(currentGame)}`;
                return;
            } else {
                currentTurnStatus.innerHTML = 'Black';
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
    window.addEventListener('resize', () => {
        currentBoard.resize();
    })
};