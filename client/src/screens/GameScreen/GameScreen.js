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
import './GameScreen.css';
import { selectedPlanet } from '../ChangePlanet/ChangePlanet'
import { gameName } from '../LogoScreen/LogoScreen'
import { scale, scaleH, scaleV } from '../../App'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import GameSprite from '../../components/GameSprite'
import { GameSprites } from '../../components/GameSprite'
import Explosion from '../../Sounds/Explosion.mp3'


var earth = new GameObject([0, 0], [500, 500], 0, selectedPlanet.planet, "planet", "", true);
var earthSheild = new GameObject([-1000, -1000], [150, 50], 0, Images.PlanetSheild, "sheild", "", true);
earth.isCollidable = true;
earthSheild.isCollidable = true;


//var t = new GameSprite(Images.ExplosionSprite, 5, 3, [400, 500], 0, [0, 0], 0);
const GameScreen = () => {
    var [backgroundX, setBackgroundX] = useState(0);
    var [backgroundY, setBackgroundY] = useState(0);
    var [time, setTime] = useState(0);
    var [meteorCount, setMeteorCount] = useState(0);
    var [health, setHealth] = useState(100);


    const checkCollision = function () {
        var meteors = [];
        var planets = [];
        var sheilds = [];

        for (var i = 0; i < GameObjects.length; i++)
            if (GameObjects[i].id == "meteor") {
                meteors.push(GameObjects[i]);

                GameObjects[i].onBorderCollision((object, collisionType) => {
                    if (collisionType == "x-collision")
                        object.direction.x *= -1;

                    if (collisionType == "y-collision")
                        object.direction.y *= -1;

                });


            } else if (GameObjects[i].id == "planet")
                planets.push(GameObjects[i])
            else if (GameObjects[i].id == "sheild")
                sheilds.push(GameObjects[i])

        for (var i = 0; i < meteors.length; i++)
            for (var j = i + 1; j < meteors.length; j++)
                meteors[i].onCollision(meteors[j], (object, collisionNormal) => {
                    object.setDirection(collisionNormal);
                    meteors[j].setDirection([-collisionNormal[0], -collisionNormal[1]]);
                })



        for (var i = 0; i < meteors.length; i++)
            for (var j = 0; j < sheilds.length; j++) {
                var currentMeteor = meteors[i];
                var currentSheild = sheilds[j];
                currentMeteor.onCollision(currentSheild, (object, collisionNormal) => {
                    object.setDirection(collisionNormal);
                })
            }

        for (var i = 0; i < meteors.length; i++)
            for (var j = 0; j < planets.length; j++) {
                var currentMeteor = meteors[i];
                var currentPlanet = planets[j];
                currentMeteor.onCollision(currentPlanet, (object, collisionNormal) => {
                    var explosion = new Audio(Explosion);
                    var explotionSize = 100 + object.size.width * object.size.height * object.speed / 720
                    new GameSprite(Images.ExplosionSprite, 5, 3, [object.position.x + 2 * object.speed * object.direction.x, object.position.y + 2 * object.speed * object.direction.y], [explotionSize, explotionSize], 180 / Math.PI * Math.atan2(collisionNormal[1], collisionNormal[0]) + 90);
                    setMeteorCount(meteorCount - 1);
                    setHealth(health => health - (object.speed * object.size.width * object.size.height) / 1000);
                    explosion.volume = 0.5 * (object.size.width * object.size.height * object.speed / 72000);
                    explosion.play();
                    object.destroy();
                })
            }

    }

    const createMeteor = function () {
        setMeteorCount(meteorCount + 1);
        var size = 45 + Math.random() * 75;
        var newMeteor = new GameObject([window.screen.width / 2, window.screen.height / 2], [size, size], 0, Images.Meteor, "meteor", "", true);
        newMeteor.setDirection([Math.random(), Math.random()]);
        newMeteor.speed = 0.5 + Math.random() * 4.5;
        newMeteor.applyPhysics = true;
        newMeteor.angularVelocity = newMeteor.speed;
        newMeteor.isCollidable = true;
        newMeteor.zIndex = 100;

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


    const renderGameSprites = function () {
        return (
            GameSprites.map((sprite, index) => (
                <Fragment key={index}>
                    <div
                        style={{
                            color: "white"
                        }}
                    >
                        {sprite.render(time)}
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

            if (health > 0)
                setHealth(health => (health > 100) ? 100 : health + 0.005);

            setTime(time => (time + 1) % 3600000);
        }, 1);

        const meteorSpawn = setInterval(() => {
            if (meteorCount < 15)
                createMeteor();

        }, 5000);

        return () => {
            clearInterval(gameLoop);
            clearInterval(meteorSpawn);
        }


    }, []);

    useEffect(() => {
        earthSheild.setOrientation(Math.atan2(mousePos.y - earth.position.y, mousePos.x - earth.position.x) * 180 / Math.PI + 90);
        earthSheild.setPosition(300 * Math.cos(Math.atan2(mousePos.y, mousePos.x)), 300 * Math.sin(Math.atan2(mousePos.y, mousePos.x)));
    }, [mousePos.x, mousePos.y]);

    useEffect(() => {
        var img = new Image();
        img.src = Images.SpaceBackground2;

        const moveBackground = setInterval(() => {
            setBackgroundX(backgroundX => (backgroundX - 2) % img.width);
            setBackgroundY(backgroundY => (backgroundY - 4) % img.height);
        }, 50);

        return () => clearInterval(moveBackground);

    }, []);

    return (
        <div className='GameScreen'
            style={{
                color: "red",
                backgroundPositionX: backgroundX,
                backgroundPositionY: backgroundY,
            }}
        >

            <label
                style={{
                    position: 'absolute',
                    height: scale(40),
                    width: scale(200),
                    top: scale(20),
                    left: earth.size.width / 2 + scale(30),
                    fontFamily: 'fantasy',
                    fontSize: scale(20),
                    zIndex: 10000,
                    color: "white"
                }}
            >{gameName}</label>

            <ProgressBar
                variant={(health > 50) ? "success" : (health < 20) ? "danger" : "warning"}
                now={health}
                style={{
                    position: 'absolute',
                    top: scaleV(10),
                    left: scale(280),
                    backgroundColor: "grey",
                    alignSelf: 'center',
                    borderRadius: 0,
                    width: scale(200),
                    zIndex: 100000,
                    height: scale(10),
                }}
            />



            {renderGameObjects()}
            {renderGameSprites()}
        </div>
    );
};

export default GameScreen;