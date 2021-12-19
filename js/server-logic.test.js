const {
    dropCounter, checkWinner, takeTurn, whoWon, incrementScores, updateNames
} = require('./server-logic');

let gameBoard = [];

beforeEach(() => {
    gameBoard = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ];
});
function editGameBoard(row, column, value) {
    gameBoard[row][column] = value;
}

// ###############################################
// *********DROPCOUNTER TESTING******************
// ###############################################

describe('Checking dropCounter function', () => {
    it('should return the row number of 5 if counter is placed in empty column', () => {
        const column = 0;
        const row = dropCounter(column, gameBoard);
        expect(row).toBe(5);
    });
    it('should return the row index of 0 if counter is placed in column with 6 counters in it', () => {
        editGameBoard(5, 0, 'red');
        editGameBoard(4, 0, 'red');
        editGameBoard(3, 0, 'red');
        editGameBoard(2, 0, 'yellow');
        editGameBoard(1, 0, 'yellow');
        const column = 0;
        const row = dropCounter(column, gameBoard);
        expect(row).toBe(0);
    });
    it('should return undefined if column is full', () => {
        editGameBoard(5, 0, 'red');
        editGameBoard(4, 0, 'red');
        editGameBoard(3, 0, 'red');
        editGameBoard(2, 0, 'yellow');
        editGameBoard(1, 0, 'yellow');
        editGameBoard(0, 0, 'yellow');
        const column = 0;
        const row = dropCounter(column, gameBoard);
        expect(row).toBe(undefined);
    });
});

// ##############################################
// *********CHECKWINNER TESTING*****************
// ###############################################

describe('Checking checkWinner function', () => {
    const numberOfRows = 6;
    const numberOfColumns = 7;
    let turnCount = 4;

    it('should return red if red has won in a horizontal manner on row 5', () => {
        editGameBoard(5, 0, 'red');
        editGameBoard(5, 1, 'red');
        editGameBoard(5, 2, 'red');
        editGameBoard(5, 3, 'red');

        const winner = checkWinner(gameBoard, numberOfRows, numberOfColumns, turnCount);
        expect(winner).toBe('red');
    });
    it('should return yellow if yellow has won in a horizontal manner on row 3', () => {
        editGameBoard(3, 0, 'yellow');
        editGameBoard(3, 1, 'yellow');
        editGameBoard(3, 2, 'yellow');
        editGameBoard(3, 3, 'yellow');

        const winner = checkWinner(gameBoard, numberOfRows, numberOfColumns, turnCount);
        expect(winner).toBe('yellow');
    });
    it('should return red if red has won in a vertical manner on column 4', () => {
        editGameBoard(5, 4, 'red');
        editGameBoard(4, 4, 'red');
        editGameBoard(3, 4, 'red');
        editGameBoard(2, 4, 'red');

        const winner = checkWinner(gameBoard, numberOfRows, numberOfColumns, turnCount);
        expect(winner).toBe('red');
    });
    it('should return yellow if yellow has won in a vertical manner on column 1', () => {
        editGameBoard(5, 1, 'yellow');
        editGameBoard(4, 1, 'yellow');
        editGameBoard(3, 1, 'yellow');
        editGameBoard(2, 1, 'yellow');

        const winner = checkWinner(gameBoard, numberOfRows, numberOfColumns, turnCount);
        expect(winner).toBe('yellow');
    });
    it('should return red if red has won in a diagonal from position [5][0] to [2][3]', () => {
        editGameBoard(5, 0, 'red');
        editGameBoard(4, 1, 'red');
        editGameBoard(3, 2, 'red');
        editGameBoard(2, 3, 'red');
        const winner = checkWinner(gameBoard, numberOfRows, numberOfColumns, turnCount);
        expect(winner).toBe('red');
    });
    it('should return yellow if yellow has won in a diagonal from position [0][3] to [3][6]', () => {
        editGameBoard(0, 3, 'yellow');
        editGameBoard(1, 4, 'yellow');
        editGameBoard(2, 5, 'yellow');
        editGameBoard(3, 6, 'yellow');
        const winner = checkWinner(gameBoard, numberOfRows, numberOfColumns, turnCount);
        expect(winner).toBe('yellow');
    });
    it('should return nobody if turnCount = numberOfRows * numberOfColumns and no winner is detected', () => {
        turnCount = numberOfColumns * numberOfRows;

        const winner = checkWinner(gameBoard, numberOfRows, numberOfColumns, turnCount);
        expect(winner).toBe('nobody');
    });
});

// ###############################################
// *********TAKETURN TESTING*********************
// ###############################################
describe('Checking takeTurn function ', () => {
    const row = 0;
    let column = 0;
    let redTurn = true;
    it('should return redTurn as false and the board with "red" in position [5][0]', () => {
        const [redTurnNew, board] = takeTurn(row, column, gameBoard, redTurn);

        expect(redTurnNew).toBe(false);
        expect(board[5][0]).toBe('red');
    });
    it('should return redTurn as true and the board with "yellow" in position [3][3]', () => {
        editGameBoard(5, 3, 'red');
        editGameBoard(4, 3, 'yellow');
        column = 3;
        redTurn = false;

        const [redTurnNew, board] = takeTurn(row, column, gameBoard, redTurn);

        expect(redTurnNew).toBe(true);
        expect(board[3][3]).toBe('yellow');
    });
    it('should return the same redTurn value and gameBoard input if attempting of placing counter in a full column 2', () => {
        // fills a column
        editGameBoard(5, 2, 'red');
        editGameBoard(4, 2, 'yellow');
        editGameBoard(3, 2, 'red');
        editGameBoard(2, 2, 'yellow');
        editGameBoard(1, 2, 'red');
        editGameBoard(0, 2, 'yellow');

        column = 2;

        const [redTurnNew, board] = takeTurn(row, column, gameBoard, redTurn);

        expect(redTurnNew).toBe(redTurn);
        expect(board).toEqual(gameBoard);
    });
});

// ###############################################
// *********WHOWON TESTING************************
// ###############################################
describe('Checking whoWon function ', () => {
    it('should return red if "redredredred" is passed in', () => {
        const winnerString = 'redredredred';

        const winner = whoWon(winnerString);

        expect(winner).toBe('red');
    });
    it('should return yellow if "yellowyellowyellowyellowyellow" is passed in', () => {
        const winnerString = 'yellowyellowyellowyellowyellow';

        const winner = whoWon(winnerString);

        expect(winner).toBe('yellow');
    });
    it('should return null if "redyellowredyellow" is passed in', () => {
        const winnerString = 'redyellowredyellow';

        const winner = whoWon(winnerString);

        expect(winner).toBe(null);
    });
});

// ###############################################
// *********INCREMENTSCORES TESTING*************
// ###############################################
describe('Checking incrementScores function', () => {
    it('should return an object with red with 1 point and yellow with 0 points when both red and yellow are on 0 points and winner is red', () => {
        const winner = 'red';
        const scores = {
            red: 0,
            yellow: 0
        }

        const updatedScores = incrementScores(winner, scores);
        const expectedScores = {
            red: 1,
            yellow: 0
        }

        expect(updatedScores).toEqual(expectedScores)

    });
    it('should return an object with red with 2 point and yellow with 0 points when red is on one point already and winner is red', () => {
        const winner = 'red';
        const scores = {
            red: 1,
            yellow: 0
        }

        const updatedScores = incrementScores(winner, scores);
        const expectedScores = {
            red: 2,
            yellow: 0
        }

        expect(updatedScores).toEqual(expectedScores)

    });
    it('should return an object with red with 1 point and yellow with 1 points when red has one point and winner is yellow', () => {
        const winner = 'yellow';
        const scores = {
            red: 1,
            yellow: 0
        }

        const updatedScores = incrementScores(winner, scores);
        const expectedScores = {
            red: 1,
            yellow: 1
        }

        expect(updatedScores).toEqual(expectedScores)

    });
    it('should return unchanged scores object, when winner is "nobody"', () => {
        const winner = 'nobody';
        const scores = {
            red: 1,
            yellow: 0
        }

        const updatedScores = incrementScores(winner, scores);
        const expectedScores = {
            red: 1,
            yellow: 0
        }

        expect(updatedScores).toEqual(expectedScores)

    });
    it('should return unchanged scores object, when winner is empty string', () => {
        const winner = '';
        const scores = {
            red: 1,
            yellow: 0
        }

        const updatedScores = incrementScores(winner, scores);
        const expectedScores = {
            red: 1,
            yellow: 0
        }

        expect(updatedScores).toEqual(expectedScores)

    });
})

// ###############################################
// *********UPDATENAMES TESTING*************
// ###############################################
describe('Checking updateNames function', () => {
    let playerNames = {}
    let playerNamesToExpect = {}
    beforeEach(() => {
        playerNames = {
            red: 'Red',
            yellow: 'Yellow'
        };
        playerNamesToExpect = {
            red: 'Red',
            yellow: 'Yellow'
        }
    })
    it('should return the original playerNames object if names no names are empty strings', () => {
        const newPlayerNames = updateNames(playerNames);

        expect(newPlayerNames).toEqual(playerNamesToExpect)
    });
    it('should return an object with player names of Red and Yellow if playerNames has no names associated with red and yellow', () => {
        playerNames.red = '';
        playerNames.yellow = '';

        const newPlayerNames = updateNames(playerNames);

        expect(newPlayerNames).toEqual(playerNamesToExpect)

    });
    it('should return an object with player names of Red and Sagar if playerNames has no name for red but has Sagar for yellow', () => {
        playerNames.red = '';
        playerNames.yellow = 'Sagar'

        const newPlayerNames = updateNames(playerNames);

        playerNamesToExpect.yellow = 'Sagar'

        expect(newPlayerNames).toEqual(playerNamesToExpect)
    });
})

// // ###############################################
// // *********RESETGAME TESTING*************
// // ###############################################
// describe('Checking resetGame function', () => {
//     it('should return the game state with the gameBoard reset, gameOver set to false, turnCount to 0, winner to empty string', () => {

//     })
// });

