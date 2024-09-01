// Imports all the necessary functions from the various modules.
import { Chess } from "./chess.js"
import { evaluateBoard } from "./Evaluation.js";
import { checkGame } from "./GameOver.js";
import { miniMaxCalculation, movesMade, resetMoves } from "./MiniMax.js";

// Initializes a function to run the player vs computer game mode.
export function playerVsComputer(playSpeed, npcMode, gameDisplay) {
    // Initializes two variables, one stores the current chess board and the other the current chess game.
        // let currentBoard = null;
        // let currentGame = new Chess();

        // Initializes all of the variables to store the various webpage elements.
    // const [timeDisplay, moveDisplay] = gameDisplay.querySelectorAll('span');
        // const currentTurnStatus = document.getElementById('current-turn');
        // const currentGameStatus = document.getElementById('game-status');

    // Sets the status element to display that the game is in progress.
        // currentGameStatus.innerHTML = 'In Progress...';

    // Initializes variables to store the highlighting colors for the various squares.
    // let whiteSquareHighlight = '#235FB9';
    // let blackSquareHighlight = '#194990';

    // Sets the global sum or value to 0.
        // let globalValue = 0;

    // // Initializes a function to remove or change the background color from the highlight colors.
    // function removeGreySquares() {
    //     $(`#${'mainBoard'} .square-55d63`).css('background', '');
    // }

    // Initializes a function to add the highlighted color for the passed in square.
    // function greySquare(square) {
    //     // Initializes a variable to store the current square's as a jQuery object.
    //     let $currentSquare = $(`#${'mainBoard'} .square-${square}`);
        
    //     // Sets the background highlighting color to the whiteSquare's highlight color.
    //     let background = whiteSquareHighlight;

    //     // Checks if the jQuery object has a class that signifies a 'black' square.
    //     if ($currentSquare.hasClass('black-3c85d')) {
    //         // Sets the background highlighting color to the blackSquare's highlight color.
    //         background = blackSquareHighlight;
    //     }

    //     // Sets the jQuery's object's css background as the necessary highlight color for the square.
    //     $currentSquare.css('background', background);
    // }

    // // Initializes a function that triggers once the user grabs a piece.
    // // // The various parameters include, a source object to represent the current square the user is grabbing from,
    // // // the piece variable is what piece the user is grabbing, the position is the position of the current piece on the board,
    // // // and orientation is the current game orientation of the board, either white facing towards the top or black facing the top.
    // function onDragStart (source, piece, position, orientation) {
    //     // Checks if the game is over to prevent moving the pieces.
    //     if (currentGame.isGameOver()) return false;

    //     // Checks if the piece if the correct color, the player can only move the white pieces not the black ones.
    //     if (piece.search(/^b/) !== -1) return false;

    //     // Initializes the possible moves that can be made based on the square the user is grabbing from.
    //     let possibleMoves = currentGame.moves({
    //         square: source,
    //         verbose: true
    //     });

    //     // Checks if there are potential moves to be made and if not, then return false to prevent the user from moving pieces.
    //     if (possibleMoves.length == 0) {
    //         return false;
    //     };

    //     // Calls the grey square function on the source object to highlight the square the user is grabbing from.
    //     greySquare(source);

    //     // Iterates through all possible moves in the possibleMoves array.
    //     for (const tile in possibleMoves) {
    //         // Calls the grey square function on all of the tiles that moves can be potentially moved to, and thus highlighting all legal moves that can be made based on the square the user is
    //         // grabbing the piece from.
    //         greySquare(possibleMoves[tile].to)
    //     }
    // }

    // Initializes a function that displays the current info obtained after running minimax algorithm.
    // // The two parameters are two number values, one is the milliseconds it took to run the algorithm and the other is the amount of moves checked.
    function displayInfo(milliseconds, moveAmount) {
        // Sets the respective displays to the passed in data.
        timeDisplay.innerHTML = `${(milliseconds / 1000)}`;
        moveDisplay.innerHTML = moveAmount;
    }

    // Initializes a function to calculate a random move based on the Math.random() function.
    function makeRandomMove() {
        // Initializes an array of all possible moves that can be made currently.
        let possibleMoves = currentGame.moves();
        
        // Checks if the possible moves array contains any elements.
        if (possibleMoves.length == 0) {
            // If no elements are present, then call the checkGame function
            currentGameStatus.innerHTML = `${checkGame(currentGame)}`;
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
    
    // Initializes a function that makes the best possible moves after calculating all possible moves' position values on the board.
    function evaluateMove() {
        // Initializes an array of all possible moves that can be made currently using the simpleMove method I created in the chess file.
        // The returned array contains similar objects except all of the properties are the necessary ones only.
        let possibleMoves = currentGame.simpleMoves();

        // Checks if the possible moves array contains any elements.
        if (possibleMoves.length == 0) {
            // If no elements are present, then call the checkGame function
            currentGameStatus.innerHTML = `${checkGame(currentGame)}`;
            return;
        };

        // Initializes three variables,
        // one to store the current time in milliseconds once the evaluation function is called,
        // the second is to store a temporary number,
        // and the third is to store the bestMove once all moves are evaluated.
        let startTime = Date.now();
        let tempScore;
        let bestMove;

        // Iterates through all of the possible moves in the moves array.
        for (const move of possibleMoves) {
            // Initializes a variable that store the value returned from the evaluateBoard function call.
            // This score is calculated based on the move being evaluated, the current global sum value, and the third is the constant 'b', to have the evaluation be based on the blacks perspective.
            let currentScore = evaluateBoard(move, globalValue, 'b');

            // Checks if the calculated score is higher then the tempScore or the bestMove variable is undefined.
            // // The second check is to ensure that at least one move is selected.
            if (currentScore > tempScore || bestMove == undefined) {
                // Sets the tempScore to the currentScore to keep track of the highest score possible out of all moves.
                tempScore = currentScore;

                // Saves the current move as the bestMove possible.
                bestMove = move;
            }
        }

        // Calls the display function with the time it took to run the algorithm and the amount of moves checked.
        displayInfo(Date.now() - startTime, possibleMoves.length);
        
        // Recalculated the globalValue by calling the evaluateBoard method and passing in the move that will be made, the current globalSum, and the constant 'b', to have the evaluation be based on the blacks perspective.
        globalValue = evaluateBoard(bestMove, globalValue, 'b');

        // Performs the best calculated move.
        currentGame.move(bestMove);

        // Updates the chessboard to the current position of all pieces by obtaining the fen string from the chess game using the .fen() method on the currentGame.
        currentBoard.position(currentGame.fen())

        // Checks if the current game is over using the checkGame function.
        if (checkGame(currentGame)) {
            // If the current game is over, log the reasoning as to why it ended to the currentGameStatus element.
            currentGameStatus.innerHTML = `${checkGame(currentGame)}`;
            return;
        } else {
            // If not, then update the currentTurnStatus to show that it is now the player's turn.
            currentTurnStatus.innerHTML = 'White';
        }
    }

    // Initializes a function that determines the best move possible based on all current moves and then the moves they result in too.
    function minimaxMove() {
        // Initializes an array with all possible moves.
        let possibleMoves = currentGame.moves();

        // Checks if the array of moves has at least one element.
        if (possibleMoves.length == 0) {
            // If no elements are present, then call the checkGame function
            currentGameStatus.innerHTML = `${checkGame(currentGame)}`;
            return;
        };

        // Initializes a variables and declares it equal to the current time to keep track of when the algorithm is first called.
        let startTime = Date.now();

        // Resets the global moves variable in the Minimax module.
        resetMoves();

        // Initializes two variables to store the results of the function call.
        // // The function is called with multiple arguments,
        // // the first is the node depth or the maximum number of recursive calls that will be made, a higher value will result better move selection but at the cost of longer calculation time,
        // // the second is a boolean to represent if the current player is the main player, in this case black is the main player so this is true,
        // // the third is the current globalValue of the board, the advantage value based on the positioning of all current pieces on the board,
        // // the fourth is the color of the current player's turn, since this function will only be called during black's turn the string 'b' is used,
        // // the last two are the alpha and beta values of the branches that will be used to determine if a branch can be cut or no longer searched on the tree,
        // // and to start these values are set to their highest possible values with alpha being the largest negative number and beta being the largest positive number possible.
        let [bestMove, nestedValue] = miniMaxCalculation(3, true, currentGame, globalValue, 'b', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        
        // Calls the display info function with the argument of how long it took for the algorithm to run, calculated by subtracting the startTime with the current time,
        // and the number of moves check by the algorithm which is returned by the moveMade function.
        displayInfo(Date.now() - startTime, movesMade())

        // Sets the globalValue variable to represent the current board positioning from black's perspective
        // by calling the evaluateBoard function and passing in the move that will be made, the current globalValue, and the string 'b'.
        globalValue = evaluateBoard(bestMove, globalValue, 'b');

        // Performs the best calculated move.
        currentGame.move(bestMove);

        // Updates the chessboard to the current position of all pieces by obtaining the fen string from the chess game using the .fen() method on the currentGame.
        currentBoard.position(currentGame.fen())

        // Checks if the current game is over using the checkGame function.
        if (checkGame(currentGame)) {
            // If the current game is over, log the reasoning as to why it ended to the currentGameStatus element.
            currentGameStatus.innerHTML = `${checkGame(currentGame)}`;
            return;
        } else {
            // If not, then update the currentTurnStatus to show that it is now the player's turn.
            currentTurnStatus.innerHTML = 'White';
        }
    }
    
    // Initializes a function that triggers once the player drops a piece onto a square.
    // // The parameters are an object containing the info for the square the player first grabbed the piece from
    // // and another object that contains the info for the square the player is moving their piece too.
    // function onDrop (source, target) {
    //     // Calls the removeGreySquares function to remove all highlighted squares from the board.
    //     removeGreySquares();
        
    //     // Checks if the move is viable.
    //     try {
    //         // If the move is a legal move,

    //         // Initializes a variable to store the current move that was made and makes said move on the chess board.
    //         let move = currentGame.move({
    //             from: source,
    //             to: target,
    //             promotion: 'q'
    //         })

    //         // Evaluates the current positioning of the board from blacks perspective and updates the global value variable.
    //         globalValue = evaluateBoard(move, globalValue, 'b');
                        
    //         // Checks if the current game is over using the checkGame function.
    //         if (checkGame(currentGame)) {
    //             // If the current game is over, log the reasoning as to why it ended to the currentGameStatus element.
    //             currentGameStatus.innerHTML = `${checkGame(currentGame)}`;
    //             return;
    //         } else {
    //         // If not, then update the currentTurnStatus to show that it is now the Computer Player's turn.
    //             currentTurnStatus.innerHTML = 'Black';
    //             // Calls the move function for the opposing player
    //             setTimeout(makeMove, playSpeed);
    //         }
    //     } catch {
    //         // if not, 'snapback' is returned to move the piece back to its previous position before being grabbed.
    //         return 'snapback';
    //     }
    // }

    // // Initializes a function that triggers once a piece's 'snapback' animation is completed.
    // function onSnapEnd() {
    //     // Calls the position method on the chess board to display the current positioning of the chess game.
    //     currentBoard.position(currentGame.fen());
    // };

    // Initializes a variable to store the configuration options for the chess board.
    // // In this configuration the chess board allows the user to grab pieces, the board's pieces all
    // // appear in their default position, and the various methods of onDragStart, onDrop, and onSnapEnd
    // // are all passed in and will be called once any of these events get triggered.
    let config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
    }
    
    // Initializes a variable that will store the function associated with the npc's type, based on the passed in parameter.
    // let makeMove;

    // Checks the value of the npcMode using a switch statement
    // switch (+npcMode) {
    //     case 0: {
    //         // If the value is equal to 0,
    //         // the npc will determine its moves randomly using the makeRandomMove function.
    //         makeMove = makeRandomMove;
    //         break;
    //     };
    //     case 1: {
    //         // If the value is equal to 1,
    //         // the npc will determine its by evaluating all currently possible moves using the evaluateMove function.
    //         makeMove = evaluateMove;
    //         break;
    //     };
    //     case 2: {
    //         // If the value is equal to 2,
    //         // the npc will determine its by evaluating all currently possible moves and the resulting moves after using the 
    //         // minimaxMove function.
    //         makeMove = minimaxMove;
    //         break;
    //     };
    // }

    // Initializes the chess board by passing in the config variable and the id of the html element that the board will appear in.

    // // Adds an event listener to the window that will resize the current board each time the window is resized.
    // window.addEventListener('resize', () => {
    //     currentBoard.resize();
    // })
};