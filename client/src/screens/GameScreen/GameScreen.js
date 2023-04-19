import React, { Fragment, useState, useEffect, useRef } from 'react'
import Images from '../../Images'
import '../LogoScreen/LogoScreen.css'
import LobbyTheme from '../../Sounds/LobbyTheme.mp3'
import GameObject from '../../components/GameObject'
import { GameObjects } from '../../components/GameObject'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Routes
} from "react-router-dom";


var meteor = new GameObject([100, 300], [50, 50], 0, Images.Meteor, "meteor", "", true);
var earth = new GameObject([0, 0], [500, 500], 0, Images.Earth, "planet", "", true);
var earthSheild = new GameObject([-1000, -1000], [150, 50], 0, Images.PlanetSheild, "none", "", true);
meteor.setDirection([-0.5, -0.5]);
meteor.speed = 1;
meteor.applyPhysics = true;
meteor.angularVelocity = 0.5;
meteor.isCollidable = true;
earth.isCollidable = true;


meteor.zIndex = 100;

const GameScreen = () => {

    const checkCollision = function () {
        for (var i = 0; i < GameObjects.length; i++)
            for (var j = 0; j < GameObjects.length; j++) {
                var obj1 = GameObjects[i];
                var obj2 = GameObjects[j];

                if (obj1.id == "meteor") {

                    obj1.onBorderCollision((object, collisionType) => {
                        if (collisionType == "x-collision")
                            object.direction.x *= -1;

                        if (collisionType == "y-collision")
                            object.direction.y *= -1;

                    });

                    if ((obj2.id == "planet") && j !== i)
                        obj1.onCollision(obj2, (object, collisionNormal) => {
                            object.setDirection(collisionNormal);
                            obj2.setDirection([1 * collisionNormal[0], -1 * collisionNormal[1]]);
                        });

                } else break;
            }

    }

    const createMeteor = function (enable) {
        if (enable) {
            var size = 35 + Math.random() * 75;
            var newMeteor = new GameObject([window.screen.width / 2, window.screen.height / 2], [size, size], 0, Images.Meteor, "meteor", "");
            newMeteor.setDirection([Math.random(), Math.random()]);
            newMeteor.speed = 0.5 + Math.random() * 3.5;
            newMeteor.applyPhysics = true;
            newMeteor.angularVelocity = newMeteor.speed;
            newMeteor.isCollidable = true;
            newMeteor.zIndex = 100;
        }
    }

    const [mousePos, setMousePos] = useState({});

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePos({ x: event.clientX, y: event.clientY });

        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {

            window.removeEventListener(
                'mousemove',
                handleMouseMove
            );
        };



    }, []);

    const renderGameObjects = function () {
        return (
            GameObjects.map((object, index) => (
                <Fragment key={index}>
                    <div
                        style={{
                            color: "white"
                        }}
                    >
                        {object.render()}
                    </div>
                </Fragment>
            ))
        )
    }

    const updateGameObjects = function () {
        GameObjects.forEach(object => {
            if (object.applyPhysics) {
                object.position.x += object.direction.x * object.speed;
                object.position.y += object.direction.y * object.speed;
                object.setOrientation(object.orientation + object.angularVelocity);
            }
        });
    }


    useEffect(() => {
        const gameLoop = setInterval(() => {
            checkCollision();
            updateGameObjects();


        }, 1);


        var count = 1;
        const meteorSpawn = setInterval(() => {
            createMeteor((count < 10));
            count++;
        }, 5000);

        return () => clearInterval(gameLoop);

    }, []);

    useEffect(() => {

        earthSheild.setOrientation(Math.atan2(mousePos.y - earth.position.y, mousePos.x - earth.position.x) * 180 / Math.PI + 90);
        earthSheild.setPosition(300 * Math.cos(Math.atan2(mousePos.y, mousePos.x)), 300 * Math.sin(Math.atan2(mousePos.y, mousePos.x)));
    }, [mousePos.x, mousePos.y]);


    return (
        <div
            style={{
                color: "red"
            }}
        >   {/*mousePos.x}, {mousePos.y*/}
            {renderGameObjects()}
        </div>
    );
};

export default GameScreen;