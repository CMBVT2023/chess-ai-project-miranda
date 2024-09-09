// Imports all the necessary functions from the various modules.
import { ChessGame } from "./ChessGame.js";
import { evaluateBoard } from "./Evaluation.js";
import { miniMaxCalculation, movesMade, resetMoves } from "./MiniMax.js";

// Player vs Computer game mode Class that extends the main ChessGame Class.
export class playerVsComputer extends ChessGame {
    constructor(props) {
        // Calls the main ChessGame class constructor to gain access to the various attributes and methods defined by it.
        super(props);

        // Initializes a variable to store a number value representing the computer player's mode, and this value is set equal to the npcType property of the passed in props object.
        this.npcMode = +props.npcType;

        // Initializes a variable to store the method that will be used by the computer player to generate its move.
        // // The npcMode variable is passed in to the setNPCMode method and based on the value the appropriate pointer to the move generating method is returned.
        this.npcMove = this.setNPCMode(this.npcMode);
        
        // Initializes multiple variables to store the display elements for the computer player.
        // // The main display is gained via a property of the passed in props object.
        this.npcDisplay = props.display;
        [this.npcTime, this.npcMoves] = this.npcDisplay.querySelectorAll('span');

        // Initializes two variables to store the highlight colors of a white or black square.
        this.whiteSquareHighlight = '#235FB9';
        this.blackSquareHighlight = '#194990';
        
        // Calls the method to configure and start the mainGame.
        this.configureMainGame();
    }

    // Initializes a method to remove or change the background color from the highlight colors.
    removeGreySquares() {
        $(`#${'mainBoard'} .square-55d63`).css('background', '');
    }

    // Initializes a method to add the highlighted color for the passed in square.
    greySquare(square) {
        // Initializes a variable to store the current square's as a jQuery object.
        let $currentSquare = $(`#${'mainBoard'} .square-${square}`);
        
        // Sets the background highlighting color to the whiteSquare's highlight color.
        let background = this.whiteSquareHighlight;

        // Checks if the jQuery object has a class that signifies a 'black' square.
        if ($currentSquare.hasClass('black-3c85d')) {
            // Sets the background highlighting color to the blackSquare's highlight color.
            background = this.blackSquareHighlight;
        }

        // Sets the jQuery's object's css background as the necessary highlight color for the square.
        $currentSquare.css('background', background);
    }

    // Initializes a method that triggers once the user grabs a piece.
    // // The various parameters include, a source object to represent the current square the user is grabbing from,
    // // the piece variable is what piece the user is grabbing, the position is the position of the current piece on the board,
    // // and orientation is the current game orientation of the board, either white facing towards the top or black facing the top.
    onDragStart (source, piece, position, orientation) {
        // Checks if the game is over to prevent moving the pieces.
        if (this.currentGame.isGameOver()) return false;

        // Checks if the piece if the correct color, the player can only move the white pieces not the black ones.
        if (piece.search(/^b/) !== -1) return false;

        // Initializes the possible moves that can be made based on the square the user is grabbing from.
        let possibleMoves = this.currentGame.moves({
            square: source,
            verbose: true
        });

        // Checks if the possible moves array contains any elements.
        if (possibleMoves.length == 0) {
            // If no elements are present, list the current game status then return to stop the game.
            this.updateGameStatus();
            return;
        };

        // Calls the grey square method on the source object to highlight the square the user is grabbing from.
        this.greySquare(source);

        // Iterates through all possible moves in the possibleMoves array.
        for (const tile in possibleMoves) {
            // Calls the grey square method on all of the tiles that moves can be potentially moved to, and thus highlighting all legal moves that can be made based on the square the user is
            // grabbing the piece from.
            this.greySquare(possibleMoves[tile].to)
        }
    }

    // Initializes a method that triggers once the player drops a piece onto a square.
    // // The parameters are an object containing the info for the square the player first grabbed the piece from
    // // and another object that contains the info for the square the player is moving their piece too.
    onDrop (source, target) {
        // Calls the removeGreySquares method to remove all highlighted squares from the board.
        this.removeGreySquares();
        
        // Checks if the move is viable.
        try {
            // If the move is a legal move,

            // Initializes a variable to store the current move that was made and makes said move on the chess board.
            let move = this.currentGame.move({
                from: source,
                to: target,
                promotion: 'q'
            })

            // Calls the method to update the globalSum variable based on the new move.
            this.updateGlobalSum(move);

            // Calls the updateGameStatus method and checks if the returned boolean is true.
            if (this.updateGameStatus()) {
                // If so, return to end the game.
                return;
            } else {
                // If not, call the method to trigger the computer player's move.
                setTimeout(this.npcMove.bind(this), this.playSpeed);
            }
        } catch (error) {
            // console.error(error)
            // if not, 'snapback' is returned to move the piece back to its previous position before being grabbed.
            return 'snapback';
        }
    }

    // Initializes a method that triggers once a piece's 'snapback' animation is completed.
    onSnapEnd() {
        // Calls the position method on the chess board to display the current positioning of the chess game.
        this.currentBoard.position(this.currentGame.fen());
    };

    // Method used to configure the starting chessboard when beginning the game.
    configureMainGame() {
        // Initializes a config object that contains the various methods to trigger once certain events occur, like grabbing or dragging pieces.
        let config = {
            draggable: true,
            position: 'start',
            onDragStart: this.onDragStart.bind(this),
            onDrop: this.onDrop.bind(this),
            onSnapEnd: this.onSnapEnd.bind(this),
        }

        // Configures the chess board with the config object.
        this.currentBoard = Chessboard('mainBoard', config);
    }

    // Initializes a method to calculate a random move based on the Math.random() function.
    makeRandomMove() {
        // Initializes an array of all possible moves that can be made currently.
        let possibleMoves = this.currentGame.moves();
        
        // Checks if the possible moves array contains any elements.
        if (possibleMoves.length == 0) {
            // If no elements are present, list the current game status then return to stop the game.
            this.updateGameStatus();
            return;
        };

        let randomIndex = Math.floor(Math.random() * possibleMoves.length);
        let nextMove = possibleMoves[randomIndex];

        // Recalculated the globalSum by calling the updateGlobalSum method and passing in the move that will be made.
        this.updateGlobalSum(nextMove);
        
        this.currentGame.move(nextMove);
        this.currentBoard.position(this.currentGame.fen());

        // Calls the updateGameStatus method and checks if the returned boolean is true.
        if (this.updateGameStatus()) {
            // If so, return to end the game.
            return;
        }
    }

    // Initializes a method that makes the best possible moves after calculating all possible moves' position values on the board.
    evaluateMove() {
        // Initializes an array of all possible moves that can be made currently using the simpleMove method I created in the chess file.
        // The returned array contains similar objects except all of the properties are the necessary ones only.
        let possibleMoves = this.currentGame.simpleMoves();

        // Checks if the possible moves array contains any elements.
        if (possibleMoves.length == 0) {
            // If no elements are present, list the current game status then return to stop the game.
            this.updateGameStatus();
            return;
        };

        // Initializes two variables,
        // one is to store a temporary number,
        // and the second is to store the bestMove once all moves are evaluated.
        let currentScore;
        let bestMove;

        // Initializes a variable to store the starting time of when all moves are being evaluation.
        let startTime = Date.now()

        // Iterates through all of the possible moves in the moves array.
        for (const move of possibleMoves) {
            // Initializes a variable that store the value returned from the evaluateBoard function call.
            // This score is calculated based on the move being evaluated, the current global sum value, and the third is the constant 'b', to have the evaluation be based on the blacks perspective.
            let tempScore = evaluateBoard(move, this.currentGame, this.globalSum, 'b');

            // Checks if the calculated score is higher then the tempScore or the bestMove variable is undefined.
            // // The second check is to ensure that at least one move is selected.
            if (tempScore > currentScore || bestMove == undefined) {
                // Sets the tempScore to the currentScore to keep track of the highest score possible out of all moves.
                currentScore = tempScore;

                // Saves the current move as the bestMove possible.
                bestMove = move;
            }
        }
        
        // Calls the method to update the amount of time it took for the computer player to calculate the best move and the amount of moves it checked.
        // // The amount of time is calculated based on the current time subtracted from the time the evaluation began.
        this.updateNPCDisplayInfo(this.npcTime, this.npcMoves, Date.now() - startTime, possibleMoves.length)
        
        // Recalculated the globalSum by calling the updateGlobalSum method and passing in the move that will be made.
        this.updateGlobalSum(bestMove);
        
        // Performs the best calculated move.
        this.currentGame.move(bestMove);

        // Updates the chessboard to the current position of all pieces by obtaining the fen string from the chess game using the .fen() method on the currentGame.
        this.currentBoard.position(this.currentGame.fen())

        // Calls the updateGameStatus method and checks if the returned boolean is true.
        if (this.updateGameStatus()) {
            // If so, return to end the game.
            return;
        }
    }

     // Initializes a method that determines the best move possible based on all current moves and then the moves they result in too.
     minimaxMove() {
        // Initializes an array with all possible moves.
        let possibleMoves = this.currentGame.moves();

        // Checks if the possible moves array contains any elements.
        if (possibleMoves.length == 0) {
            // If no elements are present, list the current game status then return to stop the game.
            this.updateGameStatus();
            return;
        };

        // Initializes a variable to store the starting time of when all moves are being evaluation.
        let startTime = Date.now()

        // Calls the function to reset the number of moves global variable for the miniMaxCalculation.
        resetMoves();

        // Initializes two variables to store the results of the function call.
        // // The function is called with multiple arguments,
        // // the first is the node depth or the maximum number of recursive calls that will be made, a higher value will result better move selection but at the cost of longer calculation time,
        // // the second is a boolean to represent if the current player is the main player, in this case black is the main player so this is true,
        // // the third is the current globalSum of the board, the advantage value based on the positioning of all current pieces on the board,
        // // the fourth is the color of the current player's turn, since this function will only be called during black's turn the string 'b' is used,
        // // the last two are the alpha and beta values of the branches that will be used to determine if a branch can be cut or no longer searched on the tree,
        // // and to start these values are set to their highest possible values with alpha being the largest negative number and beta being the largest positive number possible.
        let bestMove = miniMaxCalculation(3, true, this.currentGame, this.globalSum, 'b', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)[0];

        // Calls the method to update the amount of time it took for the computer player to calculate the best move and the amount of moves it checked.
        // // The amount of time is calculated based on the current time subtracted from the time the evaluation began.
        this.updateNPCDisplayInfo(this.npcTime, this.npcMoves, Date.now() - startTime, movesMade())

        // Calls the method to update the currentGlobalSum once the bestMove is made on the board.
        this.updateGlobalSum(bestMove);

        // Performs the best calculated move.
        this.currentGame.move(bestMove);

        // Updates the chessboard to the current position of all pieces by obtaining the fen string from the chess game using the .fen() method on the currentGame.
        this.currentBoard.position(this.currentGame.fen());
        
        // Calls the updateGameStatus method and checks if the returned boolean is true.
        if (this.updateGameStatus()) {
            // If so, return to end the game.
            return;
        }
    }
}