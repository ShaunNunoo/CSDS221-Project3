import React, { Component, useState, useEffect } from 'react'
import Images from '../Images';
import { scale, scaleH, scaleV } from '../App';

var GameObjects = [];

class GameObject {

    speed = 0;
    image = "";
    orientation = 0;
    id = "";
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
    }


    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
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

    setOrientation(angle) {
        this.orientation = angle % 360;
    }

    onCollision(object, action) {

        var xDiff = Math.abs(this.position.x - object.position.x);
        var yDiff = Math.abs(this.position.y - object.position.y);
        var mag = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
        //var directionalSpeed = this.speed * (this.direction.x * xDiff + this.direction.y * yDiff);


        if (mag <= + Math.min(object.size.width, object.size.height) / 2 + Math.min(this.size.width, this.size.height) / 2 &&
            this.isCollidable &&
            object.isCollidable)
            action(this, [xDiff / mag, yDiff / mag]);




    }

    onBorderCollision(action) {
        if (this.position.x - this.size.width / 2 < 0 - this.speed || this.position.x + this.size.width / 2 + this.speed > window.screen.width)
            action(this, "x-collision");

        else if ((this.position.y - this.size.height / 2 < 0 - this.speed || this.position.y + this.size.height / 2 + this.speed > window.screen.height))
            action(this, "y-collision");

    }

    render() {
        if (this.visible)
            return (

                <div>
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
                </div>
            )
    }

}



export default GameObject;

export {
    GameObjects
}



