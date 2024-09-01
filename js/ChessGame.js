// Imports all the necessary functions from the various modules.
import { Chess } from "./chess.js"
import { evaluateBoard } from "./Evaluation.js";

// Main ChessGame class that contains all of the default or shared methods and attributes used for all game modes.
export class ChessGame {
    constructor(props) {
        // Initializes the starting chessboard and chess game.
        this.currentBoard = Chessboard('mainBoard', 'start')
        this.currentGame = new Chess();
        
        // Initializes two variables, one to store the current global sum of the board,
        // and the other to store the playSpeed which is declared with the value passed through the props object.
        this.globalSum = 0;
        this.playSpeed = props.speed;

        // Initializes variables to store the elements relating to display game info.
        this.currentTurnStatus = document.getElementById('current-turn');
        this.currentGameStatus = document.getElementById('game-status');
        this.currentAdvantage = document.getElementById('game-advantage');

        // Initializes an object to store the strings associated with the current player colors to make it easier to convert the single characters to strings.
        this.piecesString = {
            b: 'Black',
            w: 'White'
        }

        // Calls the method to load all of the default even listeners for the class.
        this.loadDefaultEventListeners();
    }

    // Loads all the default eventListeners for the class.
    loadDefaultEventListeners() {
        // Adds an event listener to the window that will resize the current board each time the window is resized.
        window.addEventListener('resize', () => {
            this.currentBoard.resize();
        })
    }

    // Method used to return the method that the npc will used to generate its move, and this is decided based on the value of the number parameter passed in.
    setNPCMode(num) {
        // Checks the value of the passed in number argument.
        switch (num) {
            case 0: {
                // If the value is equal to 0,
                // the npc will determine its moves randomly using the makeRandomMove method.
                return this.makeRandomMove;
            };
            case 1: {
                // If the value is equal to 1,
                // the npc will determine its by evaluating all currently possible moves using the evaluateMove method.
                return this.evaluateMove;
            };
            case 2: {
                // If the value is equal to 2,
                // the npc will determine its by evaluating all currently possible moves and the resulting moves after using the 
                // minimaxMove method.
                return this.minimaxMove;
            };
        }
    }

    // Initializes a method to update the currentGameStatus display to reflect the status of the game and to check if the game is over.
    updateGameStatus() {
        // Initializes two variables, one to store the status of the game as a string,
        // and the other to store a boolean that signifies if the game has ended.
        let status;
        let endGame;

        // Checks the current game's status.
        if (this.currentGame.inCheck()) {
            // If one of the current players is in check,

            // Sets the status string to show which player is in check and set endGame to false.
            status = `${this.piecesString[this.currentGame.turn()]} is in trouble.`;
            endGame = false;
        } else if (this.currentGame.isCheckmate()) {
            // If one of the players has been checkmated,
            
            // Sets the status string to show which player was checkmated and set endGame to true.
            status = `Checkmate, ${this.piecesString[this.currentGame.turn()]} has lost.`;
            endGame = true;
        } else if (this.currentGame.isInsufficientMaterial()) {
            // If there is not enough info to determine a winner,

            // Sets the status string to show this status and set endGame to true.
            status = 'Insufficient Material';
            endGame = true;
        } else if (this.currentGame.isDraw()) {
            // If a draw occurred,
            
            // Sets the status string to show this status and set endGame to true.
            status = 'Draw';
            endGame = true;
        } else if (this.currentGame.isStalemate()) {
            // If a stalemate occurred,
            
            // Sets the status string to show this status and set endGame to true.
            status = 'StaleMate';
            endGame = true;
        } else if (this.currentGame.isThreefoldRepetition()) {
            // If a three fold repetition occurred,

            // Sets the status string to show this status and set endGame to true.
            status = 'ThreeFold';
            endGame = true;
        } else {
            // Sets the status string to show that the game is still in progress and set endGame to false.
            status = 'In Progress...';
            endGame = false;
        }

        // Updates the appropriate displays with the color of the current turn's player and the status of the game.
        this.currentTurnStatus.innerHTML = `${this.piecesString[this.currentGame.turn()]}`
        this.currentGameStatus.innerHTML = status;

        // Return the endGame boolean to signify if the game is over or not.
        return endGame;
    }

    // Method used to update the time and move display for the appropriate computer player.
    // // The first two parameters are the timeDisplay and the moveDisplay elements of the appropriate computer player,
    // // and the last two are number values representing the milliseconds it took for the algorithm to run and the number of moves checked.
    updateNPCDisplayInfo(timeDisplay, moveDisplay, milliseconds, movesNum) {
        timeDisplay.innerHTML = `${milliseconds / 1000}`;
        moveDisplay.innerHTML = movesNum;
    }

    // Initializes a method to update the globalSum based on the new positioning of the the board after the passed in move occurs.
    // // The parameter passed in the move that will be made on the board.
    updateGlobalSum(move) {
        // Sets the globalSum variable to represent the current board positioning from black's perspective
        // by calling the evaluateBoard function and passing in the move that will be made, the current globalSum, and the string 'b'.
        this.globalSum = evaluateBoard(move, this.globalSum, 'b');

        // Initializes a variable to store the string containing the information for the current player with the current advantage.
        let advantageStatus;
        
        // Checks the value of the globalSum.
        if (this.globalSum == 0) {
            // If it is currently 0, this signifies that no player has an advantage.
            advantageStatus = 'Equal';
        } else if (this.globalSum > 0) {
            // If it is greater than 0, this signifies that the black pieces player has an advantage.
            advantageStatus = 'Black';
        } else if (this.globalSum < 0) {
            // If it is less than 0, this signifies that the white pieces player has an advantage.
            advantageStatus = 'White';
        }

        // Displays the advantage status in the appropriate display.
        this.currentAdvantage.innerHTML = advantageStatus;
    }
}
