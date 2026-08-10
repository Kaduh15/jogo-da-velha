(() => {
  'use strict';

  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const cells = Array.from(document.querySelectorAll('.cell'));
  const board = document.getElementById('board');
  const status = document.getElementById('status');
  const statusPlayer = document.getElementById('statusPlayer');
  const restartBtn = document.getElementById('restartBtn');
  const resetScoreBtn = document.getElementById('resetScoreBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalBtn = document.getElementById('modalBtn');

  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreDrawsEl = document.getElementById('scoreDraws');

  let boardState = Array(9).fill('');
  let currentPlayer = 'X';
  let gameActive = true;
  let mode = 'pvp';
  let aiThinking = false;
  let score = { X: 0, O: 0, draws: 0 };

  const modeButtons = document.querySelectorAll('.mode-btn');

  function renderScore() {
    scoreXEl.textContent = score.X;
    scoreOEl.textContent = score.O;
    scoreDrawsEl.textContent = score.draws;
  }

  function renderTurnStatus() {
    const klass = currentPlayer === 'X' ? 'x' : 'o';
    const label =
      mode === 'pvc' && currentPlayer === 'O'
        ? 'Computador'
        : 'Jogador';
    statusPlayer.className = `status-player ${klass}`;
    statusPlayer.textContent = label;
    status.textContent = '';
    status.append('É a vez de ');
    status.append(statusPlayer);
  }

  function renderBoard() {
    cells.forEach((cell, i) => {
      cell.textContent = boardState[i];
      cell.className = 'cell ' + (boardState[i] ? boardState[i].toLowerCase() : '');
    });
  }

  function checkWinner(state) {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (state[a] && state[a] === state[b] && state[a] === state[c]) {
        return { winner: state[a], line };
      }
    }
    return null;
  }

  function highlightWin(line) {
    line.forEach((index) => {
      cells[index].classList.add('win', 'disabled');
    });
    cells.forEach((cell, i) => {
      if (!line.includes(i)) cell.classList.add('disabled');
    });
  }

  function endGame(result) {
    gameActive = false;
    if (result && result.winner) {
      score[result.winner]++;
      renderScore();
      highlightWin(result.line);
      const name =
        mode === 'pvc' && result.winner === 'O' ? 'Computador' : 'Jogador ' + result.winner;
      status.textContent = '';
      status.style.background = result.winner === 'X'
        ? 'rgba(255, 107, 107, 0.35)'
        : 'rgba(72, 219, 251, 0.35)';
      status.style.border = result.winner === 'X'
        ? '2px solid rgba(255, 107, 107, 0.6)'
        : '2px solid rgba(72, 219, 251, 0.6)';
      const badge = document.createElement('span');
      badge.className = `status-player ${result.winner.toLowerCase()}`;
      badge.textContent = name;
      status.append(badge);
      status.append(' venceu! 🎉');
      showModal(
        result.winner === 'X' ? '❌' : '⭕',
        name + ' venceu!',
        'Partida concluída. Jogar novamente?'
      );
    } else {
      score.draws++;
      renderScore();
      cells.forEach((cell) => cell.classList.add('disabled'));
      status.textContent = 'Empate! 🤝';
      status.style.background = 'rgba(254, 202, 87, 0.35)';
      status.style.border = '2px solid rgba(254, 202, 87, 0.6)';
      showModal('🤝', 'Empate!', 'Ninguém venceu desta vez. Jogar novamente?');
    }
  }

  function showModal(icon, title, text) {
    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalText.textContent = text;
    modalOverlay.classList.add('show');
  }

  function hideModal() {
    modalOverlay.classList.remove('show');
  }

  function placeMark(index) {
    if (!gameActive || aiThinking || boardState[index]) return;

    boardState[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer.toLowerCase(), 'pop', 'disabled');

    const result = checkWinner(boardState);
    if (result) {
      endGame(result);
      return;
    }

    if (!boardState.includes('')) {
      endGame(null);
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    renderTurnStatus();

    if (mode === 'pvc' && currentPlayer === 'O' && gameActive) {
      setTimeout(computerMove, 450);
    }
  }

  function getAvailableMoves(state) {
    return state
      .map((value, index) => (value === '' ? index : -1))
      .filter((index) => index !== -1);
  }

  function computerMove() {
    aiThinking = true;
    board.classList.add('disabled');

    const index = findBestMove(boardState.slice(), 'O');
    aiThinking = false;
    board.classList.remove('disabled');
    placeMark(index);
  }

  function findBestMove(state, ai) {
    const human = ai === 'X' ? 'O' : 'X';
    const available = getAvailableMoves(state);

    const winner = checkWinner(state);
    if (winner) {
      return winner.winner === ai ? 10 : -10;
    }
    if (available.length === 0) return 0;

    const scores = [];
    for (const move of available) {
      state[move] = ai;
      scores.push({ move, score: minimax(state, human, ai) });
      state[move] = '';
    }

    const best = scores.sort((a, b) => b.score - a.score)[0];
    return best.move;
  }

  function minimax(state, player, ai) {
    const available = getAvailableMoves(state);
    const winner = checkWinner(state);

    if (winner) {
      return winner.winner === ai ? 10 : -10;
    }
    if (available.length === 0) return 0;

    const scores = [];
    for (const move of available) {
      state[move] = player;
      scores.push(minimax(state, player === 'X' ? 'O' : 'X', ai));
      state[move] = '';
    }

    return player === ai ? Math.max(...scores) : Math.min(...scores);
  }

  function handleCellClick(e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    if (mode === 'pvc' && currentPlayer === 'O') return;
    placeMark(Number(cell.dataset.index));
  }

  function startNewGame() {
    boardState = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    aiThinking = false;
    status.style.background = '';
    status.style.border = '';

    cells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'cell';
    });

    renderTurnStatus();
    hideModal();
  }

  function resetScore() {
    score = { X: 0, O: 0, draws: 0 };
    renderScore();
    startNewGame();
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.mode;
      startNewGame();
    });
  });

  board.addEventListener('click', handleCellClick);
  restartBtn.addEventListener('click', startNewGame);
  resetScoreBtn.addEventListener('click', resetScore);
  modalBtn.addEventListener('click', startNewGame);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) startNewGame();
  });

  renderScore();
  renderTurnStatus();
  renderBoard();
})();
