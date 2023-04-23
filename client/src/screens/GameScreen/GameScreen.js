import React, { Fragment, useState, useEffect, useRef } from 'react'
import Images from '../../Images'
import '../LogoScreen/LogoScreen.css'
import LobbyTheme from '../../Sounds/LobbyTheme.mp3'
import ButtonClick from '../../Sounds/ButtonClick.mp3'
import ButtonHover from '../../Sounds/ButtonHover.mp3'
import PlanetChange from '../../Sounds/PlanetChange.mp3'
import GameObject from '../../components/GameObject'
import { GameObjects } from '../../components/GameObject'
import { Navigate, useNavigate } from "react-router-dom";

import './GameScreen.css';
import { selectedPlanet } from '../ChangePlanet/ChangePlanet'
import { gameName } from '../LogoScreen/LogoScreen'
import { scale, scaleH, scaleV } from '../../App'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import GameSprite from '../../components/GameSprite'
import { GameSprites } from '../../components/GameSprite'
import Explosion from '../../Sounds/Explosion.mp3'
import Modal from 'react-bootstrap/Modal';
import { music } from '../LogoScreen/LogoScreen'
var earth = new GameObject([0, 0], [500, 500], 0, selectedPlanet.planet, "planet", "", true);
var earthSheild = new GameObject([-1000, -1000], [selectedPlanet.stats.defence / 100 * 225, selectedPlanet.stats.defence / 100 * 75], 0, Images.PlanetSheild, "sheild", "", true);
var blackHole = new GameObject([window.screen.width / 2, window.screen.height / 2], [400, 400], 0, Images.BlackHole, "blackHole", "none", false);
var destroyed = false;

const GameScreen = () => {
    music.play();
    const navigate = useNavigate()
    blackHole.opacity = 0.9;
    earth.image = selectedPlanet.planet;
    earthSheild.setSize([20 + selectedPlanet.stats.defence / 100 * 225, 10 + selectedPlanet.stats.defence / 100 * 75]);
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
                        object.setDirection([(0.5 + Math.random() * 0.5) * -object.direction.x, (0.5 + Math.random() * 0.5) * object.direction.y])


                    if (collisionType == "y-collision")
                        object.setDirection([(0.5 + Math.random() * 0.5) * object.direction.x, (0.5 + Math.random() * 0.5) * -object.direction.y])

                    if (object.outOfBounds(5))
                        object.destroy();
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
                    setHealth(health -= (object.speed * (65 - selectedPlanet.stats.strength / 100 * 40) * object.size.width * object.size.height) / 72000);
                    explosion.volume = 0.5 * (object.size.width * object.size.height * object.speed / 72000);
                    explosion.play();
                    object.destroy();
                    if (health <= 0)
                        destroyed = true;
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

    const [mousePos, setMousePos] = useState({ x: window.screen.width / 2, y: window.screen.height / 2 });

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
            if (!destroyed)
                destroyed = (health <= 0);

            earth.visible = !destroyed;
            earth.isCollidable = !destroyed;
            earthSheild.isCollidable = !destroyed;
            earthSheild.visible = !destroyed;

            checkCollision();
            updateGameObjects();
            earth.setOrientation(earth.orientation + 0.01);
            blackHole.setOrientation(blackHole.orientation - 0.5);
            if (!destroyed && health <= 100)
                setHealth(health = ((health > 100) ? 100 : health + selectedPlanet.stats.defence / 100 * 0.01));

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

    const [spectateHover, setSpectateHover] = useState(false);
    const [menuHover, setMenuHover] = useState(false);

    const renderBackButotn = function () {
        return (
            <div>
                <img

                    style={{
                        position: 'absolute',
                        top: scaleV(25),
                        left: scale(23),
                        height: scale(50),
                        width: scale(50),
                        transform: "scaleX(-1)",
                        zIndex: 100000001,
                    }}
                    src={Images.BackButton2}
                />
                <button

                    onMouseEnter={() => {
                        (new Audio(ButtonHover)).play();
                    }}
                    onClick={() => {
                        (new Audio(ButtonClick)).play();
                        navigate(-1);
                    }}

                    style={{
                        borderWidth: 0,
                        position: 'absolute',
                        top: scaleV(10),
                        left: scale(10),
                        height: scale(80),
                        width: scale(80),
                        borderColor: "lightblue",
                        backgroundColor: "transparent",
                        borderWidth: scale(4),
                        borderRadius: scale(100),
                        zIndex: 100000001,


                    }}

                />
            </div>

        )

    }

    const [spectating, setSpectating] = useState(false)
    return (
        <div className='GameScreen'
            style={{
                color: "red",
                backgroundPositionX: backgroundX,
                backgroundPositionY: backgroundY,
            }}
        >
            <div
                style={{
                    opacity: (destroyed && !spectating) ? 1 : 0
                }}
            >
                <div
                    style={{
                        backgroundColor: "black",
                        position: "absolute",
                        zIndex: 100000000,
                        opacity: (destroyed) ? 0.7 : 0,
                        height: window.screen.height,
                        width: window.screen.width,

                    }}
                >

                </div>

                <label
                    style={{
                        position: 'absolute',
                        height: scale(40),
                        width: scale(400),
                        top: window.screen.height / 2 - scale(140),
                        left: window.screen.width / 2 - scale(180),
                        fontFamily: 'fantasy',
                        fontSize: scale(80),
                        zIndex: 100000001,
                        color: "blue",
                        textShadow: "10 10 #FF0000"
                    }}

                >GAME OVER</label>

                <button className='PlayButton'
                    disabled={!destroyed || spectating}
                    style={{
                        position: "absolute",
                        left: window.screen.width / 2 + scale(20),
                        top: window.screen.height / 2 + scale(0),
                        zIndex: 100000001,
                        width: scale(200),
                        height: scale(60),
                        fontSize: scale(40),
                        color: (menuHover) ? "blueviolet" : "white",

                    }}
                    onMouseEnter={() => {
                        setMenuHover(true);
                    }}

                    onMouseLeave={() => {
                        setMenuHover(false);
                    }}
                    onClick={() => {
                        navigate(-1);
                    }}
                >

                    MENU
                </button>


                <button className='PlayButton'
                    disabled={!destroyed || spectating}
                    style={{
                        position: "absolute",
                        left: window.screen.width / 2 - scale(220),
                        top: window.screen.height / 2 + scale(0),
                        zIndex: 100000001,
                        width: scale(200),
                        height: scale(60),
                        fontSize: scale(40),
                        color: (spectateHover) ? "blueviolet" : "white",

                    }}

                    onMouseEnter={() => {
                        setSpectateHover(true);
                    }}

                    onMouseLeave={() => {
                        setSpectateHover(false);
                    }}


                    onClick={() => {
                        setSpectating(true);
                    }}
                >

                    SPECTATE
                </button>
            </div>


            <label
                style={{
                    position: 'absolute',
                    height: scale(40),
                    width: scale(200),
                    top: scale(20),
                    left: scale(earth.size.width / 2 + 30),
                    fontFamily: 'fantasy',
                    fontSize: scale(20),
                    zIndex: 10000,
                    color: "white"
                }}
            >{gameName}</label>

            {!destroyed && <ProgressBar
                variant={(health > 50) ? "success" : (health < 25) ? "danger" : "warning"}
                now={Math.max(0, health)}
                speed={100}
                label={`${Math.round(health)}%`}
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
            />}

            {spectating && renderBackButotn()}
            {blackHole.render()}
            {renderGameObjects()}
            {renderGameSprites()}
        </div>
    );
};

export default GameScreen;