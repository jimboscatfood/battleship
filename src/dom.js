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

    function createDragItems() {
        const inputDivs = document.querySelectorAll(
            'div.userInput>form>div[shipno]'
        )

        inputDivs.forEach((inputDiv) => {
            const shipSize = ships[inputDiv.getAttribute('shipNo')].size
            const direction = inputDiv.querySelector('select').value
            const dragSection = document.createElement('div')
            inputDiv.appendChild(dragSection)

            const itemContainer = document.createElement('div')
            itemContainer.setAttribute('draggable', 'true')
            itemContainer.classList.add(`drag`)
            itemContainer.classList.add(`${direction}`)
            for (let i = 0; i < shipSize; i++) {
                const shipCell = document.createElement('div')
                shipCell.setAttribute('data-cell', `${i}`)
                itemContainer.appendChild(shipCell)
            }
            dragSection.appendChild(itemContainer)
        })
    }

    function updateDragItem() {
        const dragItems = document.querySelectorAll('div.drag')
        const selects = document.querySelectorAll('select')
        dragItems.forEach((item, index) => {
            const direction = selects[index].value
            //change item class based on its input container's select value so that its style changes
            if (direction === 'y' && item.classList.contains('x')) {
                item.classList.remove('x')
                item.classList.add('y')
            } else if (direction === 'x' && item.classList.contains('y')) {
                item.classList.remove('y')
                item.classList.add('x')
            }
        })
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
                    cell.classList.add('hit')
                } else if (board[i][j] === false) {
                    cell.textContent = 'X'
                    cell.classList.add('miss')
                } else {
                    if (boardDiv.classList.contains('boardOne')) {
                        cell.classList.add('ship')
                    }
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
        const previewBoardCells = document.querySelectorAll(
            'div.previewBoard>div'
        )
        previewBoardCells.forEach((cell) => {
            cell.classList.add('dropZone')
        })
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

        const playerNameBox = document.createElement('div')
        playerNameBox.classList.add('name')
        const playNameLabel = document.createElement('label')
        playNameLabel.textContent = `Player's name: `
        const playerNameInput = document.createElement('input')
        playerNameInput.setAttribute('required', '')
        playerNameBox.append(playNameLabel, playerNameInput)
        form.appendChild(playerNameBox)

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

            const inputDiv = document.createElement('div')
            inputDiv.classList.add('input')
            inputDiv.append(description, xCoorField, yCoorField, dirField)
            descriptionDiv.appendChild(inputDiv)
            form.appendChild(descriptionDiv)
        })

        const randomButton = document.createElement('button')
        randomButton.textContent = 'Randomise Ship Placements'
        randomButton.classList.add('randomBtn')
        const startButton = document.createElement('button')
        startButton.textContent = 'Start'
        startButton.type = 'submit'
        const resetButton = document.createElement('button')
        resetButton.textContent = 'Reset'
        resetButton.type = 'reset'

        form.append(randomButton, startButton, resetButton)

        createDragItems()
    }

    function addInGameDOM() {
        const inGameUI = document.createElement('div')
        document.body.appendChild(inGameUI)
        const gameMessageBox = document.createElement('p')
        gameMessageBox.classList.add('message')
        inGameUI.appendChild(gameMessageBox)

        const restartBtn = document.createElement('button')
        restartBtn.classList.add('restartBtn')
        restartBtn.textContent = 'Restart Game'
        inGameUI.appendChild(restartBtn)
    }

    function checkPreviewValidPlacement(shipSize, xCoor, yCoor, direction) {
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
            if (direction === 'x' && xCoor + shipSize - 1 <= xMax) {
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
            } else if (direction === 'y' && yCoor + shipSize - 1 <= yMax) {
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
        const inputDivs = document.querySelectorAll(
            'div.userInput>form>div[shipno]'
        )
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
                checkPreviewValidPlacement(shipSize, startX, startY, direction)
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

    function randomisePlacementInput() {
        const inputDivs = document.querySelectorAll(
            'div.userInput>form>div[shipno]'
        )

        //clear all input fields first
        const allInputs = document.querySelectorAll('div[shipno]>input')
        allInputs.forEach((input) => {
            input.value = ''
        })
        const allSelects = document.querySelectorAll('select')
        allSelects.forEach((select) => {
            //default direction is x
            select.value = 'x'
        })

        inputDivs.forEach((div) => {
            while (true) {
                const startXInput = div.querySelector('p:nth-child(2)>input')
                const startYInput = div.querySelector('p:nth-child(3)>input')
                const direction = div.querySelector('select')
                const shipSize = ships[div.getAttribute('shipNo')].size

                const randomX = Math.floor(Math.random() * 10)
                const randomY = Math.floor(Math.random() * 10)
                const randomDir =
                    Math.floor(Math.random() * 2) === 0 ? 'x' : 'y'

                if (
                    checkPreviewValidPlacement(
                        shipSize,
                        randomX,
                        randomY,
                        randomDir
                    )
                ) {
                    startXInput.value = randomX
                    startYInput.value = randomY
                    direction.value = randomDir
                    updatePreview()
                    break
                }
            }
        })
    }

    function resetPreview() {
        const previewBoardCells = document.querySelectorAll(
            'div.previewBoard>div'
        )
        previewBoardCells.forEach((cell) => {
            cell.classList.remove('ship')
        })
    }

    function dragHandler() {
        const inputDivs = document.querySelectorAll(
            'div.userInput>form>div[shipno]'
        )
        const dropItems = document.querySelectorAll('div.drag')

        let cellNum

        dropItems.forEach((item) => {
            item.addEventListener('mousedown', (e) => {
                cellNum = parseInt(e.target.getAttribute('data-cell'))
            })
        })

        dropItems.forEach((item, index) => {
            item.addEventListener('dragstart', (e) => {
                //when drag starts, set the data that needs to be passed into an object for the drop zone to "retrieve"
                //the drag item data will be translated to userInput input entry when the drag ends
                //when hover on drop zone, show color
                //set up logic that does not allow the same ship to be placed more than once, this can be done by changing the input fields whenever a valid drag action is done
                const selectedEntry = inputDivs[index]
                const directionInput =
                    selectedEntry.querySelector('select').value

                const shipSize =
                    ships[selectedEntry.getAttribute('shipNo')].size
                e.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({
                        targetCellNum: cellNum,
                        direction: directionInput,
                        size: shipSize,
                        shipNum: index,
                    })
                )
            })
        })
    }

    function dropHandler() {
        const dropZoneCells = document.querySelectorAll('div.dropZone')
        dropZoneCells.forEach((dropZone) => {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault()
            })
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault()
                //see which cell it is dropping into
                const dropX = parseInt(e.target.getAttribute('column'))
                const dropY = parseInt(e.target.getAttribute('row'))

                //retrieve data from drop item
                const itemData = JSON.parse(
                    e.dataTransfer.getData('application/json')
                )
                const direction = itemData.direction
                const startX =
                    direction === 'x'
                        ? dropX - parseInt(itemData.targetCellNum)
                        : dropX
                const startY =
                    direction === 'y'
                        ? dropY - parseInt(itemData.targetCellNum)
                        : dropY
                const shipSize = parseInt(itemData.size)

                //create reference to the corresponding userInput box
                const inputDivs = document.querySelectorAll(
                    'div.userInput>form>div[shipno]'
                )
                const selectedEntry = inputDivs[parseInt(itemData.shipNum)]
                const startXInput = selectedEntry.querySelector(
                    'p:nth-child(2)>input'
                )
                const startYInput = selectedEntry.querySelector(
                    'p:nth-child(3)>input'
                )
                const directionInput = selectedEntry.querySelector('select')
                if (
                    checkPreviewValidPlacement(
                        shipSize,
                        startX,
                        startY,
                        direction
                    )
                ) {
                    startXInput.value = startX
                    startYInput.value = startY
                    directionInput.value = direction
                    updatePreview()
                }
            })
        })
    }

    return {
        createStartingPage,
        createPlayerBoards,
        renderGameboards,
        addInputDOM,
        setUpPreview,
        resetPreview,
        updatePreview,
        updateDragItem,
        randomisePlacementInput,
        addInGameDOM,
        dragHandler,
        dropHandler,
    }
}
