import React, { Component, useState, useEffect } from 'react'
import Images from '../Images';

class GameObject extends Component {
    position = [{
        x: 0,
        y: 0
    }];

    pivot = [{
        x: this.position.x,
        y: this.position.y
    }]

    size = [{
        width: 100,
        height: 100
    }];



    image = "";

    orientation = 50;

    hitBox = "";

    constructor(props) {
        super(props);

        this.position.x = props.position[0];
        this.position.y = props.position[1];

        this.size.width = props.size[0];
        this.size.height = props.size[1];

        this.orientation = props.orientation;
        this.hitBox = props.hitBox;
        this.image = props.image;
    }

    setPivot(pivot) {
        this.pivot.x = pivot[0];
        this.pivot.y = pivot[1];
    }

    setOrientation(angle) {
        this.orientation = angle % 360;
    }


    hasCollided(object) {
        var xDiff = Math.abs(this.position.x - object.position.x);
        var yDiff = Math.abs(this.position.y - object.position.y);

        if (object.hitBox == "rectangle") {
            if (this.hitBox == "rectangle")
                if (xDiff < (this.size.width + object.size.width) / 2 &&
                    yDiff < (this.size.height + object.size.height) / 2)
                    return true;
                else return false;
            else if (this.hitBox == "circle")
                return false;
        }

        return false;
    }

    hasBoundX() {
        return (this.position.x - this.size.width / 2 < 0 || this.position.x + this.size.width / 2 > window.screen.width);
    }

    hasBoundY() {
        return (this.position.y - this.size.height / 2 < 0 || this.position.y + this.size.height / 2 > window.screen.height);
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }


    render() {
        return (
            <div>
                <div
                    style={{
                        position: 'absolute',
                        top: this.position.y,
                        left: this.position.x,
                        width: 0,
                        height: 0,
                    }}
                >
                    <img
                        style={{
                            height: this.size.height,
                            width: this.size.width,
                            position: 'relative',
                            bottom: this.size.height / 2,
                            right: this.size.width / 2,
                            backgroundColor: (this.image == "") ? "grey" : "transparent",
                            transform: "rotate(" + this.orientation + "deg)",
                        }
                        }

                        src={this.image}
                    />
                </div>
            </div>
        )
    }

}



export default GameObject;



