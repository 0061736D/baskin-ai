const defaultGameSetting = {
    endNumber: 31,
    numPeople: 4,
    maxCall: 3,
};

const defaultSimulationSetting = {
    absTol: 10e-5
};

const defaultChooseStratgy = (loseRate) => chooseRateOpt(loseRate, defaultSimulationSetting);

// choseProb([1, 0, 0]) = [0, 1/2, 1/2]
// choseProb([1/2, 1/2, 0]) = [0, 0, 1]
function chooseRateOpt(loseRate, simulationSetting) {
    const { absTol } = simulationSetting;
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

function _nextLoseProb(lookupMat, chooseStrategy) {
    const chooseRate = chooseStrategy(lookupMat.map((vector) => vector[0]));
    const result = lookupMat.reduce((accum, vector, rowIndex) => {
        const norm_vector = rotateArray(vector).map((value) => value*chooseRate[rowIndex]);
        return accum.map((value, index) => value + norm_vector[index]);
    }, Array.from({length: lookupMat[0].length}, ()=>0));
    return result;
}

// lose rate after calling up to number.
// chooseStrategy: (number, loseRate, )
// loseProb(31) = [1, 0, 0]
// loseProb(30) = [0, 1, 0]


function loseProb(number, chooseStrategy, gameSetting=defaultGameSetting) {
    const {endNumber, numPeople, maxCall} = gameSetting;
    if (number > endNumber) {
        throw new Error("current number cannot exceed END_NUMBER");
    }
    const initial = Array.from({length: numPeople}, () => 0);
    initial[0] = 1;

    const loseMatrix = [initial];
    while (loseMatrix.length < endNumber - number) {
        // when calling row + 1
        const lookupMat = loseMatrix.slice(loseMatrix.length-maxCall+1, loseMatrix.length);
        loseMatrix.push(_nextLoseProb(lookupMat, chooseStrategy));
    }
    loseMatrix.forEach((val, ind) => console.log(endNumber - ind, val));
    return loseMatrix[loseMatrix.length - 1];
}

function winProb(n) {
    return loseProb(n).map(n=>1-n);
}

console.log(loseProb(-1, defaultChooseStratgy, defaultGameSetting));
