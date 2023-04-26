import Images from "./Images.js";
//import GameObject from "./GameObject";


const dotProduct = function (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

const magnitude = function (v) {
    return Math.sqrt(Math.pow(v.x, 2), Math.pow(v.y, 2));
}

const difference = function (v1, v2) {
    return [{
        x: v1.x - v2.x,
        y: v1.y - v2.y
    }];
}

const multiply = function (v, c) {
    return [{
        x: v.x * c,
        y: v.y * c
    }];
}

const normal = function (v) {
    return [{
        x: v.x / magnitude(v),
        y: v.y / magnitude(v),
    }];
}

const rotate = function (v) {
    return [{
        x: -v.y,
        y: v.x
    }];
}




export default class GameEvent{

    gameID = "";
    gameSize = 0;
    players = [];
    GameObjects = [new GameObject([500,500],[50,50],0,"./Images/JupiterBackground.jpg","planet","",true)];


    constructor(gameID, gameSize,players){
        this.gameID = gameID;
        this.gameSize = gameSize;
        this.players = players;
    }


   
    
}