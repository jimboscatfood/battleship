import { Ship, Gameboard } from './setup'

//tests for Ship factory
describe('tests for Ship objects', () => {
    test('test ship object of size 1', () => {
        const shipOne = Ship(1)
        expect(shipOne.sunk).toBeFalsy()
    })

    test('test ship object of size 1 after 1 hit', () => {
        const shipOne = Ship(1)
        shipOne.hit()
        expect(shipOne.getSunk()).toBeTruthy()
    })

    test('test ship object of size 4 after 2 hit', () => {
        const shipFour = Ship(4)
        shipFour.hit()
        shipFour.hit()
        expect(shipFour.getSunk()).toBeFalsy()
    })

    test('test ship object of size 4 after 4 hit', () => {
        const shipFour = Ship(4)
        shipFour.hit()
        shipFour.hit()
        shipFour.hit()
        shipFour.hit()
        expect(shipFour.getSunk()).toBeTruthy()
    })
})

//test for Gameboard factory
describe('test for Gameboard object', () => {
    test('test if the board is initiated as a 10x10 grid', () => {
        const testBoard = Gameboard()
        const curTestBoard = testBoard.getBoard()
        expect(curTestBoard).toHaveLength(10)
        expect(curTestBoard[0]).toHaveLength(10)
        expect(curTestBoard[9]).toHaveLength(10)
    })

    test('test placing a ship of size 2 at row 0 col 0 in the x dir', () => {
        const testBoard = Gameboard()
        testBoard.placeShip(2, [0, 0], 'x')
        const curTestBoard = testBoard.getBoard()
        //check the occupied cells
        expect(curTestBoard[0][0]).not.toBeNull()
        expect(curTestBoard[0][1]).not.toBeNull()
        //check the neighbouring cells
        expect(curTestBoard[0][2]).toBeNull()
        expect(curTestBoard[1][0]).toBeNull()
    })

    test('test placing a ship of size 5 at row 4 col 4 in the y dir', () => {
        const testBoard = Gameboard()
        testBoard.placeShip(5, [4, 4], 'y')
        const curTestBoard = testBoard.getBoard()
        //check the occupied cells
        expect(curTestBoard[4][4]).not.toBeNull()
        expect(curTestBoard[5][4]).not.toBeNull()
        expect(curTestBoard[8][4]).not.toBeNull()
        //check the neighbouring cells
        expect(curTestBoard[9][4]).toBeNull()
        expect(curTestBoard[4][5]).toBeNull()
        expect(curTestBoard[8][5]).toBeNull()
    })

    test('test overlapping placement', () => {
        const testBoard = Gameboard()
        //first place a ship of size 5 at [4,4] along y
        testBoard.placeShip(5, [4, 4], 'y')
        //then place a second overlapping ship of size 2 at [4,4] along x
        testBoard.placeShip(2, [4, 4], 'x')
        //then place a third ship of size 3 at [2,4]
        testBoard.placeShip(3, [2, 4], 'x')
        //then place a fourth ship of size 3 at [1,5]
        testBoard.placeShip(3, [1, 5], 'x')
        const curTestBoard = testBoard.getBoard()
        //check if the first ship occupies the designated
        expect(curTestBoard[4][4]).not.toBeNull()
        expect(curTestBoard[8][4]).not.toBeNull()
        //check if the second ship has been created by checking if the cell is null next to [4,4]
        expect(curTestBoard[4][5]).toBeNull()
        //check if the third ship has been created by checking if the cell is null at [2,4]
        expect(curTestBoard[4][2]).toBeNull()
        //check if the third ship has been created by checking if the cell is null at [1,4]
        expect(curTestBoard[5][1]).not.toBeNull()
    })

    test('test for receiving a attack', () => {
        const testBoard = Gameboard()
        //place a ship of size 5 at [4,4] along y
        testBoard.placeShip(5, [4, 4], 'y')
        testBoard.receiveAttack([4, 4])
        const curTestBoard = testBoard.getBoard()
        expect(curTestBoard[4][4]).toBe(true)
    })

    test('test for missing a attack', () => {
        const testBoard = Gameboard()
        //place a ship of size 5 at [4,4] along y
        testBoard.placeShip(5, [4, 4], 'y')
        testBoard.receiveAttack([0, 0])
        const curTestBoard = testBoard.getBoard()
        expect(curTestBoard[0][0]).toBe(false)
    })

    test('test for checking if all ships are sunk with 1 ship of size 2 taking 2 hits', () => {
        const testBoard = Gameboard()
        //place a ship of size 2 at [4,4] along y
        testBoard.placeShip(2, [4, 4], 'y')
        testBoard.receiveAttack([4, 4])
        testBoard.receiveAttack([4, 5])
        expect(testBoard.checkIfAllSunk()).toBe(true)
    })

    test('test for checking if all ships are sunk with 2 ship of size 2, and just 1 of them taking 2 hits', () => {
        const testBoard = Gameboard()
        //place a ship of size 2 at [4,4] along y
        testBoard.placeShip(2, [4, 4], 'y')
        //place another ship of size 2 at [0,0] along x
        testBoard.placeShip(2, [0, 0], 'x')
        testBoard.receiveAttack([4, 4])
        testBoard.receiveAttack([4, 5])
        expect(testBoard.checkIfAllSunk()).toBe(false)
    })
})
