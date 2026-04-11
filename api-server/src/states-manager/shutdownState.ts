

class ShutdownState{

    private isShutdown = false;

    set changeShutDownState( value:boolean){
        this.isShutdown = value;
    } 

    get getShutdownState(){
        return this.isShutdown;
    }
}

export const shutdownState = new ShutdownState();
