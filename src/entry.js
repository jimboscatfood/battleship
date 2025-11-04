//entry file
import './styles.css'

import { GameplayControl } from './gameplay'

document.addEventListener('DOMContentLoaded', () => {
    const play = GameplayControl()

    play.initialisePage()
    play.updatePreviewBoard()
    play.gameStart()
})

document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('restartBtn')) {
        e.preventDefault()
        const newPlay = GameplayControl()
        newPlay.restartGame()
    }
})
