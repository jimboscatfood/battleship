export { DOM }
import { Player } from './setup'

function DOM() {
    const player = Player()
    const ships = player.getShips()

    function createStartingPage() {
        document.body.textContent = ''

        const userInterface = document.createElement('div')
        userInterface.classList.add('ui')
        document.body.appendChild(userInterface)

        const userInputDiv = document.createElement('div')
        userInputDiv.classList.add('userInput')
        document.body.appendChild(userInputDiv)
    }

    function createBoard(board, boardDiv) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.createElement('div')
                cell.setAttribute('row', i)
                cell.setAttribute('column', j)
                if (board[i][j] === null) {
                    cell.textContent = ' '
                } else if (board[i][j] === true) {
                    cell.textContent = 'H'
                } else if (board[i][j] === false) {
                    cell.textContent = 'X'
                } else {
                    cell.textContent = 'S'
                }
                boardDiv.appendChild(cell)
            }
        }
    }

    function setUpPreview(previewBoard) {
        const userInterface = document.querySelector('div.ui')
        const previewBoardDiv = document.createElement('div')
        previewBoardDiv.classList.add('previewBoard')
        userInterface.textContent = ''
        userInterface.appendChild(previewBoardDiv)

        createBoard(previewBoard, previewBoardDiv)
    }

    function createPlayerBoards() {
        const userInterface = document.querySelector('div.ui')
        const previewBoard = document.querySelector('div.previewBoard')
        const userInputForm = document.querySelector('form')
        previewBoard.remove()
        userInputForm.remove()

        const boardOne = document.createElement('div')
        boardOne.classList.add('boardOne')
        const boardTwo = document.createElement('div')
        boardTwo.classList.add('boardTwo')
        userInterface.append(boardOne, boardTwo)
    }

    function renderGameboards(playerBoardOne, playerBoardTwo) {
        const boardOneDiv = document.querySelector('div.boardOne')
        const boardTwoDiv = document.querySelector('div.boardTwo')

        boardOneDiv.textContent = ''
        boardTwoDiv.textContent = ''
        createBoard(playerBoardOne, boardOneDiv)
        createBoard(playerBoardTwo, boardTwoDiv)
    }

    function addInputDOM() {
        const userInputDiv = document.querySelector('div.userInput')
        const form = document.createElement('form')
        userInputDiv.appendChild(form)

        ships.forEach((ship, index) => {
            const descriptionDiv = document.createElement('div')
            descriptionDiv.setAttribute('shipNo', `${index}`)
            const description = document.createElement('p')
            description.textContent = `Ship: ${ship.shipName}, Ship size: ${ship.size}`

            const xCoorField = document.createElement('p')
            const xCoorLabel = document.createElement('label')
            xCoorLabel.textContent = 'X Coordinate: '
            const xCoorInput = document.createElement('input')
            xCoorInput.type = 'tel'
            xCoorInput.setAttribute('required', '')
            xCoorField.append(xCoorLabel, xCoorInput)

            const yCoorField = document.createElement('p')
            const yCoorLabel = document.createElement('label')
            yCoorLabel.textContent = 'Y Coordinate: '
            const yCoorInput = document.createElement('input')
            yCoorInput.type = 'tel'
            yCoorInput.setAttribute('required', '')
            yCoorField.append(yCoorLabel, yCoorInput)

            const dirField = document.createElement('p')
            const dirLabel = document.createElement('label')
            dirLabel.textContent = 'Direction: '
            const dirInput = document.createElement('select')
            const optionX = document.createElement('option')
            optionX.value = 'x'
            optionX.textContent = 'Along X-axis'
            const optionY = document.createElement('option')
            optionY.value = 'y'
            optionY.textContent = 'Along Y-axis'
            dirInput.append(optionX, optionY)
            dirField.append(dirLabel, dirInput)

            descriptionDiv.append(description, xCoorField, yCoorField, dirField)
            form.appendChild(descriptionDiv)
        })
        const startButton = document.createElement('button')
        startButton.textContent = 'Start'
        startButton.type = 'submit'
        const resetButton = document.createElement('input')
        resetButton.type = 'reset'

        form.append(startButton, resetButton)
    }

    function checkValidPlacement(shipSize, xCoor, yCoor, direction) {
        const previewBoard = document.querySelector('div.previewBoard')
        const firstCell = previewBoard.firstChild
        const lastCell = previewBoard.lastChild
        const xMin = parseInt(firstCell.getAttribute('column'))
        const xMax = parseInt(lastCell.getAttribute('column'))
        const yMin = parseInt(firstCell.getAttribute('row'))
        const yMax = parseInt(lastCell.getAttribute('row'))
        //first condition the starting coordinate of ship must be within the board
        if (xCoor >= xMin && yCoor >= yMin) {
            //second condition the whole ship is within the board
            if (direction === 'x' && xCoor + shipSize <= xMax + 1) {
                //third condition the ship must not overlap with existing ships
                for (let i = 0; i < shipSize; i++) {
                    const cell = previewBoard.querySelector(
                        `[row='${yCoor}'][column='${xCoor + i}']`
                    )
                    if (cell.classList.contains('ship')) {
                        return false
                    }
                }
                return true
            } else if (direction === 'y' && yCoor + shipSize <= yMax + 1) {
                for (let j = 0; j < shipSize; j++) {
                    const cell = previewBoard.querySelector(
                        `[row='${yCoor + j}'][column='${xCoor}']`
                    )
                    if (cell.classList.contains('ship')) {
                        return false
                    }
                }
                return true
            }
        }
    }

    function updatePreview() {
        const inputDivs = document.querySelectorAll('div.userInput div')
        const previewBoardCells = document.querySelectorAll(
            'div.previewBoard>div'
        )
        previewBoardCells.forEach((cell) => {
            cell.classList.remove('ship')
        })
        inputDivs.forEach((div) => {
            const startX = parseInt(
                div.querySelector('p:nth-child(2)>input').value
            )
            const startY = parseInt(
                div.querySelector('p:nth-child(3)>input').value
            )
            const direction = div.querySelector('select').value

            const shipSize = ships[div.getAttribute('shipNo')].size

            if (
                Number.isInteger(startX) &&
                Number.isInteger(startY) &&
                checkValidPlacement(shipSize, startX, startY, direction)
            ) {
                if (direction === 'x') {
                    for (let i = 0; i < shipSize; i++) {
                        const cell = document.querySelector(
                            `div.previewBoard>div[row='${startY}'][column='${startX + i}']`
                        )
                        cell.classList.add('ship')
                    }
                } else if (direction === 'y') {
                    for (let j = 0; j < shipSize; j++) {
                        const cell = document.querySelector(
                            `div.previewBoard>div[row='${startY + j}'][column='${startX}']`
                        )
                        cell.classList.add('ship')
                    }
                }
            }
        })
    }

    return {
        createStartingPage,
        createPlayerBoards,
        renderGameboards,
        addInputDOM,
        setUpPreview,
        updatePreview,
    }
}
