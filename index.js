// number of people
const NUM_PEOPLE = 5;
// max sequential call of number
const MAX_CALL = 3;
// end number of the game
const END_NUMBER = 31;
// default absolute tolerance of arithematic comparison
const ABS_TOL = 10e-6;

// choseProb([1, 0, 0]) = [0, 1/2, 1/2]
// choseProb([1/2, 1/2, 0]) = [0, 0, 1]
function chooseRateOpt(loseRate, absTol = ABS_TOL) {
    const lowest = loseRate.reduce((lowest, current) => lowest > current? current: lowest);
    const check = loseRate.map((x) => x - lowest < absTol? 1 : 0);
    const checkSum = check.reduce((accum, current) => accum + current);
    const result = check.map(x=>x/checkSum);
    return result;
}

// arrayRotateReverse([1, 2, 3]) = [3, 1, 2]
function rotateArray(arr) {
    const result = [];
    for (var i = 0; i<arr.length; i++) {
        result.push(arr[(i+arr.length-1)%arr.length]);
    }
    return result;
}

function _nextLoseProb(lookupMat, chooseStrategy=chooseRateOpt) {
    const chooseRate = chooseStrategy(lookupMat.map((vector) => vector[0]));
    const result = lookupMat.reduce((accum, vector, rowIndex) => {
        const norm_vector = rotateArray(vector).map((value) => value*chooseRate[rowIndex]);
        return accum.map((value, index) => value + norm_vector[index]);
    }, Array.from({length: NUM_PEOPLE}, ()=>0));
    return result;
}

// lose rate after calling up to number.
// loseProb(31) = [1, 0, 0]
// loseProb(30) = [0, 1, 0]
function loseProb(number, chooseStrategy=chooseRateOpt) {
    if (number > END_NUMBER) {
        throw new Error("current number cannot exceed END_NUMBER");
    }
    const initial = Array.from({length: NUM_PEOPLE}, () => 0);
    initial[0] = 1;

    const loseMatrix = [initial];
    while (loseMatrix.length < END_NUMBER - number) {
        // when calling row + 1
        const lookupMat = loseMatrix.slice(loseMatrix.length-MAX_CALL+1, loseMatrix.length);
        loseMatrix.push(_nextLoseProb(lookupMat, chooseStrategy));
    }
    loseMatrix.forEach((val, ind) => console.log(END_NUMBER - ind, val));
    return loseMatrix[loseMatrix.length - 1];
}

function winProb(n) {
    return loseProb(n).map(n=>1-n);
}

console.log(loseProb(-1));