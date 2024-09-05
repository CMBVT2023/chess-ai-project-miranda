// Imports all the necessary functions from the various modules.
import { ChessGame } from "./ChessGame.js";
import { evaluateBoard } from "./Evaluation.js";
import { miniMaxCalculation, movesMade, resetMoves } from "./MiniMax.js";

// Computer vs Computer game mode Class that extends the main ChessGame Class.
export class computerVsComputer extends ChessGame {
    constructor(props) {
        // Calls the main ChessGame class constructor to gain access to the various attributes and methods defined by it.
        super(props)

        // Initializes a variable to store a number value representing the two computer players' modes, and this value is set equal to the npcOne and npcTwo property of the passed in props object
        // for the appropriate computer player.
        this.npcOneMode = +props.npcOne;
        this.npcTwoMode = +props.npcTwo;

        // Initializes two variable to store the method that will be used by the computer players to generate their moves.
        // // The npcOneMode and npcTwoMode variables are passed in to the setNPCMode method and based on the value the appropriate pointer to the move generating method is returned.
        this.npcOneMove = this.setNPCMode(this.npcOneMode, true);
        this.npcTwoMove = this.setNPCMode(this.npcTwoMode, true);

        // Initializes multiple variables to store the display elements for the first computer player.
        // // The main display of the first computer player is gained via a property of the passed in props object.
        this.npcOneDisplay = props.displayOne;
        [this.npcOneTime, this.npcOneMoves] = this.npcOneDisplay.querySelectorAll('span');

        // Initializes multiple variables to store the display elements for the second computer player.
        // // The main display of the second computer player is gained via a property of the passed in props object.
        this.npcTwoDisplay = props.displayTwo;
        [this.npcTwoTime, this.npcTwoMoves] = this.npcTwoDisplay.querySelectorAll('span');

        // Initializes three variables, the first two store the elements associated triggering the next turn of the game,
        // and the third stores a boolean that signifies if the game should continuously play.
        this.continueBtn = document.getElementById('continue-button');
        this.continuousCheck = document.getElementById('continuous-play');
        this.continuePlay = false;

        // Calls the method to load the continuousGame eventListener.
        this.loadContinuousChangeEvent();

        // Calls the method to continue or start the game, and passes in a true boolean to signify that this is the start of the game.
        this.continueGame(true);
    }

    // Method used to load an eventListener on the continuousGame checkbox.
    loadContinuousChangeEvent() {
        this.continuousCheck.checked = false;
        this.continuousCheck.addEventListener('change', () => {
            // If the continuousGame checkbox has a change event occur,

            // Check if the checkbox has been checked.
            if (this.continuousCheck.checked) {
                // If the box is checked, set the continuePlay variable to true.
                this.continuePlay = true
            } else {
                // If the box is unchecked, set the continuePlay variable to false.
                this.continuePlay = false
            }
        })
    }

    // Method used to trigger the computer players to take their turn, or continue taking their turns.
    continueGame(start) {
        // Checks if the continue play variable is false or if the passed in start argument is true.
        if (!this.continuePlay || start) {
            // Reenables the continue button element.
            this.continueBtn.disabled = false;

            // Creates an event listener on the continue button to listen for a 'click' event, and this click event will only listen for one occurrence.
            this.continueBtn.addEventListener('click', () => {
                // Sets a timeout to delay calling the method for the first npc's move generation.
                setTimeout(this.npcOneMove.bind(this), this.playSpeed);
                
                // Disables the continue button to prevent the player from triggering multiple method calls.
                this.continueBtn.disabled = true;
            }, {once:true})
        } else {
            // If the continue play variable is true, 
            // Sets a timeout to delay calling the method for the first npc's move generation.
            setTimeout(this.npcOneMove.bind(this), this.playSpeed);
        }
    }

    // Initializes a method to calculate a random move based on the Math.random() function.
    makeRandomMove() {
        // Initializes an array of all possible moves that can be made currently.
        let possibleMoves = this.currentGame.moves();
        
        // Checks if the possible moves array contains any elements.
        if (possibleMoves.length == 0) {
            // If no elements are present, list the current game status then return to stop the game.
            this.currentGameStatus();
            return;
        };
        let randomIndex = Math.floor(Math.random() * possibleMoves.length);
        let nextMove = possibleMoves[randomIndex];
        
        this.currentGame.move(nextMove);
        this.currentBoard.position(this.currentGame.fen())

        // Calls the updateGameStatus method and checks if the returned boolean is true.
        if (this.updateGameStatus()) {
            // If so, return to end the game.
            return;
        }

        // If the game is not over, checks the color of the current player's turn.
        if (this.currentGame.turn() == 'b') {
            // If it is now black's turn,
            // Call the method to trigger the second npc's move.
            setTimeout(this.npcTwoMove.bind(this), this.playSpeed);
        } else {
            // If it is now white's turn,
            // Call the continueGame method.
            this.continueGame();
        }
    }

    // Initializes a method that makes the best possible moves after calculating all possible moves' position values on the board.
    evaluateMove() {
        // Tries to perform the move calculation.
        try{
            // Initializes an array of all possible moves that can be made currently using the simpleMove method I created in the chess file.
            // The returned array contains similar objects except all of the properties are the necessary ones only.
            let possibleMoves = this.currentGame.simpleMoves();

            // Checks if the possible moves array contains any elements.
            if (possibleMoves.length == 0) {
                // If no elements are present, list the current game status then return to stop the game.
                this.currentGameStatus();
                return;
            };

            // Initializes two variables, one to store the bestMove once all moves are evaluated
            // and the second store the starting time of when all moves are being evaluation.
            let bestMove;
            let startTime = Date.now()

            // Checks the color of the current player's turn.
            if (this.currentGame.turn() == 'w') {
                // Iterates through all possible moves
                for (const move of possibleMoves) {
                    // Store the score calculated from the evaluateBoard function, and if it is white's turn, the negative value of the globalSum is use since the globalSum is based on black's 
                    // positioning of the board.
                    let tempScore = evaluateBoard(move, -this.globalSum, this.currentGame.turn());
                    // Checks if the tempScore is better than the negative value of the globalSum, white's value of the board,
                    // or if bestMove is currently undefined, this way at least one move is set as best move.
                    if (tempScore > -this.globalSum || bestMove == undefined) {
                        // Updates the globalSum to reflect blacks positioning of the board by using the negative value of the board evaluation.
                        this.globalSum = -tempScore;

                        // Saves the current move as the bestMove possible.
                        bestMove = move;
                    }
                }
            } else {
                for (const move of possibleMoves) {
                    // Store the score calculated from the evaluateBoard function, and if it is black's turn, the positive value of the globalSum is use since the globalSum is based on black's 
                    // positioning of the board.
                    let tempScore = evaluateBoard(move, this.globalSum, this.currentGame.turn());
                    // Checks if the tempScore is better than the value of the globalSum,
                    // or if bestMove is currently undefined, this way at least one move is set as best move.
                    if (tempScore > this.globalSum || bestMove == undefined) {
                        // Updates the globalSum to reflect the new highest score found.
                        this.globalSum = tempScore;

                        // Saves the current move as the bestMove possible.
                        bestMove = move;
                    }
                }
            }

            // Checks the color of the current player's turn
            if (this.currentGame.turn() == 'w') {
                // Calls the method to update the amount of time it took for the first, or white color computer player, to calculate the best move and the amount of moves it checked.
                // // The amount of time is calculated based on the current time subtracted from the time the evaluation began.
                this.updateNPCDisplayInfo(this.npcOneTime, this.npcOneMoves, Date.now() - startTime, possibleMoves.length)
            } else {
                // Calls the method to update the amount of time it took for the second, or black color computer player, to calculate the best move and the amount of moves it checked.
                // // The amount of time is calculated based on the current time subtracted from the time the evaluation began.
                this.updateNPCDisplayInfo(this.npcTwoTime, this.npcTwoMoves, Date.now() - startTime, possibleMoves.length)
            }

            // Performs the best calculated move.
            this.currentGame.move(bestMove);

            // Updates the chessboard to the current position of all pieces by obtaining the fen string from the chess game using the .fen() method on the currentGame.
            this.currentBoard.position(this.currentGame.fen())

            // Calls the updateGameStatus method and checks if the returned boolean is true.
            if (this.updateGameStatus()) {
                // If so, return to end the game.
                return;
            }

            // If the game is not over, checks the color of the current player's turn.
            if (this.currentGame.turn() == 'b') {
                // If it is now black's turn,
                // Call the method to trigger the second npc's move.
                setTimeout(this.npcTwoMove.bind(this), this.playSpeed);
            } else {
                // If it is now white's turn,
                // Call the continueGame method.
                this.continueGame();
            }
        } catch { // If the move is interrupted via a game reset, then this error is caught and the user is alerted via the console.
            console.log('Game Reset');
        }
    }

     // Initializes a method that determines the best move possible based on all current moves and then the moves they result in too.
     minimaxMove() {
        // Tries to perform the move calculation.
        try{
            // Initializes an array with all possible moves.
            let possibleMoves = this.currentGame.moves();

            // Checks if the possible moves array contains any elements.
            if (possibleMoves.length == 0) {
                // If no elements are present, list the current game status then return to stop the game.
                this.currentGameStatus();
                return;
            };
    
            // Initializes three variables, 
            // one to store the number value returned from the recursive call
            // the second to store the bestMove found by the recursive function,
            // and the third to store the starting time of when the minimax function is called.
            let tempValue;
            let bestMove;
            let startTime = Date.now()

            // Calls the function to reset the number of moves global variable for the miniMaxCalculation.
            resetMoves();
    
            // Calls the miniMaxCalculation function with the passed in arguments and depending on the current player, the arguments will be different,
            // // Both utilize the same nodeDepth, pass in the current game, and use the smallest and largest numbers possible for the alpha and beta values.
            if (this.currentGame.turn() == 'w') {
                // If it is the white players turn, the white player uses the false boolean and the negative value of the global sum since black is the main player and the global sum is based
                // on black's orientation or positioning of the board
                [bestMove, tempValue] = miniMaxCalculation(3, false, this.currentGame, -this.globalSum, this.currentGame.turn(), Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
            } else {
                // If it is the black players turn, the black player uses the true boolean and the positive value of the global sum since black is the main player and the global sum is based
                // on black's orientation or positioning of the board.
                [bestMove, tempValue] = miniMaxCalculation(3, true, this.currentGame, this.globalSum, this.currentGame.turn(), Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
            }

            // Checks the color of the current player's turn
            if (this.currentGame.turn() == 'w') {
                // Calls the method to update the amount of time it took for the first, or white color computer player, to calculate the best move and the amount of moves it checked.
                // // The amount of time is calculated based on the current time subtracted from the time the evaluation began.
                this.updateNPCDisplayInfo(this.npcOneTime, this.npcOneMoves, Date.now() - startTime, movesMade())
            } else {
                // Calls the method to update the amount of time it took for the second, or black color computer player, to calculate the best move and the amount of moves it checked.
                // // The amount of time is calculated based on the current time subtracted from the time the evaluation began.
                this.updateNPCDisplayInfo(this.npcTwoTime, this.npcTwoMoves, Date.now() - startTime, movesMade())
            }
            
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

            // If the game is not over, checks the color of the current player's turn.
            if (this.currentGame.turn() == 'b') {
                // If it is now black's turn,
                // Call the method to trigger the second npc's move.
                setTimeout(this.npcTwoMove.bind(this), this.playSpeed);
            } else {
                // If it is now white's turn,
                // Call the continueGame method.
                this.continueGame();
            }
        } catch { // If the move is interrupted via a game reset, then this error is caught and the user is alerted via the console.
            console.log('Game Reset');
        }
    }
}