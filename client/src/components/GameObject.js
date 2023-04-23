import React, { Component, useState, useEffect } from 'react'
import Images from '../Images';
import { scale, scaleH, scaleV } from '../App';

var GameObjects = [];

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

class GameObject {

    speed = 0;
    image = "";
    orientation = 0;
    id = "";
    opacity = 1.0;
    angularVelocity = 0;
    isCollidable = false;
    applyPhysics = false;
    visible = true;
    zIndex = 0;


    position = [{
        x: 0,
        y: 0
    }];

    direction = [{
        x: 0,
        y: 0
    }];


    pivot = [{
        x: this.position.x,
        y: this.position.y
    }]

    size = [{
        width: 64,
        height: 64
    }];



    constructor(position, size, orientation, image, id, type, addToGame) {
        if (addToGame)
            GameObjects.push(this);

        this.position.x = position[0];
        this.position.y = position[1];

        this.size.width = size[0];
        this.size.height = size[1];

        this.orientation = orientation;
        this.id = id;
        this.image = image;
        this.type = type;
    }


    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

    setSize(size) {
        this.size.width = size[0];
        this.size.height = size[1];
    }

    setDirection(direction) {
        var magnitude = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2));
        this.direction.x = direction[0] / magnitude;
        this.direction.y = direction[1] / magnitude;
    }

    setPivot(pivot) {
        this.pivot.x = pivot[0];
        this.pivot.y = pivot[1];
    }

    destroy() {
        GameObjects.splice(GameObjects.indexOf(this), 1);
    }
    setOrientation(angle) {
        this.orientation = angle % 360;
    }

    onCollision(object, action) {

        var xDiff = Math.abs(this.position.x - object.position.x);
        var yDiff = Math.abs(this.position.y - object.position.y);
        var mag = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
        //var directionalSpeed = this.speed * (this.direction.x * xDiff + this.direction.y * yDiff);
        if (object.id == "sheild" || object.id == "planet" || object.id == "meteor") {
            if (mag <= + Math.min(object.size.width, object.size.height) / 2 + Math.min(this.size.width, this.size.height) / 2 &&
                this.isCollidable &&
                object.isCollidable)
                action(this, [(0.5 + Math.random() * 0.5) * xDiff / mag, (0.5 + Math.random() * 0.5) * yDiff / mag]);
        } else if (object.id == "dfs" && this.isCollidable && object.isCollidable) {

            var leftEnd = [{
                x: -object.size.width / 2 * Math.cos(object.orientation * Math.PI / 180) + object.position.x,
                y: -object.size.width / 2 * Math.sin(object.orientation * Math.PI / 180) + object.position.y
            }]

            var rightEnd = [{
                x: object.size.width / 2 * Math.cos(object.orientation * Math.PI / 180) + object.position.x,
                y: object.size.width / 2 * Math.sin(object.orientation * Math.PI / 180) + object.position.y

            }]

            var lineVector = difference(rightEnd, leftEnd)
            var positionVector = difference(this.position, rightEnd)
            var radius = Math.min(this.size.width, this.size.height) / 2;
            var angle = Math.acos(multiply(dotProduct(lineVector, positionVector), 1 / (object.size.width * magnitude(positionVector)))) * Math.PI / 180;
            console.log(positionVector);

            if (magnitude(positionVector) * Math.sin(angle) >= radius &&
                magnitude(positionVector) * Math.cos(angle) >= 0 &&
                magnitude(positionVector) * Math.sin(angle) <= object.size.width
            ) {
                var normalVector = rotate(lineVector);

                if (0 <= magnitude(positionVector) * Math.cos(angle) && magnitude(positionVector) * Math.cos(angle) <= radius)
                    normalVector = positionVector
                else if (object.size.width - radius <= magnitude(positionVector) * Math.cos(angle) && magnitude(positionVector) * Math.cos(angle) <= object.size.width)
                    normalVector = difference(this.position, leftEnd);

                action(this, [normalVector.x, normalVector.y]);
            }
        }

    }



    onBorderCollision(action) {
        if (scale(this.position.x - this.size.width / 2) < this.speed || scale(this.position.x + this.size.width / 2) + this.speed > window.screen.width)
            action(this, "x-collision");

        else if (scale(this.position.y - this.size.height / 2) < this.speed || scale(this.position.y + this.size.height / 2) + this.speed > window.screen.height)
            action(this, "y-collision");

    }

    outOfBounds(offset) {

        if (scale(this.position.x - this.size.width / 2) < -scale(offset) || scale(this.position.x + this.size.width / 2) > window.screen.width + scale(offset) ||
            scale(this.position.y - this.size.height / 2) < - scale(offset) || scale(this.position.y + this.size.height / 2) > window.screen.height + scale(offset))
            return true;

    }

    render() {

        if (this.visible)
            return (

                <div
                    style={{
                        color: "red"
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: scaleV(this.position.y),
                            left: scale(this.position.x),
                            width: 0,
                            height: 0,
                        }}
                    >
                        <img
                            style={{
                                height: scale(this.size.height),
                                width: scale(this.size.width),
                                position: 'relative',
                                bottom: scale(this.size.height) / 2,
                                right: scale(this.size.width) / 2,
                                backgroundColor: (this.image == "") ? "grey" : "transparent",
                                transform: "rotate(" + this.orientation + "deg)",
                                zIndex: this.zIndex,
                                opacity: this.opacity,
                            }
                            }

                            src={this.image}
                        />
                    </div>

                    <label
                        style={{
                            color: 'white',
                            position: 'absolute',
                            top: this.position.y,
                            left: this.position.x,
                            zIndex: this.zIndex + 100,

                        }}

                    >

                    </label>

                    {/*<lable
                        style={{
                            position: 'absolute',
                            top: scale(-this.size.width / 2 * Math.sin(this.orientation * Math.PI / 180) + this.position.y),
                            left: scale(-this.size.width / 2 * Math.cos(this.orientation * Math.PI / 180) + this.position.x),
                            zIndex: 100000,

                        }}
                    >
                        {this.c}
                    </lable>

                    <lable
                        style={{
                            position: 'absolute',
                            top: scale(this.size.width / 2 * Math.sin(this.orientation * Math.PI / 180) + this.position.y),
                            left: scale(this.size.width / 2 * Math.cos(this.orientation * Math.PI / 180) + this.position.x),
                            zIndex: 10,
                            backgroundColor: "red"
                        }}
                    >
                        b
                    </lable>*/}
                </div>
            )
    }

}



export default GameObject;

export {
    GameObjects
}



