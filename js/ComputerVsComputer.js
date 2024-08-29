import { Chess } from "./chess.js"
import { checkGame } from "./GameOver.js";
import { evaluateBoard } from "./Evaluation.js";
import { miniMaxCalculation, resetMoves, movesMade } from "./MiniMax.js";

let NPCOneBestValue = 0;
let NPCTwoBestValue = 0;

export function computerVsComputer(playSpeed, npcOne, npcTwo, displayOne, displayTwo) {
    let currentBoard = Chessboard('mainBoard', 'start');
    let currentGame = new Chess();

    let [npcOneTimeDisplay, npcOneMoveDisplay] = displayOne.querySelectorAll('span');
    let [npcTwoTimeDisplay, npcTwoMoveDisplay] = displayTwo.querySelectorAll('span');

    function displayInfo(timeDisplay, moveDisplay, milliseconds, moveAmount) {
        timeDisplay.innerHTML = `${(milliseconds / 1000)}`;
        moveDisplay.innerHTML = moveAmount;
    }

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
            let possibleMoves = currentGame.simpleMoves();
    
            if (possibleMoves.length == 0) {
                return;
            };
    
            let startTime = Date.now();
            let value;
            let bestMove;

            if (currentGame.turn() == 'w') {
                value = NPCOneBestValue;
            } else {
                value = NPCTwoBestValue;
            }
    
            for (const move of possibleMoves) {
                let tempScore = evaluateBoard(move, value, currentGame.turn());
                if (tempScore > value || bestMove == undefined) {
                    value = tempScore;
                    bestMove = move;
                }
            }
    
            if (currentGame.turn() == 'w') {
                displayInfo(npcOneTimeDisplay, npcOneMoveDisplay, Date.now() - startTime, possibleMoves.length)
            } else {
                displayInfo(npcTwoTimeDisplay, npcTwoMoveDisplay, Date.now() - startTime, possibleMoves.length)
            }
    
            currentGame.move(bestMove);
            currentBoard.position(currentGame.fen())
            if (checkGame(currentGame)) {
                console.log(checkGame(currentGame));
                return;
            }
    
            if (currentGame.turn() == 'b') {
                NPCOneBestValue = value;
                setTimeout(npcOneMove, playSpeed);
            } else {
                NPCTwoBestValue = value;
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
            let value;
            if (currentGame.turn() == 'w') {
                value = NPCOneBestValue
            } else {
                value = NPCTwoBestValue
            }
            resetMoves();
    
            let [bestMove, bestValue] = miniMaxCalculation(3, true, currentGame, value, currentGame.turn());

            if (currentGame.turn() == 'w') {
                displayInfo(npcOneTimeDisplay, npcOneMoveDisplay, Date.now() - startTime, movesMade())
            } else {
                displayInfo(npcTwoTimeDisplay, npcTwoMoveDisplay, Date.now() - startTime, movesMade())
            }
    
            currentGame.move(bestMove);
            currentBoard.position(currentGame.fen())
            if (checkGame(currentGame)) {
                console.log(checkGame(currentGame));
                return;
            }
    
            if (currentGame.turn() == 'b') {
                NPCOneBestValue = value;
                setTimeout(npcOneMove, playSpeed);
            } else {
                NPCTwoBestValue = value;
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

    NPCOneBestValue = 0;
    NPCTwoBestValue = 0;

    window.addEventListener('resize', () => {
        currentBoard.resize();
    })
    npcOneMove();
};
