
let counter = 0;

function incrementCounter(){
    counter++;
    return counter;
}

function getCounter(){
    return counter;
}

export { incrementCounter, getCounter};