export default class Queue{

    stack1 = []
    stack2 = []
    stack3 = []
    stack4 = []

    constructor(player){

        switch(player.gameSize){
            case 1:
                stack1.push(player);
                break;
            case 2:
                stack1.push(player);
                break;

            case 3:
                stack1.push(player);
                break;

            case 4:
                stack1.push(player);
                break;
        }
    }
}