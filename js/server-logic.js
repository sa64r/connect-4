// ensures the new counter goes to the lowest point in the column
function dropCounter(column, gameBoard) {
    for (let row = 5; row >= 0; row--) {
        if (gameBoard[row][column] === null) {
            return row;
        }
    }
    return undefined;
}

function takeTurn(row, column, gameBoard, redTurn) {
    let isRedTurn = redTurn;
    const board = gameBoard.map((arr) => arr.slice());
    const debugWins = false; // use to check if wins work
    // console.log(`takeTurn was called with row: ${row}, column:${column}`);
    if (!debugWins) {
        const droppedRow = dropCounter(column, gameBoard);
        if (redTurn) {
            if (droppedRow !== undefined) {
                board[droppedRow][column] = 'red';
                isRedTurn = false;
            }
        } else if (droppedRow !== undefined) {
            board[droppedRow][column] = 'yellow';
            isRedTurn = true;
        }
    } else if (redTurn) {
        board[row][column] = 'red';
        isRedTurn = false;
    } else {
        board[row][column] = 'yellow';
        isRedTurn = true;
    }
    return [isRedTurn, board];
}

function whoWon(winnerString) {
    // checks if the winning substrings exist
    if (winnerString.includes('redredredred')) {
        // scores.red = scores.red + 1
        return 'red';
    } if (winnerString.includes('yellowyellowyellowyellow')) {
        // scores.yellow = scores.yellow + 1
        return 'yellow';
    }
    return null;
}

function checkWinner(gameBoard, numberOfRows, numberOfColumns, turnCount) {
    for (let i = numberOfRows; i >= 0; i--) {
        // checks horizontal rows for wins
        if (i < numberOfRows) { // to ensure index out of bounds doesn't occurs
            const rowString = `${gameBoard[i][0] + gameBoard[i][1] + gameBoard[i][2] + gameBoard[i][3] + gameBoard[i][4] + gameBoard[i][5] + gameBoard[i][6]}`;
            const winnerHorizontal = whoWon(rowString);
            if (winnerHorizontal === 'red') {
                return 'red';
            } if (winnerHorizontal === 'yellow') {
                return 'yellow';
            }
        }

        // Checks for all vertical wins
        const columnString = `${gameBoard[0][i] + gameBoard[1][i] + gameBoard[2][i] + gameBoard[3][i] + gameBoard[4][i] + gameBoard[5][i]}`;
        const winnerVertical = whoWon(columnString);
        if (winnerVertical === 'red') {
            return 'red';
        } if (winnerVertical === 'yellow') {
            return 'yellow';
        }
    }

    // Checks the diagonal wins
    let diagonalWinner = null;
    for (let i = 0; i < 3; i++) {
        if (diagonalWinner === null) {
            diagonalWinner = whoWon(`${gameBoard[0 + i][0] + gameBoard[1 + i][1] + gameBoard[2 + i][2] + gameBoard[3 + i][3] + (4 + i < numberOfRows ? gameBoard[4 + i][4] : '') + (5 + i < numberOfRows ? gameBoard[5 + i][5] : '')}`);
        }
        if (diagonalWinner === null) {
            diagonalWinner = whoWon(`${gameBoard[0][1 + i] + gameBoard[1][2 + i] + gameBoard[2][3 + i] + gameBoard[3][4 + i] + gameBoard[4][5 + i] + gameBoard[5][6 + i]}`);
        }
        if (diagonalWinner === null) {
            diagonalWinner = whoWon(`${gameBoard[5][1 + i] + gameBoard[4][2 + i] + gameBoard[3][3 + i] + gameBoard[2][4 + i] + (5 + i < numberOfColumns ? gameBoard[1][5 + i] : '') + (6 + i < numberOfColumns ? gameBoard[0][6 + i] : '')}`);
        }
        if (diagonalWinner === null) {
            diagonalWinner = whoWon(`${gameBoard[5 - i][0] + gameBoard[4 - i][1] + gameBoard[3 - i][2] + (2 - i >= 0 ? gameBoard[2 - i][3] : '') + (1 - i >= 0 ? gameBoard[1 - i][4] : '') + (0 - i >= 0 ? gameBoard[0 - i][5] : '')}`);
        }
    }
    if (diagonalWinner !== null) {
        return diagonalWinner;
    }

    if (turnCount === numberOfColumns * numberOfRows) {
        return 'nobody';
    }
    return null;
}

function incrementScores(winner, scores) {
    const gameScores = scores;
    if (winner === 'red' || winner === 'yellow') {
        gameScores[winner]++;
    }
    return gameScores;
}

function updateNames(playerNames) {
    const names = playerNames;
    if (names.red !== '' && names.yellow !== '') {
        return names;
    }
    if (names.red === '') {
        names.red = 'Red';
    }
    if (names.yellow === '') {
        names.yellow = 'Yellow';
    }
    return names;
}

function playMade(rowIndex, columnIndex, gameData) { // NEEDS TESTING
    const data = Object.assign(gameData);
    if (!gameData.gameOver) {
        data.turnCount++;
        [data.redTurn, data.gameBoard] = takeTurn(rowIndex, columnIndex,
            gameData.gameBoard, gameData.redTurn);
        data.winner = checkWinner(gameData.gameBoard, gameData.numberOfRows,
            gameData.numberOfColumns, gameData.turnCount);
        data.scores = incrementScores(gameData.winner, gameData.scores);
        data.gameOver = (gameData.winner !== null);
    }
    return data;
}

function resetGameData(gameData) { // NEEDS TESTING
    const data = Object.assign(gameData);
    data.gameBoard = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ];
    data.gameOver = false;
    data.turnCount = 0;
    data.winner = '';
    return data;
}

function deleteGameData(gameData) { // NEEDS TESTING
    const data = Object.assign(gameData);
    data.gameBoard = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ];
    data.gameOver = false;
    data.turnCount = 0;
    data.redTurn = Math.random() > 0.5;
    data.playerNames = {
        red: 'Red',
        yellow: 'Yellow',
    };
    data.scores = {
        red: 0,
        yellow: 0,
    };
    data.winner = '';

    return data;
}

module.exports = {
    playMade,
    resetGameData,
    deleteGameData,
    updateNames,
    dropCounter,
    checkWinner,
    takeTurn,
    whoWon,
    incrementScores,
    updateNames,
    resetGameData
};
