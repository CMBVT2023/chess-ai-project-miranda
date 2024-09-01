// Imports all the necessary functions from the various modules.
import { Chess } from "./chess.js"
import { evaluateBoard } from "./Evaluation.js";
import { miniMaxCalculation, movesMade, resetMoves } from "./MiniMax.js";

// Main ChessGame class that contains all of the default or shared methods and attributes used for all game modes.
class ChessGame {
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

        // Checks if there are potential moves to be made and if not, then return false to prevent the user from moving pieces.
        if (possibleMoves.length == 0) {
            return false;
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
        } catch {
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
            // If no elements are present, then return false to signify that the game is over.
            return;
        };

        let randomIndex = Math.floor(Math.random() * possibleMoves.length);
        let nextMove = possibleMoves[randomIndex];
        
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

        // Initializes two variables,
        // one is to store a temporary number,
        // and the second is to store the bestMove once all moves are evaluated.
        let tempScore;
        let bestMove;

        // Initializes a variable to store the starting time of when all moves are being evaluation.
        let startTime = Date.now()

        // Iterates through all of the possible moves in the moves array.
        for (const move of possibleMoves) {
            // Initializes a variable that store the value returned from the evaluateBoard function call.
            // This score is calculated based on the move being evaluated, the current global sum value, and the third is the constant 'b', to have the evaluation be based on the blacks perspective.
            let currentScore = evaluateBoard(move, this.globalSum, 'b');

            // Checks if the calculated score is higher then the tempScore or the bestMove variable is undefined.
            // // The second check is to ensure that at least one move is selected.
            if (currentScore > tempScore || bestMove == undefined) {
                // Sets the tempScore to the currentScore to keep track of the highest score possible out of all moves.
                tempScore = currentScore;

                // Saves the current move as the bestMove possible.
                bestMove = move;
            }
        }

        // Calls the method to update the amount of time it took for the computer player to calculate the best move and the amount of moves it checked.
        // // The amount of time is calculated based on the current time subtracted from the time the evaluation began.
        this.updateNPCDisplayInfo(this.npcTime, this.npcMoves, Date.now() - startTime, possibleMoves.length)
        
        // Recalculated the globalSum by calling the evaluateBoard method and passing in the move that will be made, the current globalSum, and the constant 'b', to have the evaluation be based on the blacks perspective.
        this.globalSum = evaluateBoard(bestMove, this.globalSum, 'b');

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
        let [bestMove, nestedValue] = miniMaxCalculation(3, true, this.currentGame, this.globalSum, 'b', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);

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
            // If no elements are present, then return false to signify that the game is over.
            return false;
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
                // If no elements are present, then return false.
                return false;
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