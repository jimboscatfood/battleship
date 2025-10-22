export { Ship, Gameboard, Player }

//ship factory to be instantiated at gameboard
function Ship(shipSize) {
    const size = shipSize
    let numOfHit = 0
    let sunk = false

    //no need to test hit because it is a function which causes side effect within the instance itself
    function hit() {
        if (numOfHit < size) {
            numOfHit += 1
        }
    }

    //
    function isSunk() {
        if (numOfHit === size) {
            sunk = true
        } else {
            sunk = false
        }
    }

    function getSunk() {
        isSunk()
        return sunk
    }

    return {
        hit,
        getSunk,
    }
}

//gameboard factory to be instantiated for each player
function Gameboard() {
    const xAxisLength = 10
    const yAxisLength = 10
    let board = Array.from({ length: yAxisLength }, () =>
        Array.from({ length: xAxisLength }, () => null)
    )

    function checkValidPlacement(shipSize, startCoor, direction) {
        const currentBoard = getBoard()
        const startX = startCoor[0]
        const startY = startCoor[1]
        let valid = false
        //IF the starting coordinate is within the board
        if (startX < xAxisLength && startY < yAxisLength) {
            //IF the placement direction is along x axis and the proposed placement is contained within the board
            if (direction == 'x' && startX + shipSize - 1 < xAxisLength) {
                //IF the proposed placement does not interfere with any existing ships
                let numOfSpace = 0
                for (let i = 0; i < shipSize; i++) {
                    currentBoard[startY][startX + i] === null
                        ? (numOfSpace += 1)
                        : null
                }
                numOfSpace === shipSize ? (valid = true) : null
            } else if (
                direction == 'y' &&
                startY + shipSize - 1 < yAxisLength
            ) {
                let numOfSpace = 0
                for (let j = 0; j < shipSize; j++) {
                    currentBoard[startY + j][startX] === null
                        ? (numOfSpace += 1)
                        : null
                }
                numOfSpace === shipSize ? (valid = true) : null
            }
        }
        return valid
    }

    function placeShip(shipSize, startCoor, direction) {
        const newShip = Ship(shipSize)
        //store a reference of the newShip object to each of the space it occupies in the 2D array
        //only place ship if its startCoor and its remains are within the gameboard
        const startX = startCoor[0]
        const startY = startCoor[1]
        //IF the placement is valid
        if (checkValidPlacement(shipSize, startCoor, direction)) {
            //IF the ship is placed horizontally
            if (direction == 'x') {
                for (let i = 0; i < shipSize; i++) {
                    //REPLACE null on the 2D array with a reference of the newShip object
                    board[startY][startX + i] = newShip
                }
            }
            //ELSE IF the ship is placed vertically
            else if (direction == 'y') {
                for (let j = 0; j < shipSize; j++) {
                    //REPLACE null on the 2D array with a reference of the newShip object
                    board[startY + j][startX] = newShip
                }
            }
        }
    }

    function receiveAttack(targetCoor) {
        const xCoor = targetCoor[0]
        const yCoor = targetCoor[1]
        const targetObj = board[yCoor][xCoor]
        //IF targetObj is an actual ship object
        if (targetObj !== null && targetObj !== true && targetObj !== false) {
            targetObj.hit()
            //REPLACE ship object with true, translating to a hit
            board[yCoor][xCoor] = true
        } else {
            //REPLACE null object with false, translating to a miss
            board[yCoor][xCoor] = false
        }
    }

    function checkIfAllSunk() {
        for (let i = 0; i < yAxisLength; i++) {
            let shipsNotSunk = board[i].filter(
                (cell) => cell !== null && cell !== true && cell !== false
            )
            if (shipsNotSunk.length > 0) {
                return false
            }
        }
        return true
    }

    function getBoard() {
        return board
    }

    return {
        placeShip,
        receiveAttack,
        checkIfAllSunk,
        getBoard,
        checkValidPlacement,
    }
}

function Player() {
    const board = Gameboard()
    const ships = [
        {
            shipName: 'Carrier',
            size: 5,
        },
        {
            shipName: 'Battleship',
            size: 4,
        },
        {
            shipName: 'Destroyer',
            size: 3,
        },
        {
            shipName: 'Submarine',
            size: 3,
        },
        {
            shipName: 'Patrol Boat',
            size: 2,
        },
    ]

    function getShips() {
        return ships
    }

    function setRandomBoard() {
        ships.forEach((ship) => {
            while (true) {
                const randomX = Math.floor(Math.random() * 10)
                const randomY = Math.floor(Math.random() * 10)
                const randomDir =
                    Math.floor(Math.random() * 2) === 0 ? 'x' : 'y'
                if (
                    board.checkValidPlacement(
                        ship.size,
                        [randomX, randomY],
                        randomDir
                    )
                ) {
                    board.placeShip(ship.size, [randomX, randomY], randomDir)
                    break
                }
            }
        })
    }

    return {
        getPlayerBoard: board.getBoard,
        placeShip: board.placeShip,
        receiveAttack: board.receiveAttack,
        getShips,
        setRandomBoard,
        checkIfAllSunk: board.checkIfAllSunk,
    }
}
