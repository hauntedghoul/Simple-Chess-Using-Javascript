document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.querySelector("#gameboard");
    const playerDetails = document.querySelector("#player");
    const infoDisplay = document.querySelector("#info-display");
    const err = document.querySelector("#err");
    const gameModeSelect = document.getElementById("game-mode");
    const startGameBtn = document.getElementById("start-game");
    const width = 8;

    let playerTurn = 'black';
    playerDetails.textContent = 'black'; // Display initial player turn
    let gameEnded = false; // Flag to check if the game has ended

    // Default setup for Traditional Chess
    const traditionalStartPieces = [
        'Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook',
        'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn',
        'Rook', 'Knight', 'Bishop', 'King', 'Queen', 'Bishop', 'Knight', 'Rook'
    ];

    let startPieces = [...traditionalStartPieces];
    let draggedElement, startPositionId;

    // Function to generate a random Chess960 setup
    function generateChess960Setup() {
        const backRow = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'];
        let chess960BackRow = [...backRow];

        // Ensure bishops are on opposite colors
        const lightSquares = [0, 2, 4, 6];
        const darkSquares = [1, 3, 5, 7];
        chess960BackRow[lightSquares[Math.floor(Math.random() * 4)]] = 'Bishop';
        chess960BackRow[darkSquares[Math.floor(Math.random() * 4)]] = 'Bishop';

        // Place the King between rooks
        let availablePositions = chess960BackRow.map((_, index) => index).filter(i => chess960BackRow[i] !== 'Bishop');
        let rookPositions = [];
        while (rookPositions.length < 2) {
            let pos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
            if (!rookPositions.includes(pos)) rookPositions.push(pos);
        }
        chess960BackRow[rookPositions[0]] = 'Rook';
        chess960BackRow[rookPositions[1]] = 'Rook';

        // Fill remaining slots
        const remainingPieces = ['Knight', 'Knight', 'Queen', 'King'];
        for (let i = 0; i < chess960BackRow.length; i++) {
            if (chess960BackRow[i] === 'Bishop' || chess960BackRow[i] === 'Rook') continue;
            chess960BackRow[i] = remainingPieces.pop();
        }

        return [
            ...chess960BackRow,
            'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn',
            ...chess960BackRow.reverse()
        ];
    }

    window.createBoard = createBoard;
    window.isValidMove = isValidMove;
    window.dragStart = dragStart;
    window.dragDrop = dragDrop;
    window.declareWinner = declareWinner;

    startGameBtn.addEventListener('click', () => {
        gameEnded = false; // Reset the game ended flag
        const gameMode = gameModeSelect.value;
        if (gameMode === "chess960") {
            startPieces = generateChess960Setup();
        } else {
            startPieces = [...traditionalStartPieces];
        }
        createBoard();
    });

    function createBoard() {
        gameBoard.innerHTML = ''; // Clear previous board
        startPieces.forEach((piece, i) => {
            const square = document.createElement("div");
            square.classList.add("square");
            
            // Insert the SVG for the piece instead of the text
            if (piece) {
                const pieceElement = getPieceSVG(piece);
                square.innerHTML = pieceElement || ''; // Add the corresponding SVG element
            } else {
                square.innerHTML = ''; // Empty square if no piece
            }
    
            square.setAttribute("square-id", i);
    
            const firstChild = square.firstChild;
    
            // Ensure there is a piece inside the square and it's an element
            if (firstChild && firstChild.nodeType === 1) { // nodeType 1 means it's an element node
                firstChild.setAttribute('draggable', true);
    
                if (i < 16) {
                    firstChild.classList.add('black');
                } else if (i >= 48) {
                    firstChild.classList.add('white');
                }
            }
    
            const row = Math.floor((63 - i) / 8) + 1;
            square.classList.add((row % 2 === 0) ? (i % 2 === 0 ? "beige" : "brown") : (i % 2 === 0 ? "brown" : "beige"));
    
            gameBoard.append(square);
        });
    
        addDragAndDropHandlers();
    }
    
    function getPieceSVG(pieceName) {
        switch (pieceName) {
            case 'King':
                return King; // Returns the SVG for King from pieces.js
            case 'Queen':
                return Queen; // Returns the SVG for Queen from pieces.js
            case 'Rook':
                return Rook; // Add the SVG for Rook from pieces.js
            case 'Knight':
                return Knight; // Add the SVG for Knight from pieces.js
            case 'Bishop':
                return Bishop; // Add the SVG for Bishop from pieces.js
            case 'Pawn':
                return Pawn; // Add the SVG for Pawn from pieces.js
            default:
                return ''; // If no piece, return empty
        }
    }

    function addDragAndDropHandlers() {
        const allSquares = document.querySelectorAll(".square");

        allSquares.forEach(square => {
            square.addEventListener('dragstart', dragStart);
            square.addEventListener('dragover', dragOver);
            square.addEventListener('drop', dragDrop);
        });
    }

    function dragStart(e) {
        if (gameEnded) return; // Prevent dragging if the game has ended
        draggedElement = e.target;
        startPositionId = parseInt(e.target.parentNode.getAttribute('square-id'));

        const isWhitePiece = draggedElement.classList.contains('white');
        const isBlackPiece = draggedElement.classList.contains('black');

        if ((playerTurn === 'white' && !isWhitePiece) || (playerTurn === 'black' && !isBlackPiece)) {
            e.preventDefault();
            draggedElement = null;
        }
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragDrop(e) {
        if (gameEnded) return; // Prevent dropping if the game has ended
        const endPositionId = parseInt(e.target.getAttribute('square-id') || e.target.parentNode.getAttribute('square-id'));
        const endSquare = document.querySelector(`[square-id="${endPositionId}"]`);

        if (!draggedElement || !isValidMove(startPositionId, endPositionId)) return;

        const isWhitePiece = draggedElement.classList.contains('white');
        const isBlackPiece = draggedElement.classList.contains('black');

        if (endSquare && (endSquare.innerHTML === '' || (playerTurn === 'white' && endSquare.firstChild?.classList.contains('black')) || (playerTurn === 'black' && endSquare.firstChild?.classList.contains('white')))) {
            // Check if the move results in capturing a King
            if (endSquare.innerHTML.includes('id="king"')) {
                declareWinner(playerTurn);
                return;
            }

            // Move the piece
            endSquare.innerHTML = '';
            endSquare.appendChild(draggedElement);

            playerTurn = (playerTurn === 'black') ? 'white' : 'black';
            playerDetails.textContent = playerTurn;
        } else {
            err.textContent = 'Invalid Move!';
            setTimeout(() => { err.textContent = ''; }, 2000);
        }
    }

    function declareWinner(winner) {
        gameEnded = true; // Mark the game as ended
        const winningPlayer = (winner === 'black') ? 'Black' : 'White';
        infoDisplay.textContent = `${winningPlayer} wins! 🎉`;
    }

    function isValidMove(start, end) {
        const piece = startPieces[start];
        const startRow = Math.floor(start / 8);
        const startCol = start % 8;
        const endRow = Math.floor(end / 8);
        const endCol = end % 8;

        const rowDiff = Math.abs(endRow - startRow);
        const colDiff = Math.abs(endCol - startCol);

        if (draggedElement.id === 'pawn') {
            return (startCol === endCol && rowDiff === 1) || (colDiff === 1 && rowDiff === 1 && endSquare.innerHTML !== '');
        } else if (draggedElement.id === 'rook') {
            return startRow === endRow || startCol === endCol;
        } else if (draggedElement.id === 'bishop') {
            return rowDiff === colDiff;
        } else if (draggedElement.id === 'knight') {
            return rowDiff * colDiff === 2;
        } else if (draggedElement.id === 'queen') {
            return rowDiff === colDiff || startRow === endRow || startCol === endCol;
        } else if (draggedElement.id === 'king') {
            return rowDiff <= 1 && colDiff <= 1;
        }
        return false;
    }

    createBoard(); // Initialize the board
});


