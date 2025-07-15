document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const modeSelectionScreen = document.getElementById('mode-selection-screen');
    const gameContainer = document.getElementById('game-container');
    const singlePlayerBtn = document.getElementById('singlePlayerBtn');
    const duoPlayerBtn = document.getElementById('duoPlayerBtn');
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('game-status');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const resultMessageElement = document.getElementById('result-message');
    const restartBtn = document.getElementById('restart-btn');

    // --- Game State ---
    let gameState = {
        board: Array(9).fill(null),
        currentPlayer: 'x',
        gameMode: null, // 'single' or 'duo'
        isGameActive: false,
    };

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // --- Game Logic ---
    const startGame = (mode) => {
        gameState.gameMode = mode;
        gameState.board.fill(null);
        gameState.currentPlayer = 'x';
        gameState.isGameActive = true;

        // Update UI
        modeSelectionScreen.classList.add('hidden');
        gameOverOverlay.classList.add('hidden');
        gameContainer.classList.remove('hidden');

        if (mode === 'single') {
            statusElement.textContent = "Your turn (X)";
        } else {
            statusElement.textContent = "Player X's Turn";
        }

        renderBoard();
    };

    const renderBoard = () => {
        boardElement.innerHTML = '';
        gameState.board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('board__tile');
            if (cell) {
                cellElement.classList.add(cell);
                cellElement.textContent = cell.toUpperCase();
            }
            cellElement.dataset.index = index;
            cellElement.addEventListener('click', handleCellClick);
            boardElement.appendChild(cellElement);
        });
    };

    const handleCellClick = (event) => {
        const clickedCellIndex = parseInt(event.target.dataset.index);

        // Ignore clicks if game is over, cell is taken, or it's the AI's turn
        if (!gameState.isGameActive || gameState.board[clickedCellIndex] ||
            (gameState.gameMode === 'single' && gameState.currentPlayer === 'o')) {
            return;
        }

        makeMove(clickedCellIndex);
    };

    const makeMove = (index) => {
        if (!gameState.isGameActive || gameState.board[index]) return;

        gameState.board[index] = gameState.currentPlayer;
        renderBoard();

        if (checkWin()) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            switchPlayer();
        }
    };

    const switchPlayer = () => {
        gameState.currentPlayer = gameState.currentPlayer === 'x' ? 'o' : 'x';

        if (gameState.gameMode === 'duo') {
            statusElement.textContent = `Player ${gameState.currentPlayer.toUpperCase()}'s Turn`;
        } else {
            statusElement.textContent = gameState.currentPlayer === 'x' ? "Your turn (X)" : "Computer is thinking...";
            if (gameState.currentPlayer === 'o') {
                // AI's turn
                setTimeout(computerMove, 700);
            }
        }
    };

    const computerMove = () => {
        if (!gameState.isGameActive) return;

        // Basic AI: find all empty spots and pick one at random
        const emptyCells = gameState.board
            .map((cell, index) => (cell === null ? index : null))
            .filter(val => val !== null);

        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const move = emptyCells[randomIndex];
            makeMove(move);
        }
    };

    const checkWin = () => {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return gameState.board[index] === gameState.currentPlayer;
            });
        });
    };

    const isDraw = () => {
        return gameState.board.every(cell => cell !== null);
    };

    const endGame = (draw) => {
        gameState.isGameActive = false;
        gameOverOverlay.classList.remove('hidden');

        if (draw) {
            resultMessageElement.textContent = "It's a Draw!";
        } else {
            if (gameState.gameMode === 'single') {
                resultMessageElement.textContent = gameState.currentPlayer === 'x' ? "You Win!" : "Computer Wins!";
            } else {
                resultMessageElement.textContent = `Player ${gameState.currentPlayer.toUpperCase()} Wins!`;
            }
        }
    };

    const resetToMenu = () => {
        gameContainer.classList.add('hidden');
        gameOverOverlay.classList.add('hidden');
        modeSelectionScreen.classList.remove('hidden');
    }

    // --- Event Listeners ---
    singlePlayerBtn.addEventListener('click', () => startGame('single'));
    duoPlayerBtn.addEventListener('click', () => startGame('duo'));
    restartBtn.addEventListener('click', resetToMenu);
});