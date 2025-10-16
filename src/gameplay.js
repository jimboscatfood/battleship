import { DOM } from './dom'
import { Player } from './setup'
export { GameplayControl }

function GameplayControl(playerName = 'Jimmy') {
    const domControl = DOM()
    const playerOne = Player()
    const playerTwo = Player()

    const players = {
        player1: {
            name: `${playerName}`,
            player: playerOne,
        },
        player2: {
            name: 'Computer',
            player: playerTwo,
        },
    }

    //initialise turn
    let turn = players[0]

    function initialisePage() {
        domControl.createUserInterface()
    }

    function showGameboard() {
        //
        playerOne.placeShip(5, [0, 0], 'y')
        playerTwo.placeShip(5, [2, 4], 'x')

        domControl.renderGameboard(
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
        boardTwo.addEventListener('click', (e) => {
            const targetCell = e.target
            const targetCellCoor = [
                targetCell.getAttribute('column'),
                targetCell.getAttribute('row'),
            ]
            playerTwo.receiveAttack(targetCellCoor)
            domControl.renderGameboard(
                playerOne.getPlayerBoard(),
                playerTwo.getPlayerBoard()
            )
            switchTurn()
            playerOne.receiveAttack(getRandomCoor())
            domControl.renderGameboard(
                playerOne.getPlayerBoard(),
                playerTwo.getPlayerBoard()
            )
            switchTurn()
        })
    }

    //pseudocode for game flow logic
    //1. real player place their ships, computer player generate ship placement automatically
    //2. render the initial boards before game start
    //3. game start, real player's turn to click on the computer player's board to attack
    //4. update computer player's board
    //5. switch to computer player's turn, computer player randomly attacked the real player's board

    return {
        initialisePage,
        showGameboard,
        gameFlow,
    }
}
