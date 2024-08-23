import { evaluateBoard } from "./Evaluation.js";

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
export function miniMaxCalculation(currentNodeDepth, possibleMoves, isMainPlayer, currentGame, sum) {
    // Checks the current depth limit and prevents the algorithm from going beyond this limit, currently set to 4.
    if (currentNodeDepth <= 2) {
        let possibleScores = [];

        // Iterates through the possible moves and gathers the possible scores the move can result in.
        for (const index in possibleMoves) {
            possibleScores.push(evaluateBoard(possibleMoves[index], sum, isMainPlayer ? 'b' : 'w'));
        }

        // Initializes a variable to store the selected index of the either highest score or lowest score.
        let selectedIndex;
        // Checks if the score is for the main player or the opponent.
        if (isMainPlayer) {
            // Maps through the possible scores array and saves the highest possible score.
            possibleScores.map((value, index) => {
                if (value > possibleScores[selectedIndex] || selectedIndex == undefined) {
                    selectedIndex = index;
                } 
            })
        } else {
            // Maps through the possible scores array and saves the lowest possible score.
            possibleScores.map((value, index) => {
                if (value <= possibleScores[selectedIndex] || selectedIndex == undefined) {
                    selectedIndex = index;
                } 
            })
        }

        // Makes the best possible move in the game and then calls the recursive function to see if the current move will truly result in the best move possible.
        currentGame.move(possibleMoves[selectedIndex]);
        miniMaxCalculation(currentNodeDepth + 1, currentGame.moves({ verbose: true }), isMainPlayer ? false : true, currentGame, possibleScores[selectedIndex]);
        
        // Undoes the move
        currentGame.undo();

        // Checks if the current node is the root node and then return the best possible move.
        if (currentNodeDepth == 0) {
            return possibleMoves[selectedIndex];
        }
    }
}

// Continue working on the recursive call, as of now it only returns the best possible move based on the first score, I
// need to move the recursive call to have it made as it iterates through the possible moves list and then it should base
// the best possible move off of its child elements.