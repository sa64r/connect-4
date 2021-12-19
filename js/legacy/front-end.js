const port = 3000;

const winnerName = document.getElementById('winner-name');
const winnerDisplay = document.getElementById('winner-display');
const drawDisplay = document.getElementById('draw-display');
const turnIndicatorColor = document.getElementById('turn-indicator-color');
// const scoreDisplay = document.getElementById('scores-display');
const redScoreDisplay = document.getElementById('red-score');
const yellowScoreDisplay = document.getElementById('yellow-score');
// const turnIndicator = document.getElementById('turn-indicator');
const redNameInput = document.getElementById('red-name');
const yellowNameInput = document.getElementById('yellow-name');
const redScoreName = document.getElementById('red-score-name');
const yellowScoreName = document.getElementById('yellow-score-name');
const resetButton = document.getElementById('new-round-button');
const restartButton = document.getElementById('restart-button');
const setNamesButton = document.getElementById('set-names-button');
// handles the closing of end game display
const closeEndGameDisplayButton = document.getElementsByClassName('close-endgame-display-button');

let gameState = { // move state to server side
    gameBoard: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ],
    gameOver: false,
    redTurn: true,
    turnCount: 0,
    playerNames: {
        red: 'Red',
        yellow: 'Yellow',
    },
    scores: {
        red: 0,
        yellow: 0,
    },
    winner: '',
    numberOfRows: 6,
    numberOfColumns: 7,
};

// function displayScores() {
//     fetch(`http://localhost:${port}/game/scores`, {
//         method: 'GET',
//     })
//         .then(
//             (response) => response.json().then(
//                 (scores) => {
//                     redScoreDisplay.innerText = scores.red;
//                     yellowScoreDisplay.innerText = scores.yellow;
//                 },
//             ),
//         );
// }

function saveGame() {
    const myStorage = window.localStorage;
    myStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGame() {
    const myStorage = window.localStorage;
    if (myStorage.getItem('gameState')) {
        gameState = JSON.parse(myStorage.getItem('gameState'));
    } else {
        saveGame();
        loadGame();
    }
}

function displayScores() {
    redScoreDisplay.innerText = gameState.scores.red;
    yellowScoreDisplay.innerText = gameState.scores.yellow;
}

function displayWinner(winner, playerNames) {
    winnerName.innerText = playerNames[winner].toUpperCase();
    winnerDisplay.classList.remove('d-none');
    displayScores();
}

function displayDraw() {
    drawDisplay.classList.remove('d-none');
}

// function getOutcome() { // handles the events that proceed after a winner has been found
//     fetch(`http://localhost:${port}/game/winner`, {
//         method: 'GET',
//     })
//         .then(
//             (response) => response.json().then(
//                 (winnerInfo) => {
//                     const { winner, playerNames } = winnerInfo;
//                     if (winner) {
//                         if (winner !== 'nobody') {
//                             displayWinner(winner, playerNames);
//                         } else {
//                             displayDraw();
//                         }
//                     }
//                 },
//             ),
//         );
// }

function getOutcome() { // handles the events that proceed after a winner has been found
    const { winner } = gameState;
    if (winner) {
        if (winner !== 'nobody') {
            displayWinner(winner, gameState.playerNames);
        } else {
            displayDraw();
        }
    }
}

function closeDisplayOutcome() {
    winnerDisplay.classList.add('d-none');
    drawDisplay.classList.add('d-none');
}

// function displayTurnIndicator() {
//     fetch(`http://localhost:${port}/game/turn`, {
//         method: 'GET',
//     })
//         .then(
//             (response) => response.json().then(
//                 (turn) => {
//                     const { redTurn, playerNames } = turn;
//                     turnIndicatorColor.innerText = redTurn ? `🔴 ${playerNames.red.toUpperCase()}'S` : `🟡 ${playerNames.yellow.toUpperCase()}'S`;
//                 },
//             ),
//         );
// }
function displayTurnIndicator() {
    turnIndicatorColor.innerText = gameState.redTurn ? `🔴 ${gameState.playerNames.red.toUpperCase()}'S` : `🟡 ${gameState.playerNames.yellow.toUpperCase()}'S`;
}

// function displayNames() {
//     // console.log('display names called');
//     fetch(`http://localhost:${port}/game/names`, {
//         method: 'GET',
//     })
//         .then(
//             (response) => response.json().then(
//                 (names) => {
//                     // console.log(names)
//                     redScoreName.innerText = names.red;
//                     yellowScoreName.innerText = names.yellow;
//                 },
//             ),
//         );
// }
function displayNames() {
    // console.log('display names called');

    redScoreName.innerText = gameState.playerNames.red;
    yellowScoreName.innerText = gameState.playerNames.yellow;
}

// function updateNames(e) {
//     e.preventDefault();

//     fetch(`http://localhost:${port}/game/names`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             red: redNameInput.value,
//             yellow: yellowNameInput.value,
//         }),
//     })
//         .then(
//             displayNames(),
//             displayTurnIndicator(),
//         );
// }

function updateNames(e) {
    e.preventDefault();
    gameState.playerNames.red = redNameInput.value;
    gameState.playerNames.yellow = yellowNameInput.value;
    displayNames();
    displayTurnIndicator();
}

// Clear down the elements drawn on the board.
function clearBoard(numberOfRows, numberOfColumns) {
    for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
            document.getElementById(`row-${rowIndex}-column-${columnIndex}`).className = 'column emptyCounter';
        }
    }
}

// Populate the grid with images based on the board state.
function drawBoard(board, numberOfRows, numberOfColumns) {
    clearBoard(numberOfRows, numberOfColumns);
    for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
            if (!board[rowIndex][columnIndex]) {
                continue;
            }
            document.getElementById(`row-${rowIndex}-column-${columnIndex}`).classList.add(`${board[rowIndex][columnIndex]}Counter`);
        }
    }
}

// eslint-disable-next-line no-unused-vars
// function initialize() { // runs when webpage is loaded
//     fetch(`http://localhost:${port}/game`, {
//         method: 'GET',
//     })
//         .then(
//             (response) => response.json().then(
//                 (gameData) => {
//                     drawBoard(gameData.gameBoard, gameData.numberOfRows, gameData.numberOfColumns);
//                     getOutcome();
//                     displayScores();
//                     displayNames();
//                     displayTurnIndicator();
//                 },
//             ),
//         );
// }

function initialize() { // runs when webpage is loaded
    loadGame();
    drawBoard(gameState.gameBoard, gameState.numberOfRows, gameState.numberOfColumns);
    getOutcome();
    displayScores();
    displayNames();
    displayTurnIndicator();
}

function positionClick(rowIndex, columnIndex) {
    fetch(`http://localhost:${port}/game/move`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            rowIndex,
            columnIndex,
            gameState,
        }),
    })
        .then(
            (response) => response.json().then(
                (gameData) => {
                    gameState = gameData;
                    saveGame();
                    drawBoard(gameData.gameBoard, gameData.numberOfRows, gameData.numberOfColumns);
                    displayTurnIndicator();
                    getOutcome();
                },
            ),
        );
}

// function resetGame() { // new game (retains scores)
//     fetch(`http://localhost:${port}/game`, {
//         method: 'PUT',
//     })
//         .then(
//             (response) => response.json().then(
//                 (gameData) => {
//                     gameState = gameData
//                     drawBoard(gameData.gameBoard, gameData.numberOfRows, gameData.numberOfColumns);
//                     displayTurnIndicator();
//                 },
//             ),
//         );
// }

function resetGame() { // new game (retains scores)
    gameState.gameBoard = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ];
    gameState.gameOver = false;
    gameState.turnCount = 0;
    gameState.winner = '';
    drawBoard(gameState.gameBoard, gameState.numberOfRows, gameState.numberOfColumns);
    displayTurnIndicator();
    saveGame();
}

// function restartGame() { // deletes all game history
//     fetch(`http://localhost:${port}/game`, {
//         method: 'DELETE',
//     })
//         .then(
//             (response) => response.json().then(
//                 (gameData) => {
//                     gameState = gameData
//                     drawBoard(gameData.gameBoard, gameData.numberOfRows, gameData.numberOfColumns);
//                     displayTurnIndicator();
//                     displayScores();
//                     displayNames();
//                 },
//             ),
//         );
// }

function restartGame() { // deletes all game history
    gameState.gameBoard = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ];
    gameState.gameOver = false;
    gameState.turnCount = 0;
    gameState.redTurn = Math.random() > 0.5;
    gameState.playerNames = {
        red: 'Red',
        yellow: 'Yellow',
    };
    gameState.scores = {
        red: 0,
        yellow: 0,
    };
    gameState.winner = '';

    drawBoard(gameState.gameBoard, gameState.numberOfRows, gameState.numberOfColumns);
    displayTurnIndicator();
    displayScores();
    displayNames();
    saveGame();
}

setNamesButton.addEventListener('click', updateNames);
restartButton.addEventListener('click', restartGame);
resetButton.addEventListener('click', resetGame);
closeEndGameDisplayButton[0].addEventListener('click', closeDisplayOutcome);
closeEndGameDisplayButton[1].addEventListener('click', closeDisplayOutcome);

// Bind the click events for the grid.
for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
    for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
        const gridPosition = document.getElementById(`row-${rowIndex}-column-${columnIndex}`);
        gridPosition.addEventListener('click', positionClick.bind(null, rowIndex, columnIndex));
    }
}
