export function checkGame(currentGame) {
    if (currentGame.isInsufficientMaterial()) {
        return 'Insufficient Material';
    } else if (currentGame.isCheckmate()) {
        return 'CheckMate';
    } else if (currentGame.isDraw()) {
        return 'Draw';
    } else if (currentGame.isStalemate()) {
        return 'StaleMate';
    } else if (currentGame.isThreefoldRepetition()) {
        return 'ThreeFold'
    } else if (currentGame.isGameOver()) {
        return 'Game Over';
    } else {
        return false;
    }
}