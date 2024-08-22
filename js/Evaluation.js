// All values for the pieces' weights and positioning were taken from the 'Build a Simple Chess AI in JavaScript' Tutorial by Zhang Zeyu.

// Initializes an object and declares the various weights associated with each piece.
const pieceWeights = {
    'p': 100,
    'n': 280,
    'b': 320,
    'r': 479,
    'q': 929,
    'k': 60000,
    'k_e': 60000
}

// Initializes an object and declares the various 'Piece Square Tables' (PSTs) to account for the positioning of a piece in accordance with where it is more effective during the game.
// // Basically, taking out a knight that is in one of the corners is less effective than say taking one from the middle of the board, this will help the AI account for positioning of pieces.

const whitePieceSquareTables = {
    'p': [
        [ 100, 100, 100, 100, 105, 100, 100,  100],
        [  78,  83,  86,  73, 102,  82,  85,  90],
        [   7,  29,  21,  44,  40,  31,  44,   7],
        [ -17,  16,  -2,  15,  14,   0,  15, -13],
        [ -26,   3,  10,   9,   6,   1,   0, -23],
        [ -22,   9,   5, -11, -10,  -2,   3, -19],
        [ -31,   8,  -7, -37, -36, -14,   3, -31],
        [   0,   0,   0,   0,   0,   0,   0,   0]
    ],
    'n': [
        [-66, -53, -75, -75, -10, -55, -58, -70],
        [ -3,  -6, 100, -36,   4,  62,  -4, -14],
        [ 10,  67,   1,  74,  73,  27,  62,  -2],
        [ 24,  24,  45,  37,  33,  41,  25,  17],
        [ -1,   5,  31,  21,  22,  35,   2,   0],
        [-18,  10,  13,  22,  18,  15,  11, -14],
        [-23, -15,   2,   0,   2,   0, -23, -20],
        [-74, -23, -26, -24, -19, -35, -22, -69]
    ],
    'b': [
        [-59, -78, -82, -76, -23,-107, -37, -50],
        [-11,  20,  35, -42, -39,  31,   2, -22],
        [ -9,  39, -32,  41,  52, -10,  28, -14],
        [ 25,  17,  20,  34,  26,  25,  15,  10],
        [ 13,  10,  17,  23,  17,  16,   0,   7],
        [ 14,  25,  24,  15,   8,  25,  20,  15],
        [ 19,  20,  11,   6,   7,   6,  20,  16],
        [ -7,   2, -15, -12, -14, -15, -10, -10]
    ],
    'r': [
        [ 35,  29,  33,   4,  37,  33,  56,  50],
        [ 55,  29,  56,  67,  55,  62,  34,  60],
        [ 19,  35,  28,  33,  45,  27,  25,  15],
        [  0,   5,  16,  13,  18,  -4,  -9,  -6],
        [-28, -35, -16, -21, -13, -29, -46, -30],
        [-42, -28, -42, -25, -25, -35, -26, -46],
        [-53, -38, -31, -26, -29, -43, -44, -53],
        [-30, -24, -18,   5,  -2, -18, -31, -32]
    ],
    'q': [
        [  6,   1,  -8,-104,  69,  24,  88,  26],
        [ 14,  32,  60, -10,  20,  76,  57,  24],
        [ -2,  43,  32,  60,  72,  63,  43,   2],
        [  1, -16,  22,  17,  25,  20, -13,  -6],
        [-14, -15,  -2,  -5,  -1, -10, -20, -22],
        [-30,  -6, -13, -11, -16, -11, -16, -27],
        [-36, -18,   0, -19, -15, -15, -21, -38],
        [-39, -30, -31, -13, -31, -36, -34, -42]
    ],
    'k': [
        [  4,  54,  47, -99, -99,  60,  83, -62],
        [-32,  10,  55,  56,  56,  55,  10,   3],
        [-62,  12, -57,  44, -67,  28,  37, -31],
        [-55,  50,  11,  -4, -19,  13,   0, -49],
        [-55, -43, -52, -28, -51, -47,  -8, -50],
        [-47, -42, -43, -79, -64, -32, -29, -32],
        [ -4,   3, -14, -50, -57, -18,  13,   4],
        [ 17,  30,  -3, -14,   6,  -1,  40,  18]
    ],
    'k_e': [
        [-50, -40, -30, -20, -20, -30, -40, -50],
        [-30, -20, -10,   0,   0, -10, -20, -30],
        [-30, -10,  20,  30,  30,  20, -10, -30],
        [-30, -10,  30,  40,  40,  30, -10, -30],
        [-30, -10,  30,  40,  40,  30, -10, -30],
        [-30, -10,  20,  30,  30,  20, -10, -30],
        [-30, -30,   0,   0,   0,   0, -30, -30],
        [-50, -30, -30, -30, -30, -30, -30, -50]
    ]
}

// For both objects, 'k_e' is associated with the king piece near the end of the game since the positioning values will change, and adding a second property for 'k_e' for piece weights removes
// the need for passing to different keys near the end of the game, 'k_e' to position values and 'k' to piece weights, in this way 'k_e' can be used for both.


// Reverses the position values of the board for the black pieces.
// // Instead of having to rewrite all of the same values but in reverse order, this will simply shallow copy the array from the white's position and reverse it.
const blackPiecePositioning = {
    'p' : [...whitePieceSquareTables['p']].reverse(),
    'n' : [...whitePieceSquareTables['n']].reverse(),
    'b' : [...whitePieceSquareTables['b']].reverse(),
    'r' : [...whitePieceSquareTables['r']].reverse(),
    'q' : [...whitePieceSquareTables['q']].reverse(),
    'k' : [...whitePieceSquareTables['k']].reverse(),
    'k_e' : [...whitePieceSquareTables['k_e']].reverse()
}


// // // Might redo this as this is not the way I would do it, instead I would have it be a singular object that stores the positioning of both color
// // // and then use an if statement to associate the right piece positioning with either the opponent or self.
// Creates an object that will store the opponent's positioning.
let opponentPositioning = {
    'w' : whitePieceSquareTables,
    'b' : blackPiecePositioning
}

let selfPositioning = {
    'w' : whitePieceSquareTables,
    'b' : blackPiecePositioning
}

export function evaluateBoard(move, prevSum, color) {
    // // The to and from takes in the value of the current piece's position, rather than deal with letters for the column, like 'a' for column, it instead converts 
    // // the letters to their associated number using the charCodeAt() method to make it easier to work with.
    // // // Note that in this case, the x and y origin is the top left.


    // First element in the array represents where the piece was moved from and 8 is subtracted from it, the length of the board
    // // Example moving from square two will result in 6.
    // Second element in the array represents the column's number value subtracted from the base value of 'a' to represent which column the piece was from.
    // // Example, moving from column c results in a value of 2 and moving from column a results in a value of 0,
    // // // It is basically creating a zero index for the column from letters, rather than having to worry about keeping track of a 0 for column and 0 for row, which can get confusing,
    // // // this method removes that need.
    let moveFrom = [8 - parseInt(move.from[1]), move.from.charCodeAt(0) - 'a'.charCodeAt(0)];

    // Similar to above, this is taking in the move as a string and converting it to a numerical representation of the row number and
    // column to show where the piece is positioned on the board.
    let moveTo = [8 - parseInt(move.to[1]), move.to.charCodeAt(0) - 'a'.charCodeAt(0)];
    
    // Alters the regular 'k' string to the 'k_e' string before evaluating any position values,
    // // This is necessary nearing the end game since the value positions for hte king will need to change.
    // // So as opposed to evaluating moves with the initial kings value this will check if the endgame values need to be utilized instead.
    if (prevSum < -1500) {
        if (move.piece === 'k') {
            move.piece = 'k_e';
        } else if (move.captured === 'k') {
            move.captured = 'k_e'
        }
    }

    // Checks if the current move resulted in a capture by checking if a capture property is present.
    // // In this the same formula is used to calculate the capturing position, only difference is if it results in adding to the current board
    // // score or subtracting to the current board score. Adding showing an advantage and subtracting shows a disadvantage.
    if ('captured' in move) {
        // If so, then it checks the color that made the capture/move.
        if (move.color == color) {
            // If it was the main player's color, self or main AI, then it results in a positive score since it benefits the main player.
            prevSum += (pieceWeights[move.captured] + opponentPositioning[move.color][move.captured][moveTo[0]][moveTo[1]])
        } else {
            // Else, it was the opponent's color, that results in a negative score since it is a benefit for the opponent.
            prevSum -= (pieceWeights[move.captured] + opponentPositioning[move.color][move.captured][moveTo[0]][moveTo[1]])
        }
    }

    // Left off on calculating the score result of promoting a pawn.

}