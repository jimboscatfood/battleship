import { DOM } from './dom'
import { Player, Gameboard } from './setup'
export { GameplayControl }

function GameplayControl(playerName = 'Player 1') {
    const domControl = DOM()
    const previewBoard = Gameboard()
    const playerOne = Player()
    const ships = playerOne.getShips()
    const playerTwo = Player()

    const players = [
        {
            name: `${playerName}`,
            player: playerOne,
        },
        {
            name: 'Computer',
            player: playerTwo,
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
        const startBtn = document.querySelector("button[type='submit']")
        startBtn.addEventListener('click', (e) => {
            const sumOfShipSize = ships.reduce((sum, cur) => sum + cur.size, 0)
            const shipCells = document.querySelectorAll(
                'div.previewBoard>div.ship'
            )
            const userInputs = document.querySelectorAll(
                'div.userInput>form>div'
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
                playerOne.receiveAttack(getRandomCoor())
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
