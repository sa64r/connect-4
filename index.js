const port = 3000;
const express = require('express');

// FOR API DOCUMENTATION
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for Connect 4 Game',
        version: '1.0.0',
    },
};
const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['index.js'],
};
const swaggerSpec = swaggerJSDoc(options);
const swaggerUi = require('swagger-ui-express');
//-------------------------

const {
    playMade, resetGameData, deleteGameData, updateNames,
} = require('./js/server-logic');

const app = express();
app.use(express.static(__dirname));
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // for api documentation

let gameData = { // move state to server side
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

/**
 * @swagger
 * /game:
 *   get:
 *     summary: Will return the game state in a JSON object format.
 *     description: Will return the full game state which includes the game board, game over condition, who's turn it is, turn count,
 *      player names, scores, the winner and the number of rows and columns on the board.
 *     deprecated: true
 *     responses:
 *      '200':
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          gameBoard:
 *                              type: array
 *                              example: [[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null]]
 *                          gameOver:
 *                              type: boolean
 *                              example: false
 *                          redTurn:
 *                              type: boolean
 *                              example: true
 *                          turnCount:
 *                              type: integer
 *                              example: 0
 *                          playerNames:
 *                              type: object
 *                              properties:
 *                                  red:
 *                                      type: string
 *                                      example: Red
 *                                  yellow:
 *                                      type: string
 *                                      example: Yellow
 *                          scores:
 *                              type: object
 *                              properties:
 *                                  red:
 *                                      type: integer
 *                                      example: 0
 *                                  yellow:
 *                                      type: integer
 *                                      example: 0
 *                          winner:
 *                              type: string
 *                              example: ''
 *                          numberOfRows:
 *                              type: integer
 *                              example: 6
 *                          numberOfColumns:
 *                              type: integer
 *                              example: 7
*/
app.get('/game', (req, res) => {
    res.json(gameData);
});

/**
 * @swagger
 * /game/turn:
 *   get:
 *     summary: Will return a JSON object consisting of the player names and whether it is red's turn or not.
 *     description:
 *     deprecated: true
 *     responses:
 *          '200':
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              redTurn:
 *                                  type: boolean
 *                                  example: true
 *                              playerNames:
 *                                  type: object
 *                                  properties:
 *                                      red:
 *                                          type: string
 *                                          example: Red
 *                                      yellow:
 *                                          type: string
 *                                          example: Yellow
 *
 *
 *
*/
app.get('/game/turn', (req, res) => {
    res.json({
        redTurn: gameData.redTurn,
        playerNames: gameData.playerNames,
    });
});

/**
 * @swagger
 * /game/winner:
 *   get:
 *     summary: Will return who the winner is (if anybody) with the player names.
 *     description:
 *     deprecated: true
 *     responses:
 *          '200':
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              winner:
 *                                  type: string
 *                                  example: red
 *                              playerNames:
 *                                  type: object
 *                                  properties:
 *                                      red:
 *                                          type: string
 *                                          example: Red
 *                                      yellow:
 *                                          type: string
 *                                          example: Yellow
*/
app.get('/game/winner', (req, res) => {
    res.json({
        winner: gameData.winner,
        playerNames: gameData.playerNames,
    });
});

/**
 * @swagger
 * /game/scores:
 *   get:
 *     summary: Returns the current running score between red and yellow.
 *     description:
 *     deprecated: true
 *     responses:
 *          '200':
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              red:
 *                                  type: integer
 *                                  example: 0
 *                              yellow:
 *                                  type: integer
 *                                  example: 0
*/
app.get('/game/scores', (req, res) => {
    res.json(gameData.scores);
});

/**
 * @swagger
 * /game/names:
 *   get:
 *     summary: Will return the names set to the colours red and yellow.
 *     description:
 *     deprecated: true
 *     responses:
 *          '200':
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              red:
 *                                  type: string
 *                                  example: Red
 *                              yellow:
 *                                  type: string
 *                                  example: Yellow
 *
 *
 *
*/
app.get('/game/names', (req, res) => {
    res.json(gameData.playerNames);
});

/**
 * @swagger
 * /game/names:
 *   put:
 *     summary: Enables custom names to be set for red and yellow, there is no response to this route.
 *     description:
 *     deprecated: true
*/
app.put('/game/names', (req, res) => {
    gameData.playerNames = updateNames(req.body);
    res.json({});
});

/**
 * @swagger
 * /game:
 *   put:
 *     summary: Will reset board without resetting the running scores and player names and respond with the new game state.
 *     description:
 *     responses:
 *     deprecated: true
 *     '200':
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          gameBoard:
 *                              type: array
 *                              example: [[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null]]
 *                          gameOver:
 *                              type: boolean
 *                              example: false
 *                          redTurn:
 *                              type: boolean
 *                              example: true
 *                          turnCount:
 *                              type: integer
 *                              example: 0
 *                          playerNames:
 *                              type: object
 *                              properties:
 *                                  red:
 *                                      type: string
 *                                      example: Red
 *                                  yellow:
 *                                      type: string
 *                                      example: Yellow
 *                          scores:
 *                              type: object
 *                              properties:
 *                                  red:
 *                                      type: integer
 *                                      example: 0
 *                                  yellow:
 *                                      type: integer
 *                                      example: 0
 *                          winner:
 *                              type: string
 *                              example: ''
 *                          numberOfRows:
 *                              type: integer
 *                              example: 6
 *                          numberOfColumns:
 *                              type: integer
 *                              example: 7
*/
app.put('/game', (req, res) => {
    gameData = resetGameData(gameData);
    res.json(gameData);
});

/**
 * @swagger
 * /game:
 *   patch:
 *     summary: Was to be implemented for updating the full game state, now deprecated.
 *     description:
 *     deprecated: true
*/
app.patch('/game', (req, res) => {
    gameData = req.body;
    res.json({});
});

/**
 * @swagger
 * /game/move:
 *   post:
 *     summary: Takes in the row and column clicked on a board, then returns the new game state.
 *     description:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rowIndex:
 *                 type: integer
 *                 example: 1
 *               columnIndex:
 *                 type: integer
 *                 example: 0
 *               gameState:
 *                  type: object
 *                  properties:
 *                    gameBoard:
 *                      type: array
 *                      example: [[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null]]
 *                    gameOver:
 *                      type: boolean
 *                      example: false
 *                    redTurn:
 *                      type: boolean
 *                      example: true
 *                    turnCount:
 *                      type: integer
 *                      example: 0
 *                    playerNames:
 *                      type: object
 *                      properties:
 *                        red:
 *                          type: string
 *                          example: Red
 *                        yellow:
 *                          type: string
 *                          example: Yellow
 *                    scores:
 *                      type: object
 *                      properties:
 *                        red:
 *                          type: integer
 *                          example: 0
 *                        yellow:
 *                          type: integer
 *                          example: 0
 *                    winner:
 *                      type: string
 *                      example: ''
 *                    numberOfRows:
 *                      type: integer
 *                      example: 6
 *                    numberOfColumns:
 *                      type: integer
 *                      example: 7
 *     responses:
 *      '200':
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          gameBoard:
 *                              type: array
 *                              example: [[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null]]
 *                          gameOver:
 *                              type: boolean
 *                              example: false
 *                          redTurn:
 *                              type: boolean
 *                              example: true
 *                          turnCount:
 *                              type: integer
 *                              example: 0
 *                          playerNames:
 *                              type: object
 *                              properties:
 *                                  red:
 *                                      type: string
 *                                      example: Red
 *                                  yellow:
 *                                      type: string
 *                                      example: Yellow
 *                          scores:
 *                              type: object
 *                              properties:
 *                                  red:
 *                                      type: integer
 *                                      example: 0
 *                                  yellow:
 *                                      type: integer
 *                                      example: 0
 *                          winner:
 *                              type: string
 *                              example: ''
 *                          numberOfRows:
 *                              type: integer
 *                              example: 6
 *                          numberOfColumns:
 *                              type: integer
 *                              example: 7
 *
*/
app.post('/game/move', (req, res) => {
    const { rowIndex, columnIndex, gameState } = req.body;
    const returnedGameState = playMade(rowIndex, columnIndex, gameState);
    res.json(returnedGameState);
});

/**
 * @swagger
 * /game:
 *   delete:
 *     summary: Will reset all game state data and response the newly reset game state.
 *     description:
 *     deprecated: true
 *     responses:
 *      '200':
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          gameBoard:
 *                              type: array
 *                              example: [[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null],[null, null, null, null, null, null, null]]
 *                          gameOver:
 *                              type: boolean
 *                              example: false
 *                          redTurn:
 *                              type: boolean
 *                              example: true
 *                          turnCount:
 *                              type: integer
 *                              example: 0
 *                          playerNames:
 *                              type: object
 *                              properties:
 *                                  red:
 *                                      type: string
 *                                      example: Red
 *                                  yellow:
 *                                      type: string
 *                                      example: Yellow
 *                          scores:
 *                              type: object
 *                              properties:
 *                                  red:
 *                                      type: integer
 *                                      example: 0
 *                                  yellow:
 *                                      type: integer
 *                                      example: 0
 *                          winner:
 *                              type: string
 *                              example: ''
 *                          numberOfRows:
 *                              type: integer
 *                              example: 6
 *                          numberOfColumns:
 *                              type: integer
 *                              example: 7
*/
app.delete('/game', (req, res) => {
    gameData = deleteGameData(gameData);
    res.json(gameData);
});

app.listen(port, console.log(`Listening on port ${port}`));

// LINK TO HOW TO DO API DOCUMENTATION USING SWAGGER
// https://dev.to/kabartolo/how-to-document-an-express-api-with-swagger-ui-and-jsdoc-50do
