
export const generateRandomId = ( idLength:number=5)=>{

    const subset = "zxcvbnmqwertyuioplkjhgfdsa0192387456";
    let output = "";
    for(let i=0; i<idLength; i++){
        output += subset[( Math.floor((subset.length)*Math.random()))];
    }

    return output;

}

