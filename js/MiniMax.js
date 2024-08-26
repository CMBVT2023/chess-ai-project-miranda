import { evaluateBoard } from "./Evaluation.js";

let numberOfMoves = 0

export function resetMoves() {
    numberOfMoves = 0;
}

export function logMoves() {
    console.log(numberOfMoves);
}

// // Recursive Function Call PseudoCode

// 1 We decide on a predetermined depth limit, k.
// 2 At Layer 0, we consider each of our possible moves, i.e. child nodes.
// 3 For each child node, we consider the minimum score that our opponent can force us to receive. Then, we choose the maximum node.
// 4 But to know the minimum score that our opponent can force us to receive, we must go to Layer 1. For each node in Layer 1, we consider their child nodes.
// 5 For each child node (possible move by our opponent), we consider the maximum score that we can achieve subsequently.
// Then, the minimum score that our opponent can force us to receive is the minimum node.
// 6 But to know the maximum score that we can achieve subsequently, we must go to Layer 2.
// 7 And so on…
// 8 At Layer k, the final board state is evaluated and backtracked to Layer k - 1, and this continues until we reach Layer 0,
// at which point we can finally answer: “What is the optimal move at this point?”

// NodeDepth is the maximum depth limit that this recursive function can be called.
export function miniMaxCalculation(currentNodeDepth, isMainPlayer, currentGame, sum, color, alphaVal, betaVal) {
    // Generates the list of currently possible moves.
    let movesList = currentGame.moves({verbose: true});

    // Randomizes the moves list utilizing swap in place.
    // // There is a fifty percent chance that the current position will swap values with another random position.
    for (let i = 0; i < movesList.length; i++) {
        if (Math.random() > 0.5) {
            let newPosition = Math.floor(Math.random() * movesList.length);
            [movesList[i], movesList[newPosition]] = [movesList[newPosition], movesList[i]]
        }
    }

    // Checks if the maximum node depth is reached or if no other moves are possible,
    if (currentNodeDepth == 0 || movesList.length == 0) {
        // If so simply return the node's value and no children node.
        return [null, sum];
    };

    // Initializes three variables,
    // one to store the minimum score possible,
    // one to store the maximum score possible,
    // and one to store the move that achieves the lowest minimum score and highest maximum score.
    let minimumVal;
    let maximumVal;
    let bestMove;

    // Iterates through the entire array of currently possible moves.
    for (let i = 0; i < movesList.length; i++) {
        // Initializes the currentMove variable and declares it with the current move at the array's specified index.
        let currentMove = movesList[i];

        // Iterates the global numberOfMoves variable to keep track of the total number of moves checked by the algorithm.
        numberOfMoves++;

        // Initializes a temporary variable to store the outcome of the currentMove and how it would affect the game.
        let tempMove = currentGame.move(currentMove);

        // Initializes a temporary variable to store the evaluation score of the temporary move.
        let tempSum = evaluateBoard(tempMove, sum, color);

        // Recursively calls the miniMaxCalculation function again to retrieve the best possible score from all of the child node/moves from the current move,
        // the returned value is either the minimum if the move is for the opponent or the maximum score if the move is for the main player.
        let [nestedBestMove, nestedBestValue] = miniMaxCalculation(currentNodeDepth - 1, !isMainPlayer, currentGame, tempSum, color, alphaVal, betaVal)

        // Undoes the move to backtrack the game for further testing.
        currentGame.undo();

        // Checks if the isMainPlayer variable is true.
        if (isMainPlayer) {
            // If so, then the highest value needs to be found.
            if (nestedBestValue > maximumVal || maximumVal == undefined) {
                // If the previous recursive function call returns a larger value, or if the maximumVal is still unset,
                // then the recursive function call's score is set to the maximumVal variable and the current tempMove is set to the bestMove variable
                // since it is currently the best move that can be made.
                maximumVal = nestedBestValue;
                bestMove = tempMove;
            } 
            
            
            // Checks if the current Alpha value is less than the recursive function's returned value
            if (alphaVal <= nestedBestValue || alphaVal == undefined) {
                // if it is or if alphaValue is currently unset, then set the alphaVal equal to the returned value.
                // // The purpose of this is to see if the highest score for the main player will be better than the potential lowest score from the opponent.
                // // If at any case the score for the opponent becomes greater than the highest score for the main player, then further searching that path is unnecessary since choosing
                // // it will result in a disadvantage for the main player.
                alphaVal = nestedBestValue;
            }
        } else {
            // If not, then the lowest score for the opponent needs to be found.

            // Checks if the recursive function's returned value is less than the current minimumVal variable, or if the minimumVal variable is undefined.
            if (nestedBestValue < minimumVal || minimumVal == undefined) {
                // If either case is true, then set the new minimumVal to the returned value and set the tempMove to the bestMove variable, since it is currently the best move that can be made
                // to give the main player the best advantage possible.
                minimumVal = nestedBestValue;
                bestMove = tempMove;
            } 
            
            // Checks if the current Beta value is greater than the recursive function's returned value
            if (betaVal >= nestedBestValue || betaVal == undefined) {
                // If it is or if the betaVal is currently unset for the branch, update it with the returned value.
                // // In this case, since the opponent will likely choose the lowest score, relative to the main player gaining an advantage, then the lowest score for said branch will likely
                // // be what the opponent picks
                betaVal = nestedBestValue;
            }
        }

        // Checks if the alphaVal is greater than or equal to the betaVal
        if (alphaVal >= betaVal) {
            // If so, then this path is unlikely to ever be picked since it either has the opponent gaining a greater advantage or the main player gaining less of an advantage.
            // // In either case, both players will likely never choose this path so further searching it is unnecessary.
            break;
        }
    }

    // Checks if the value is based on the main player's turn or the opponent
    if (isMainPlayer) {
        // If it is for the main player, then return the highest score since the highest advantage is desired.
        return [bestMove, maximumVal];
    } else {
        // If it is for the opponent, then return the minimum score since the opponent will likely choose the score that proves the main player the smallest advantage possible.
        return [bestMove, minimumVal];
    }
}
