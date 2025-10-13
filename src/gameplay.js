import { DOM } from './dom'
import { Player } from './setup'
export { GameplayControl }

function GameplayControl() {
    const domControl = DOM()
    const playerOne = Player()
    const playerTwo = Player()

    function initialisePage() {
        domControl.createUserInterface()
    }

    function showGameboard() {
        playerOne.placeShip(5, [0, 0], 'y')
        playerTwo.placeShip(5, [2, 4], 'x')

        domControl.renderGameboard(
            playerOne.getPlayerBoard(),
            playerTwo.getPlayerBoard()
        )
    }

    return {
        initialisePage,
        showGameboard,
    }
}
