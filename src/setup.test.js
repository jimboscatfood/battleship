import { Ship } from './setup'

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
