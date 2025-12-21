
let counter = 0;

function incrementCounter(){
    counter++;
    return counter;
}

function getCounter(){
    return counter;
}

module.exports = { incrementCounter, getCounter};