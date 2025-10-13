export { DOM }

function DOM() {
    function createUserInterface() {
        const userInterface = document.createElement('div')
        userInterface.classList.add('ui')
        document.body.appendChild(userInterface)

        const boardOne = document.createElement('div')
        boardOne.classList.add('boardOne')
        const boardTwo = document.createElement('div')
        boardTwo.classList.add('boardTwo')
        userInterface.append(boardOne, boardTwo)
    }

    function renderGameboard(playerBoardOne, playerBoardTwo) {
        const boardOneDiv = document.querySelector('div.boardOne')
        const boardTwoDiv = document.querySelector('div.boardTwo')

        for (let i = 0; i < playerBoardOne.length; i++) {
            for (let j = 0; j < playerBoardOne[i].length; j++) {
                const cell = document.createElement('button')
                cell.setAttribute('row', i)
                cell.setAttribute('column', j)
                if (playerBoardOne[i][j] === null) {
                    cell.textContent = ' '
                } else if (playerBoardOne[i][j] === true) {
                    cell.textContent = 'H'
                } else if (playerBoardOne[i][j] === false) {
                    cell.textContent = 'X'
                } else {
                    cell.textContent = 'S'
                }
                boardOneDiv.appendChild(cell)
            }
        }

        for (let m = 0; m < playerBoardTwo.length; m++) {
            for (let n = 0; n < playerBoardTwo[m].length; n++) {
                const cell = document.createElement('button')
                cell.setAttribute('row', m)
                cell.setAttribute('column', n)
                if (playerBoardTwo[m][n] === null) {
                    cell.textContent = ' '
                } else if (playerBoardTwo[m][n] === true) {
                    cell.textContent = 'H'
                } else if (playerBoardTwo[m][n] === false) {
                    cell.textContent = 'X'
                } else {
                    cell.textContent = 'S'
                }
                boardTwoDiv.appendChild(cell)
            }
        }
    }

    return {
        createUserInterface,
        renderGameboard,
    }
}
