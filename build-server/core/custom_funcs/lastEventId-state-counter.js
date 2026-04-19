class EventCounter{

    lastEventIdCounter = Math.floor(Math.random()*10000);

    eventIncrement(){
        this.lastEventIdCounter = this.lastEventIdCounter + 1;
        return this.lastEventIdCounter;
    } 

    getCounter(){
        return this.lastEventIdCounter;
    }
}

const eventCounter = new EventCounter();

module.exports = { eventCounter};