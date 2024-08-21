import { Chess } from "../node_modules/chess.js/dist/esm/chess.js"

export function playerVsComputer(playSpeed) {
    let currentBoard = null;
    let currentGame = new Chess();
    let speed = playSpeed;

    function onDragStart (source, piece, position, orientation) {
        // Checks if the game is over to prevent moving the pieces.
        if (currentGame.isGameOver()) return false;

        if (piece.search(/^b/) !== -1) return false;
    }

    function makeRandomMove() {
        let possibleMoves = currentGame.moves();

        if (possibleMoves.length === 0) return;

        let randomIndex = Math.floor(Math.random() * possibleMoves.length);
        currentGame.move(possibleMoves[randomIndex]);
        currentBoard.position(currentGame.fen());
    }

    function onDrop (source, target) {
        // Checks if the move is viable.
        try {
            let move = currentGame.move({
                from: source,
                to: target,
                promotion: 'q'
            })

            // make random legal move for npc
            setTimeout(makeRandomMove, playSpeed);
        } catch {
            console.log('invalidMove')
            return 'snapback';
        }   
    }

    function onSnapEnd() {
        currentBoard.position(currentGame.fen());
    };

    let config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    }

    currentBoard = Chessboard('mainBoard', config);
};