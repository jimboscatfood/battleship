//entry file
import './styles.css'

import { GameplayControl } from './gameplay'

const play = GameplayControl()

play.initialisePage()
play.updatePreviewBoard()
// play.showGameboard()
play.gameFlow()
