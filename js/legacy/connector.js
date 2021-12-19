const winnerName = document.getElementById("winner-name");
const winnerDisplay = document.getElementById("winner-display");
const drawDisplay = document.getElementById("draw-display");
const turnIndicatorColor = document.getElementById("turn-indicator-color");
const scoreDisplay = document.getElementById('scores-display')
const redScoreDisplay = document.getElementById("red-score");
const yellowScoreDisplay = document.getElementById("yellow-score");
const turnIndicator = document.getElementById("turn-indicator");
const redNameInput = document.getElementById('red-name');
const yellowNameInput = document.getElementById('yellow-name');
const redScoreName = document.getElementById('red-score-name');
const yellowScoreName = document.getElementById('yellow-score-name');

const resetButton = document.getElementById('new-round-button');
resetButton.addEventListener("click", resetGame)

const restartButton = document.getElementById('restart-button');
restartButton.addEventListener("click", restart)

const setNamesButton = document.getElementById('set-names-button');
setNamesButton.addEventListener("click", setNames)

// handles the closing of end game display
const closeEndGameDisplayButton = document.getElementsByClassName('close-endgame-display-button');
closeEndGameDisplayButton[0].addEventListener("click", closeEndGameDisplay)
closeEndGameDisplayButton[1].addEventListener("click", closeEndGameDisplay)

// Bind the click events for the grid.
for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
    for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
        const gridPosition = document.getElementById(`row-${rowIndex}-column-${columnIndex}`);
        gridPosition.addEventListener("click", positionClick.bind(null, rowIndex, columnIndex));
    }
}

// Clear down the elements drawn on the board.
function clearBoard() {
    for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
            document.getElementById(`row-${rowIndex}-column-${columnIndex}`).className = "column emptyCounter"
        }
    }
}

// Populate the grid with images based on the board state.
function drawBoard(board) {
    clearBoard();
    for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
            if (!board[rowIndex][columnIndex]) {
                continue;
            }
            document.getElementById(`row-${rowIndex}-column-${columnIndex}`).classList.add(board[rowIndex][columnIndex] + "Counter");
        }
    }
}

function setTurnIndicator(names) {
    turnIndicatorColor.innerText = redTurn ? `🔴 ${names.red.toUpperCase()}'S` : `🟡 ${names.yellow.toUpperCase()}'S`
}

function displayScores(scores) {
    scoreDisplay.innerHTML = `Red has won ${scores.red} times, yellow has won ${scores.yellow} times`
}

function renderScores(scores) {
    redScoreDisplay.innerText = scores.red;
    yellowScoreDisplay.innerText = scores.yellow;

}
function resetGame() {
    console.log("resetGame was called");
    resetDataForResetGame();
    clearBoard();
    resetGameUI();
}
function resetGameUI() {
    turnIndicator.style.display = "block";
    // sets the classes to d-none to hide popups (bootstrap classes)
    winnerDisplay.classList.add('d-none')
    drawDisplay.classList.add('d-none')
    setTurnIndicator()
}
function restart() {
    resetData()
    resetServerScores()
    // saveGame()
    location.reload()
}
function renderNames() {
    fetch(`http://localhost:3000/names`, { method: "GET" })
        .then(
            response =>
                response.json().then(
                    serverNames => {
                        redScoreName.innerText = serverNames.red;
                        yellowScoreName.innerText = serverNames.yellow;
                        setTurnIndicator(serverNames)
                    }
                )
        )
}

function setNames(e) {
    e.preventDefault()
    // names.red = redNameInput.value;
    // names.yellow = yellowNameInput.value;
    let namesData = {}

    fetch(`http://localhost:3000/names`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "red": redNameInput.value,
            "yellow": yellowNameInput.value
        })
    })
        .then(
            response =>
                response.json().then(
                    serverNames => {
                        console.log(serverNames)
                        names = serverNames;
                        saveGame();
                        renderNames();
                    }
                )
        )
}

function closeEndGameDisplay() {
    winnerDisplay.classList.add('d-none');
    drawDisplay.classList.add('d-none');
}
function positionClick(rowIndex, columnIndex, event) {

    if (!gameOver) {
        turnCount++
        gameBoard, redTurn = takeTurn(rowIndex, columnIndex, gameBoard);
        const board = gameBoard
        drawBoard(board);
        const winner = checkWinner();
        if (winner) {
            displayResult(winner)
        }
        setTurnIndicator()
    }
    return gameBoard, turnCount, gameOver, redTurn
}

function displayResult(winner, winnerDisplay, winnerName, draw, Display, names) {
    if (typeof winner !== "string" || !["red", "yellow", "nobody"].includes(winner)) {
        throw "Expecting 'checkWinner' to return null or one of the strings 'red', 'yellow' or 'nobody'. Actually received: " + winner;
    }
    // const turnIndicator = document.getElementById("turn-indicator");
    // turnIndicator.style.display = "none"

    if (winner === "red" || winner === "yellow") {
        winnerName.innerText = names[winner].toUpperCase();

        // winnerDisplay.style.display = "block";
        winnerDisplay.classList.remove('d-none')
    } else {

        // drawDisplay.style.display = "block";
        drawDisplay.classList.remove('d-none')
    }
}

function initialize() {
    gameBoard, gameOver, redTurn, turnCount, names = resetData()
    setTurnIndicator(names)
    scores.red = parseInt(myStorage.getItem('red-score'));
    scores.yellow = parseInt(myStorage.getItem('yellow-score'));
    // gameOver = myStorage.getItem('gameOver')
    if (myStorage.getItem('red-name') !== null && myStorage.getItem('yellow-name') !== null) {
        names.red = myStorage.getItem('red-name')
        names.yellow = myStorage.getItem('yellow-name')
    }
    renderNames()
    renderScores(scores)
}