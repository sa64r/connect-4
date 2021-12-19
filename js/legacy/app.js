let gameBoard = []
let gameOver;
let redTurn
let turnCount
let names = {}
let scores = {}
let myStorage = window.localStorage;
const numberOfRows = 6;
const numberOfColumns = 7;

function resetData() {
    gameBoard = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ]
    gameOver = false;
    redTurn = Math.random() > 0.5 ? true : false; //randomises who
    turnCount = 0;
    names = {
        red: "Red",
        yellow: "Yellow"
    }
    scores = {
        red: 0,
        yellow: 0
    }
}

function initialize() {
    resetData()
    setTurnIndicator()
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

function saveGame() {
    myStorage.setItem('red-score', scores.red)
    myStorage.setItem('yellow-score', scores.yellow)
    myStorage.setItem('red-name', names.red)
    myStorage.setItem('yellow-name', names.yellow)
}

function positionClick(rowIndex, columnIndex, event) {
    if (!gameOver) {
        turnCount++
        takeTurn(rowIndex, columnIndex);
        const board = gameBoard
        drawBoard(board);
        const winner = checkWinner();
        if (winner) {
            if (typeof winner !== "string" || !["red", "yellow", "nobody"].includes(winner)) {
                throw "Expecting 'checkWinner' to return null or one of the strings 'red', 'yellow' or 'nobody'. Actually received: " + winner;
            }
            // const turnIndicator = document.getElementById("turn-indicator");
            // turnIndicator.style.display = "none"

            if (winner === "red" || winner === "yellow") {
                const winnerName = document.getElementById("winner-name");
                winnerName.innerText = names[winner].toUpperCase();

                const winnerDisplay = document.getElementById("winner-display");
                // winnerDisplay.style.display = "block";
                winnerDisplay.classList.remove('d-none')
            } else {
                const drawDisplay = document.getElementById("draw-display");
                // drawDisplay.style.display = "block";
                drawDisplay.classList.remove('d-none')
            }
        }
        setTurnIndicator()
    }
}

function setTurnIndicator() {
    const turnIndicatorColor = document.getElementById("turn-indicator-color");
    turnIndicatorColor.innerText = redTurn ? `🔴 ${names.red.toUpperCase()}'S` : `🟡 ${names.yellow.toUpperCase()}'S`
}

function checkWinner() {
    for (let i = numberOfRows; i >= 0; i--) {
        // checks horizontal rows for wins
        if (i < numberOfRows) { //to ensure index out of bounds doesn't occurs
            let rowString = gameBoard[i][0] + gameBoard[i][1] + gameBoard[i][2] + gameBoard[i][3] + gameBoard[i][4] + gameBoard[i][5] + ""
            let winnerHorizontal = whoWon(rowString);
            if (winnerHorizontal === "red") {
                return "red"
            } else if (winnerHorizontal === "yellow") {
                return "yellow"
            }
        }

        // Checks for all vertical wins
        let columnString = gameBoard[0][i] + gameBoard[1][i] + gameBoard[2][i] + gameBoard[3][i] + gameBoard[4][i] + gameBoard[5][i] + "";
        let winnerVertical = whoWon(columnString);
        if (winnerVertical === "red") {
            return "red"
        } else if (winnerVertical === "yellow") {
            return "yellow"
        }
    }

    // Checks the diagonal wins
    let diagonalWinner = null
    for (let i = 0; i < 3; i++) {
        if (diagonalWinner === null) {
            diagonalWinner = whoWon(gameBoard[0 + i][0] + gameBoard[1 + i][1] + gameBoard[2 + i][2] + gameBoard[3 + i][3] + (4 + i < numberOfRows ? gameBoard[4 + i][4] : "") + (5 + i < numberOfRows ? gameBoard[5 + i][5] : "") + "")
        }
        if (diagonalWinner === null) {
            diagonalWinner = whoWon(gameBoard[0][1 + i] + gameBoard[1][2 + i] + gameBoard[2][3 + i] + gameBoard[3][4 + i] + gameBoard[4][5 + i] + gameBoard[5][6 + i] + "")
        }
        if (diagonalWinner === null) {
            diagonalWinner = whoWon(gameBoard[5][1 + i] + gameBoard[4][2 + i] + gameBoard[3][3 + i] + gameBoard[2][4 + i] + (5 + i < numberOfColumns ? gameBoard[1][5 + i] : "") + (6 + i < numberOfColumns ? gameBoard[0][6 + i] : "") + "")
        }
        if (diagonalWinner === null) {
            diagonalWinner = whoWon(gameBoard[5 - i][0] + gameBoard[4 - i][1] + gameBoard[3 - i][2] + (2 - i >= 0 ? gameBoard[2 - i][3] : "") + (1 - i >= 0 ? gameBoard[1 - i][4] : "") + (0 - i >= 0 ? gameBoard[0 - i][5] : "") + "")
        }
    }
    if (diagonalWinner !== null) {
        return diagonalWinner
    }

    if (turnCount === numberOfColumns * numberOfRows) {
        gameOver = true
        return "nobody"
    }
}

function checkWinnerNew() { // THIS IS ME STEALING JAKE's CODE 🙂 
    let check = ""

    // Horizontals
    for (let j = 0; j < numberOfRows; j++) {
        for (let k = 0; k < numberOfColumns; k++) {
            check += state.board[j][k]
        }
        check += "\n"
    }

    // Verticals
    for (let j = 0; j < numberOfColumns; j++) {
        for (let k = 0; k < numberOfRows; k++) {
            check += state.board[k][j]
        }
        check += "\n"
    }

    check += diagonalCheck(gameBoard, true)
    check += diagonalCheck(gameBoard, false)

    // Checks mega-string named check against regex 
    let team_1_check = state.team_1.repeat(state.connect_length)
    let team_2_check = state.team_2.repeat(state.connect_length)
    let test = `(${team_1_check})|(${team_2_check})`

    const expression = new RegExp(test)
    let match = check.match(expression)

    // TODO: Need to add a "nobody wins" condition

    if (match !== null) {
        result = match[0] === team_1_check ? state.team_1 + "!" : state.team_2 + "!"
        console.log(result)
        winnerDisplay.style.display = "block"
        winnerName.innerHTML = result
    } else {
        console.log("No winner")
    }
}

function whoWon(winnerString) {
    // checks if the winning substrings exist 
    if (winnerString.includes('redredredred')) {
        gameOver = true
        scores.red = scores.red + 1
        renderScores(scores)
        saveGame()
        fetch(`http://localhost:3000/winner/red`, { method: "POST" })
            .then(
                response =>
                    response.json().then(
                        serverScores => {
                            console.log(serverScores)
                            // displayScores(scores)
                            renderScores(serverScores)
                            scores = serverScores
                            saveGame()
                        }
                    )
            )

        return "red"
    } else if (winnerString.includes('yellowyellowyellowyellow')) {
        gameOver = true
        scores.yellow = scores.yellow + 1
        renderScores(scores)
        saveGame()
        fetch(`http://localhost:3000/winner/yellow`, { method: "POST" })
            .then(
                response =>
                    response.json().then(
                        serverScores => {
                            console.log(serverScores)
                            // displayScores(scores)
                            renderScores(serverScores)
                            scores = serverScores
                            saveGame()
                        }
                    )
            )

        return "yellow"
    }

    return null
}

function displayScores(scores) {
    const scoreDisplay = document.getElementById('scores-display')
    scoreDisplay.innerHTML = `Red has won ${scores.red} times, yellow has won ${scores.yellow} times`
}

function renderScores(scores) {
    // updates the scores in the table
    const redScoreDisplay = document.getElementById("red-score");
    redScoreDisplay.innerText = scores.red;

    const yellowScoreDisplay = document.getElementById("yellow-score");
    yellowScoreDisplay.innerText = scores.yellow;
}

function takeTurn(row, column) {
    let debugWins = false; //use to check if wins work
    console.log("takeTurn was called with row: " + row + ", column:" + column);
    if (!debugWins) {
        if (redTurn) {
            gameBoard[dropCounter(column)][column] = "red"
            redTurn = false
        } else {
            gameBoard[dropCounter(column)][column] = "yellow"
            redTurn = true
        }
    } else {
        if (redTurn) {
            gameBoard[row][column] = "red"
            redTurn = false
        } else {
            gameBoard[row][column] = "yellow"
            redTurn = true
        }
    }

}
// ensures the new counter goes to the lowest point in the column
function dropCounter(column) {
    for (let row = 5; row >= 0; row--) {
        if (gameBoard[row][column] === null) {
            return row
        }
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

function resetGame() {
    console.log("resetGame was called");
    gameOver = false
    turnCount = 0;
    gameBoard = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ];
    clearBoard();
    const winnerDisplay = document.getElementById("winner-display");
    const drawDisplay = document.getElementById("draw-display");
    const turnIndicator = document.getElementById("turn-indicator");
    turnIndicator.style.display = "block";

    // sets the classes to d-none to hide popups (bootstrap classes)
    winnerDisplay.classList.add('d-none')
    drawDisplay.classList.add('d-none')

    setTurnIndicator()
}

function restart() {
    resetData()
    saveGame()
    location.reload()
}

function setNames(e) {
    e.preventDefault()

    const redNameInput = document.getElementById('red-name');
    const yellowNameInput = document.getElementById('yellow-name');

    names.red = redNameInput.value;
    names.yellow = yellowNameInput.value;
    saveGame();
    renderNames();
}

function renderNames() {
    const redScoreName = document.getElementById('red-score-name');
    const yellowScoreName = document.getElementById('yellow-score-name');

    redScoreName.innerText = names.red;
    yellowScoreName.innerText = names.yellow;

    setTurnIndicator()
}

function closeEndGameDisplay() {
    const winnerDisplay = document.getElementById("winner-display");
    const drawDisplay = document.getElementById("draw-display");

    winnerDisplay.classList.add('d-none');
    drawDisplay.classList.add('d-none');
}

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