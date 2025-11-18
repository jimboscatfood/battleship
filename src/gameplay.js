import { DOM } from './dom'
import { Player, Gameboard } from './setup'
export { GameplayControl }

function GameplayControl() {
    const domControl = DOM()
    const previewBoard = Gameboard()
    const playerOne = Player()
    const ships = playerOne.getShips()
    const playerTwo = Player()

    const players = [
        {
            name: `Player 1`,
            player: playerOne,
        },
        {
            name: 'Computer',
            player: playerTwo,
            previousMove: [],
            previousHit: false,
        },
    ]

    //initialise turn
    let turn = players[0]

    function initialisePage() {
        domControl.createStartingPage()
        domControl.setUpPreview(previewBoard.getBoard())
        domControl.addInputDOM()
        randomisePlacement()
        resetPlacement()
        domControl.dragHandler()
        domControl.dropHandler()
    }

    function updatePreviewBoard() {
        const inputDiv = document.querySelector('div.userInput')
        inputDiv.addEventListener('change', domControl.updatePreview)
        inputDiv.addEventListener('change', domControl.updateDragItem)
    }

    function gameStart() {
        const form = document.querySelector('form')
        form.addEventListener('submit', (e) => {
            players[0].name = document.querySelector('div.name>input').value
            const sumOfShipSize = ships.reduce((sum, cur) => sum + cur.size, 0)
            const shipCells = document.querySelectorAll(
                'div.previewBoard>div.ship'
            )
            const userInputs = document.querySelectorAll(
                'div.userInput>form>div[shipno]'
            )
            if (shipCells.length === sumOfShipSize) {
                e.preventDefault()
                userInputs.forEach((div) => {
                    const shipSize = ships[div.getAttribute('shipNo')].size
                    const startX = parseInt(
                        div.querySelector('p:nth-child(2)>input').value
                    )
                    const startY = parseInt(
                        div.querySelector('p:nth-child(3)>input').value
                    )
                    const direction = div.querySelector('select').value
                    playerOne.placeShip(shipSize, [startX, startY], direction)
                })
                playerTwo.setRandomBoard()
                domControl.createPlayerBoards()
                domControl.addInGameDOM()
                changeGameMessage()
                showGameboards()
                gameFlow()
            } else {
                e.preventDefault()
                return
            }
        })
    }

    function showGameboards() {
        domControl.renderGameboards(
            playerOne.getPlayerBoard(),
            playerTwo.getPlayerBoard()
        )
    }

    function switchTurn() {
        if (turn === players[0]) {
            turn = players[1]
        } else {
            turn = players[0]
        }
    }

    function getRandomCoor() {
        //get real player's board
        const currentBoard = playerOne.getPlayerBoard()
        while (true) {
            const randomCoorX = Math.floor(
                Math.random() * currentBoard[0].length
            )
            const randomCoorY = Math.floor(Math.random() * currentBoard.length)
            if (
                currentBoard[randomCoorY][randomCoorX] !== true &&
                currentBoard[randomCoorY][randomCoorX] !== false
            ) {
                return [randomCoorX, randomCoorY]
            }
        }
    }

    function gameFlow() {
        const boardTwo = document.querySelector('div.boardTwo')
        boardTwo.addEventListener('click', function gameLogic(e) {
            const targetCell = e.target
            const targetCellCoor = [
                targetCell.getAttribute('column'),
                targetCell.getAttribute('row'),
            ]
            //check if cell has already been attacked
            const playerTwoBoard = playerTwo.getPlayerBoard()
            if (
                playerTwoBoard[targetCellCoor[1]][targetCellCoor[0]] !== true &&
                playerTwoBoard[targetCellCoor[1]][targetCellCoor[0]] !== false
            ) {
                playerTwo.receiveAttack(targetCellCoor)
                if (playerTwo.checkIfAllSunk()) {
                    boardTwo.removeEventListener('click', gameLogic)
                }
                domControl.renderGameboards(
                    playerOne.getPlayerBoard(),
                    playerTwo.getPlayerBoard()
                )
                switchTurn()
                changeGameMessage()
                computerAttack()
                if (playerOne.checkIfAllSunk()) {
                    boardTwo.removeEventListener('click', gameLogic)
                }
                domControl.renderGameboards(
                    playerOne.getPlayerBoard(),
                    playerTwo.getPlayerBoard()
                )
                switchTurn()
                changeGameMessage()
            }
        })
    }

    function checkValidAttack(coor) {
        const currentBoard = playerOne.getPlayerBoard()
        //only a valid attack if the attack lands on a cell that is not true nor false nor out of board
        //1. check if it is within board
        if (
            coor[0] < currentBoard.length &&
            coor[0] >= 0 &&
            coor[1] < currentBoard.length &&
            coor[1] >= 0
        ) {
            if (
                currentBoard[coor[1]][coor[0]] !== true &&
                currentBoard[coor[1]][coor[0]] !== false
            ) {
                return true
            }
        } else {
            return false
        }
    }

    function computerAttack() {
        const playerOneBoard = playerOne.getPlayerBoard()
        if (players[1].previousHit === false) {
            const compAttackCoor = getRandomCoor()
            playerOne.receiveAttack(compAttackCoor)
            players[1].previousMove = compAttackCoor
            if (playerOneBoard[compAttackCoor[1]][compAttackCoor[0]] === true) {
                players[1].previousHit = true
            } else {
                players[1].previousHit = false
            }
        } else if (players[1].previousHit === true) {
            let smartAttackCoor
            const vectorArr = [
                [0, 1],
                [0, -1],
                [1, 0],
                [-1, 0],
            ]
            const randomMovesArr = vectorArr.map((value) => [
                value[0] + players[1].previousMove[0],
                value[1] + players[1].previousMove[1],
            ])
            const validMoves = randomMovesArr.filter((coor) =>
                checkValidAttack(coor)
            )
            if (validMoves.length === 0) {
                const compAttackCoor = getRandomCoor()
                playerOne.receiveAttack(compAttackCoor)
                players[1].previousMove = compAttackCoor
                if (
                    playerOneBoard[compAttackCoor[1]][compAttackCoor[0]] ===
                    true
                ) {
                    players[1].previousHit = true
                } else {
                    players[1].previousHit = false
                }
            } else {
                const randomIndex = Math.floor(
                    Math.random() * validMoves.length
                )
                smartAttackCoor = validMoves[randomIndex]
                console.log(smartAttackCoor)
                playerOne.receiveAttack(smartAttackCoor)
                players[1].previousMove = smartAttackCoor
                if (
                    playerOneBoard[smartAttackCoor[1]][smartAttackCoor[0]] ===
                    true
                ) {
                    players[1].previousHit = true
                } else {
                    players[1].previousHit = false
                }
            }
        }
    }

    function changeGameMessage() {
        const messageBox = document.querySelector('p.message')
        if (turn.player.checkIfAllSunk()) {
            switchTurn()
            messageBox.textContent = `Game over. ${turn.name} wins.`
        } else {
            messageBox.textContent = `${turn.name}'s turn.`
        }
    }

    function randomisePlacement() {
        const randomButton = document.querySelector('button.randomBtn')
        randomButton.addEventListener('click', (e) => {
            e.preventDefault()
            domControl.randomisePlacementInput()
            domControl.updateDragItem()
        })
    }

    function resetPlacement() {
        const resetButton = document.querySelector('button[type=reset]')
        resetButton.addEventListener('click', domControl.resetPreview)
    }

    function restartGame() {
        if (confirm('Do you want to start a new game?')) {
            initialisePage()
            updatePreviewBoard()
            gameStart()
        } else {
            return
        }
    }

    return {
        initialisePage,
        showGameboards,
        gameFlow,
        updatePreviewBoard,
        gameStart,
        restartGame,
    }
}
