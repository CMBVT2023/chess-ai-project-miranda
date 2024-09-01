// Imports all the necessary functions from the various modules.
import { Chess } from "./chess.js"
import { evaluateBoard } from "./Evaluation.js";
import { checkGame } from "./GameOver.js";
import { miniMaxCalculation, movesMade, resetMoves } from "./MiniMax.js";

// Things to do, add the npcDisplay updates, add the game status display updates, add the time and moves amount display.
// switch minimax to a class.

class ChessGame {
    constructor(props) {
        this.globalSum = 0;
        this.currentBoard = Chessboard('mainBoard', 'start')
        this.currentGame = new Chess();
        this.playSpeed = props.speed;

        this.currentTurnStatus = document.getElementById('current-turn');
        this.currentGameStatus = document.getElementById('game-status');

        this.loadDefaultEventListeners();
    }

    // Loads all the default eventListeners for the class.
    loadDefaultEventListeners() {
        // Adds an event listener to the window that will resize the current board each time the window is resized.
        window.addEventListener('resize', () => {
            this.currentBoard.resize();
        })
    }

    setNPCMode(num, multipleNPCs) {
        switch (num) {
            case 0: {
                // If the value is equal to 0,
                // the npc will determine its moves randomly using the makeRandomMove function.
                return this.makeRandomMove;
            };
            case 1: {
                // If the value is equal to 1,
                // the npc will determine its by evaluating all currently possible moves using the evaluateMove function.
                return this.evaluateMove;
            };
            case 2: {
                // If the value is equal to 2,
                // the npc will determine its by evaluating all currently possible moves and the resulting moves after using the 
                // minimaxMove function.
                return this.minimaxMove;
            };
        }
    }

    // Initializes a method to update the currentGameStatus display to reflect the status of the game.
    updateGameStatus() {
        this.currentGameStatus.innerHTML = 'In Progress...';
    }

    // Initializes a method to update the globalSum based on the new positioning of the the board after the passed in move occurs.
    // // The parameter passed in the move that will be made on the board.
    updateGlobalSum(move) {
        // Sets the globalSum variable to represent the current board positioning from black's perspective
        // by calling the evaluateBoard function and passing in the move that will be made, the current globalSum, and the string 'b'.
        this.globalSum = evaluateBoard(move, this.globalSum, 'b');
    }



    // Initializes a method to check the status of the currentGame that is passed in as a parameter.
    checkGame(currentGame) {
        if (currentGame.isCheckmate()) {
            return 'CheckMate';
        }
        //  else if (currentGame.isInsufficientMaterial()) {
        //     return 'Insufficient Material';
        // }  
        //  else if (currentGame.isDraw()) {
        //     return 'Draw';
        // } else if (currentGame.isStalemate()) {
        //     return 'StaleMate';
        // } else if (currentGame.isThreefoldRepetition()) {
        //     return 'ThreeFold'
        // } 
        else if (currentGame.isGameOver()) {
            return 'Game Over';
        } else {
            return false;
        }
    }
}

export class playerVsComputer extends ChessGame {
    constructor(props) {
        super(props);

        this.npcMode = +props.npcType;
        this.npcMove = this.setNPCMode(this.npcMode);
        
        this.npcDisplay = props.display;
        [this.npcTime, this.npcMoves] = this.npcDisplay.querySelectorAll('span');

        this.whiteSquareHighlight = '#235FB9';
        this.blackSquareHighlight = '#194990';
        
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

        // Calls the grey square function on the source object to highlight the square the user is grabbing from.
        this.greySquare(source);

        // Iterates through all possible moves in the possibleMoves array.
        for (const tile in possibleMoves) {
            // Calls the grey square function on all of the tiles that moves can be potentially moved to, and thus highlighting all legal moves that can be made based on the square the user is
            // grabbing the piece from.
            this.greySquare(possibleMoves[tile].to)
        }
    }

    // Initializes a method that triggers once the player drops a piece onto a square.
    // // The parameters are an object containing the info for the square the player first grabbed the piece from
    // // and another object that contains the info for the square the player is moving their piece too.
    onDrop (source, target) {
        // Calls the removeGreySquares function to remove all highlighted squares from the board.
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

            this.updateGlobalSum(move);

            setTimeout(this.npcMove.bind(this), this.playSpeed);
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

    configureMainGame() {
        let config = {
            draggable: true,
            position: 'start',
            onDragStart: this.onDragStart.bind(this),
            onDrop: this.onDrop.bind(this),
            onSnapEnd: this.onSnapEnd.bind(this),
        }

        this.currentBoard = Chessboard('mainBoard', config);
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
    }

    // Initializes a method that makes the best possible moves after calculating all possible moves' position values on the board.
    evaluateMove() {
        // Initializes an array of all possible moves that can be made currently using the simpleMove method I created in the chess file.
        // The returned array contains similar objects except all of the properties are the necessary ones only.
        let possibleMoves = this.currentGame.simpleMoves();

        // Checks if the possible moves array contains any elements.
        if (possibleMoves.length == 0) {
            // If no elements are present, then return false.
            return false;
        };

        // Initializes two variables,
        // one is to store a temporary number,
        // and the second is to store the bestMove once all moves are evaluated.
        let tempScore;
        let bestMove;

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
        
        // Recalculated the globalSum by calling the evaluateBoard method and passing in the move that will be made, the current globalSum, and the constant 'b', to have the evaluation be based on the blacks perspective.
        this.globalSum = evaluateBoard(bestMove, this.globalSum, 'b');

        // Performs the best calculated move.
        this.currentGame.move(bestMove);

        // Updates the chessboard to the current position of all pieces by obtaining the fen string from the chess game using the .fen() method on the currentGame.
        this.currentBoard.position(this.currentGame.fen())
    }

     // Initializes a method that determines the best move possible based on all current moves and then the moves they result in too.
     minimaxMove() {
        // Initializes an array with all possible moves.
        let possibleMoves = this.currentGame.moves();

        // Checks if the array of moves has at least one element.
        if (possibleMoves.length == 0) {
            // If no elements are present, then return false.
            return false;
        };

        // Initializes two variables to store the results of the function call.
        // // The function is called with multiple arguments,
        // // the first is the node depth or the maximum number of recursive calls that will be made, a higher value will result better move selection but at the cost of longer calculation time,
        // // the second is a boolean to represent if the current player is the main player, in this case black is the main player so this is true,
        // // the third is the current globalSum of the board, the advantage value based on the positioning of all current pieces on the board,
        // // the fourth is the color of the current player's turn, since this function will only be called during black's turn the string 'b' is used,
        // // the last two are the alpha and beta values of the branches that will be used to determine if a branch can be cut or no longer searched on the tree,
        // // and to start these values are set to their highest possible values with alpha being the largest negative number and beta being the largest positive number possible.
        let [bestMove, nestedValue] = miniMaxCalculation(3, true, this.currentGame, this.globalSum, 'b', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        
        // Calls the method to update the currentGlobalSum once the bestMove is made on the board.
        this.updateGlobalSum(bestMove);

        // Performs the best calculated move.
        this.currentGame.move(bestMove);

        // Updates the chessboard to the current position of all pieces by obtaining the fen string from the chess game using the .fen() method on the currentGame.
        this.currentBoard.position(this.currentGame.fen());
    }
}

export class computerVsComputer extends ChessGame {
    constructor(props) {
        super(props)

        this.npcOneMode = +props.npcOne;
        this.npcTwoMode = +props.npcTwo;
        this.npcOneMove = this.setNPCMode(this.npcOneMode, true);
        this.npcTwoMove = this.setNPCMode(this.npcTwoMode, true);

        this.npcOneDisplay = props.displayOne;
        [this.npcOneTime, this.npcOneMoves] = this.npcOneDisplay.querySelectorAll('span');

        this.npcTwoDisplay = props.displayTwo;
        [this.npcTwoTime, this.npcTwoMoves] = this.npcTwoDisplay.querySelectorAll('span');

        this.continueBtn = document.getElementById('continue-button');
        this.continuousCheck = document.getElementById('continuous-play');
        this.continuePlay = false;

        this.loadContinuousChangeEvent();
        this.continueGame(true);
    }

    loadContinuousChangeEvent() {
        this.continuousCheck.addEventListener('change', () => {
            if (this.continuousCheck.checked) {
                this.continuePlay = true
            } else {
                this.continuePlay = false
            }
        })
    }

    continueGame(start) {
        if (!this.continuePlay || start) {
            this.continueBtn.disabled = false;

            this.continueBtn.addEventListener('click', () => {
                setTimeout(this.npcOneMove.bind(this, 'b'), this.playSpeed);
                this.continueBtn.disabled = true;
            }, {once:true})
        } else {
            setTimeout(this.npcOneMove.bind(this, 'w'), this.playSpeed);
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

        // Checks the color of the current player's turn.
        if (this.currentGame.turn() == 'b') {
            // If it is now black's turn,
            // Update the currentTurnStatus to reflect so and then call the method to trigger the second npc's move.
            this.currentTurnStatus.innerHTML = 'Black';
            setTimeout(this.npcTwoMove.bind(this), this.playSpeed);
        } else {
            // If it is now white's turn,
            // Update the currentTurnStatus to reflect so and then call the continueGame method.
            this.currentTurnStatus.innerHTML = 'White';
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

            // Initializes a variable store the bestMove once all moves are evaluated.
            let bestMove;

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

            // Performs the best calculated move.
            this.currentGame.move(bestMove);

            // Updates the chessboard to the current position of all pieces by obtaining the fen string from the chess game using the .fen() method on the currentGame.
            this.currentBoard.position(this.currentGame.fen())

            // Checks the color of the current player's turn.
            if (this.currentGame.turn() == 'b') {
                // If it is now black's turn,
                // Update the currentTurnStatus to reflect so and then call the method to trigger the second npc's move.
                this.currentTurnStatus.innerHTML = 'Black';
                setTimeout(this.npcTwoMove.bind(this), this.playSpeed);
            } else {
                // If it is now white's turn,
                // Update the currentTurnStatus to reflect so and then call the continueGame method.
                this.currentTurnStatus.innerHTML = 'White';
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
    
            // Checks if the array of moves has at least one element.
            if (possibleMoves.length == 0) {
                // If no elements are present, then return false.
                return false;
            };
    
            // Initializes two variables, one to store the number value returned from the recursive call and the other to store the bestMove found by the recursive function.
            let tempValue;
            let bestMove;
    
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
            
            // Calls the method to update the currentGlobalSum once the bestMove is made on the board.
            this.updateGlobalSum(bestMove);
    
            // Performs the best calculated move.
            this.currentGame.move(bestMove);
    
            // Updates the chessboard to the current position of all pieces by obtaining the fen string from the chess game using the .fen() method on the currentGame.
            this.currentBoard.position(this.currentGame.fen());
    
            // Checks the color of the current player's turn.
            if (this.currentGame.turn() == 'b') {
                // If it is now black's turn,
                // Update the currentTurnStatus to reflect so and then call the method to trigger the second npc's move.
                this.currentTurnStatus.innerHTML = 'Black';
                setTimeout(this.npcTwoMove.bind(this), this.playSpeed);
            } else {
                // If it is now white's turn,
                // Update the currentTurnStatus to reflect so and then call the continueGame method.
                this.currentTurnStatus.innerHTML = 'White';
                this.continueGame();
            }
        } catch { // If the move is interrupted via a game reset, then this error is caught and the user is alerted via the console.
            console.log('Game Reset');
        }
    }
}