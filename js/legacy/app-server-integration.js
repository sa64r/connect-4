let gameBoard = []
let gameOver;
let redTurn
let turnCount
let names = {}
let scores = {}
let myStorage = window.localStorage;
const numberOfRows = 6;
const numberOfColumns = 7;

function resetData(gameBoard, gameOver, redTurn, turnCount, names) {
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
    // scores = {
    //     red: 0,
    //     yellow: 0
    // }
    return gameBoard, gameOver, redTurn, turnCount, names
}

function resetServerScores() {
    fetch(`http://localhost:3000/scores`, { method: "DELETE" })
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
}

function saveGame() {
    myStorage.setItem('red-score', scores.red)
    myStorage.setItem('yellow-score', scores.yellow)
    myStorage.setItem('red-name', names.red)
    myStorage.setItem('yellow-name', names.yellow)
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

function whoWon(winnerString) {
    // checks if the winning substrings exist 
    if (winnerString.includes('redredredred')) {
        gameOver = true
        scores.red = scores.red + 1
        renderScores(scores)
        saveGame()
        fetch(`http://localhost:3000/scores/red`, { method: "POST" })
            .then(
                response =>
                    response.json().then(
                        serverScores => {
                            afterScoresAddedToServer(serverScores)
                        }
                    )
            )

        return "red"
    } else if (winnerString.includes('yellowyellowyellowyellow')) {
        gameOver = true
        scores.yellow = scores.yellow + 1
        renderScores(scores)
        saveGame()
        fetch(`http://localhost:3000/scores/yellow`, { method: "POST" })
            .then(
                response =>
                    response.json().then(
                        serverScores => {
                            afterScoresAddedToServer(serverScores)
                        }
                    )
            )

        return "yellow"
    }
    return null
}


function afterScoresAddedToServer(serverScores) {
    renderScores(serverScores)
    scores = serverScores
    saveGame()
}

function takeTurn(row, column, gameBoard) {
    let debugWins = false; //use to check if wins work
    console.log("takeTurn was called with row: " + row + ", column:" + column);
    if (!debugWins) {
        if (redTurn) {
            gameBoard[dropCounter(column, gameBoard)][column] = "red"
            redTurn = false
        } else {
            gameBoard[dropCounter(column, gameBoard)][column] = "yellow"
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
    return gameBoard, redTurn
}

// ensures the new counter goes to the lowest point in the column
function dropCounter(column, gameBoard) {
    for (let row = 5; row >= 0; row--) {
        if (gameBoard[row][column] === null) {
            return row
        }
    }
}

function resetDataForResetGame(gameOver, turnCount, gameBoard) {
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
    return gameOver, turnCount, gameBoard
}