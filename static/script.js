const socket = io();
let currentPlayer = 'player1';
let gameStarted = true; // Always true for single/hot-seat play
let turn = 'player1';
let allowExtraTurn = false;

// Board emojis
const EMOJIS = {
    terrorist: '😈',
    hospital: '🏥',
    knife: '🔪',
    cave: '🕳️',
    trap: '⚠️',
    explosive: '💣'
};

// Store board data for emoji rendering
let boardData = null;

// Initialize game board
function initializeBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    for (let i = 100; i > 0; i--) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.id = `tile-${i}`;
        tile.textContent = i;
        board.appendChild(tile);
    }
}

// Add emojis to tiles
function decorateTiles(gameState) {
    boardData = gameState.board;
    for (let i = 1; i <= 100; i++) {
        const tile = document.getElementById(`tile-${i}`);
        tile.className = 'tile'; // reset
        let emoji = '';
        let isSpecial = false;
        if (boardData.terrorists.includes(i)) {
            tile.classList.add('terrorist');
            emoji += EMOJIS.terrorist;
            isSpecial = true;
        }
        if (boardData.hospitals.includes(i)) {
            tile.classList.add('hospital');
            emoji += EMOJIS.hospital;
            isSpecial = true;
        }
        if (boardData.knives.includes(i)) {
            tile.classList.add('knife');
            emoji += EMOJIS.knife;
            isSpecial = true;
        }
        if (boardData.caves.includes(i)) {
            tile.classList.add('cave');
            emoji += EMOJIS.cave;
            isSpecial = true;
        }
        if (boardData.traps.includes(i)) {
            tile.classList.add('trap');
            emoji += EMOJIS.trap;
            isSpecial = true;
        }
        if (boardData.explosives.includes(i)) {
            tile.classList.add('explosive');
            emoji += EMOJIS.explosive;
            isSpecial = true;
        }
        // Only show emoji (no number) for special tiles, unless a player is on it
        tile.innerHTML = isSpecial ? `<div class='big-emoji'>${emoji}</div>` : i;
    }
}

// Update board state
function updateBoard(gameState) {
    decorateTiles(gameState);
    // Show player positions
    Object.entries(gameState.players).forEach(([playerId, player]) => {
        const tile = document.getElementById(`tile-${player.position}`);
        if (tile && player.position > 0) {
            const playerEmoji = document.createElement('div');
            playerEmoji.className = 'player-emoji';
            playerEmoji.textContent = playerId === 'player1' ? '🧑‍🚀' : '🧑‍💼';
            tile.innerHTML = '';
            tile.appendChild(playerEmoji);
        }
    });
    // Update knife counts
    document.getElementById('player1-knives').textContent = gameState.players.player1?.knives || 0;
    document.getElementById('player2-knives').textContent = gameState.players.player2?.knives || 0;
}

// Show game message
function showMessage(message, duration = 3000) {
    const messageEl = document.getElementById('game-message');
    messageEl.textContent = message;
    messageEl.classList.add('show');
    setTimeout(() => messageEl.classList.remove('show'), duration);
}

// Socket event handlers
socket.on('connect', () => {
    socket.emit('join_game', { player_id: 'player1' });
    socket.emit('join_game', { player_id: 'player2' });
});

socket.on('game_state', (gameState) => {
    updateBoard(gameState);
});

socket.on('game_start', () => {
    gameStarted = true;
    showMessage('Game started! Player 1 goes first.');
});

socket.on('game_over', (data) => {
    showMessage(`Game Over! ${data.winner === 'player1' ? 'Player 1' : 'Player 2'} wins!`, 5000);
    gameStarted = false;
});

socket.on('extra_turn', (data) => {
    if (data.player === turn) {
        allowExtraTurn = true;
        showMessage('You rolled a 6! Roll again!');
    }
});

// Event listeners
document.getElementById('roll-dice').addEventListener('click', () => {
    if (!gameStarted) {
        showMessage('Game is over. Refresh to play again.');
        return;
    }
    socket.emit('roll_dice', { player_id: turn });
    if (!allowExtraTurn) {
        turn = turn === 'player1' ? 'player2' : 'player1';
        showMessage(`${turn === 'player1' ? 'Player 1' : 'Player 2'}'s turn!`);
    } else {
        allowExtraTurn = false;
    }
});

// Initialize the game
initializeBoard(); 