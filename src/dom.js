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

    function renderGameboard(playerBoardOne, playerBoardTwo) {
        const boardOneDiv = document.querySelector('div.boardOne')
        const boardTwoDiv = document.querySelector('div.boardTwo')

        boardOneDiv.textContent = ''
        boardTwoDiv.textContent = ''
        createBoard(playerBoardOne, boardOneDiv)
        createBoard(playerBoardTwo, boardTwoDiv)
    }

    return {
        createUserInterface,
        renderGameboard,
    }
}
