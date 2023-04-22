import React, { Component, useState, useEffect } from 'react'
import Images from '../Images';
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
        this.orientation = 0;
        this.width = img.width / xCount;
        this.height = img.height / yCount;
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

        var p1 = this.position[0] - this.width / 2;
        var p2 = this.position[1] - this.height / 2;
        var l = Math.sqrt(Math.pow(this.width * x, 2) + Math.pow(this.height * y, 2));
        var dx = l * Math.cos(Math.PI / 2 - Math.atan2(this.width * x, this.height * y) + Math.PI / 180 * this.orientation);
        var dy = l * Math.sin(Math.PI / 2 - Math.atan2(this.width * x, this.height * y) + Math.PI / 180 * this.orientation);
        var realHeight = this.height * this.yCount;
        var realWidth = this.width * this.xCount;
        var l2 = Math.sqrt(Math.pow(realHeight / 2, 2) + Math.pow(realWidth / 2, 2));
        var radAngle = this.orientation * Math.PI / 180;
        var v = l2 * Math.sqrt(2 * (1 - Math.cos(radAngle)));
        var dx2 = v * Math.cos(Math.PI / 2 - radAngle / 2 - Math.atan2(realHeight / 2, realWidth / 2));
        var dy2 = v * Math.sin(Math.PI / 2 - radAngle / 2 - Math.atan2(realHeight / 2, realWidth / 2));
        console.log("Or: " + l2);
        return (
            <div>

                <img
                    src={this.image}

                    style={{

                        position: "absolute",
                        transform: 'rotate(' + this.orientation + 'deg)',
                        // width: this.size[0] * this.xCount,
                        // height: this.size[1] * this.yCount,
                        left: scale(p1 - dx - dx2), //- ax),
                        top: scaleV(p2 - dy - dy2),// - ay),
                        clip: 'rect(' + (Math.round(y * this.height)) + "px," + (Math.round((x + 1) * this.width)) + "px," + (Math.round((y + 1) * this.height)) + "px," + (Math.round(x * this.width)) + "px)",
                        zIndex: 10000,
                    }}
                />

                <div
                    style={{
                        borderStyle: 'solid',
                        borderWidth: 4,
                        borderColor: "red",
                        position: "absolute",
                        transform: 'rotate(' + this.orientation + 'deg)',
                        width: this.width,
                        height: this.height,
                        top: scaleV(this.position[1] - this.height / 2),
                        left: scale(this.position[0] - this.width / 2),

                        zIndex: 100000,
                    }}
                >

                </div>

            </div >

        )


    }

}

export default GameSprite;

export {
    GameSprites
}