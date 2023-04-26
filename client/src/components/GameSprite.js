
import { scale, scaleH, scaleV } from '../App';
var GameSprites = [];

class GameSprite {
    image = "";
    xCount = 0;
    yCount = 0;
    position = [0, 0];
    width = 0;
    height = 0;
    fps = 90;
    createTime = 0;
    orientation = 0;
    repeat = false;
    begin = false;
    size = [0, 0]


    constructor(image, xCount, yCount, position, size, orientation) {
        GameSprites.push(this);
        var img = new Image();
        img.src = image;

        this.image = image;
        this.xCount = xCount;
        this.yCount = yCount;
        this.orientation = orientation;
        this.width = size[0];
        this.height = size[1];
        this.position = position;
        this.size = size;


    }

    destroy() {
        this.image = null;
        GameSprites.splice(GameSprites.indexOf(this), 1);
    }

    render(time) {
        if (!this.begin) {
            this.begin = true;
            this.createTime = time;
        }


        var spriteNum = Math.floor((time - this.createTime) * this.fps / 1000) % (this.xCount * this.yCount);
        var x = Math.floor(spriteNum % this.xCount);
        var y = Math.floor(spriteNum / this.xCount);

        //x *= this.size[0] / this.width;
        //y *= this.size[1] / this.height;
        if (spriteNum == this.xCount * this.yCount - 1 && !this.repeat) {
            this.destroy();
            return;
        }

       
        var l = Math.sqrt(Math.pow(this.width * x, 2) + Math.pow(this.height * y, 2));
        var dx = l * Math.cos(Math.PI / 2 - Math.atan2(this.width * x, this.height * y) + Math.PI / 180 * this.orientation);
        var dy = l * Math.sin(Math.PI / 2 - Math.atan2(this.width * x, this.height * y) + Math.PI / 180 * this.orientation);
        var realHeight = this.height * this.yCount;
        var realWidth = this.width * this.xCount;
        var radAngle = this.orientation * Math.PI / 180;
        var p1 = this.position[0] - (this.width*Math.cos(-radAngle) + this.height*Math.sin(-radAngle))/2;
        var p2 = this.position[1] - (-this.width*Math.sin(-radAngle) + this.height*Math.cos(-radAngle))/2;
        var dx2 =  -realWidth * (1 - Math.cos(radAngle)) / 2 - realHeight * Math.sin(radAngle) / 2;
        var dy2 =  -realWidth * Math.sin(radAngle) / 2 + realHeight * (1 - Math.cos(radAngle)) / 2;


        return (
            <div>
                <img
                    src={this.image}
                    style={{
                        position: "absolute",
                        transform: 'rotate(' + this.orientation + 'deg)',
                        width: scale(this.width * this.xCount),
                        height: scale(this.height * this.yCount),
                        left: scale(p1 - dx + dx2),
                        top: scaleV(p2 - dy - dy2),
                        clip: 'rect(' + scale(Math.round(y * this.height)) + "px," + scale(Math.round((x + 1) * this.width)) + "px," + scale(Math.round((y + 1) * this.height)) + "px," + scale(Math.round(x * this.width)) + "px)",
                        zIndex: 10000,
                    }}
                />

            </div >
        )
    }

}

export default GameSprite;

export {
    GameSprites
}