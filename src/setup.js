export { Ship }

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
