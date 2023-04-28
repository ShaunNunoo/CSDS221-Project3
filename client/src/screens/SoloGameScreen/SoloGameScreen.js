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
import { getPlanet } from '../LogoScreen/LogoScreen'
import './GameScreen.css';
import Planets from '../../components/Planets'
import { gameName } from '../LogoScreen/LogoScreen'
import { scale, scaleH, scaleV } from '../../App'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import GameSprite from '../../components/GameSprite'
import { GameSprites } from '../../components/GameSprite'
import Explosion from '../../Sounds/Explosion.mp3'
import Bump from '../../Sounds/bump.mp3'
import Modal from 'react-bootstrap/Modal';
import { c } from '../../App'
import { music } from '../LogoScreen/LogoScreen'
const screenWidth = 1535;
const screenHeight = 863;
const gravitationalConstant = 0.0000667;

var planetNum = parseInt(sessionStorage.getItem("selectedPlanet"));
var earth = new GameObject([1535 / 2, 863 / 2], [300, 300], 0, Planets.Earth.planet, "planet", "", true);
var earthSheild = new GameObject([-1000, -1000], [getPlanet(planetNum).stats.defence / 100 * 225, getPlanet(planetNum).stats.defence / 100 * 75], 0, Images.PlanetSheild, "sheild", "", true);
var destroyed = false;
var spawnSize = 1;
const SoloGameScreen = () => {
    const navigate = useNavigate();
    planetNum = parseInt(sessionStorage.getItem("selectedPlanet"));
    earth.setPosition(screenWidth / 2, screenHeight / 2);

    useEffect(() => {

        if (sessionStorage.getItem("backToMenu") != null) {
            navigate(-1);
            sessionStorage.removeItem("backToMenu");
        }
    }, [])


    var [deflects, setDeflects] = useState(0);
    earth.image = getPlanet(planetNum).planet;
    earthSheild.setSize([20 + getPlanet(planetNum).stats.defence / 100 * 225, 10 + getPlanet(planetNum).stats.defence / 100 * 75]);
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

                    /*if (collisionType == "x-collision")
                        object.setDirection([(0.5 + Math.random() * 0.5) * -object.direction.x, (0.5 + Math.random() * 0.5) * object.direction.y])
 
 
                    if (collisionType == "y-collision")
                        object.setDirection([(0.5 + Math.random() * 0.5) * object.direction.x, (0.5 + Math.random() * 0.5) * -object.direction.y])
*/
                    if (object.outOfBounds(1000)) {
                        object.destroy();
                        setMeteorCount(meteorCount -= 1);
                    }
                });


            } else if (GameObjects[i].id == "planet")
                planets.push(GameObjects[i])
            else if (GameObjects[i].id == "sheild")
                sheilds.push(GameObjects[i])

        for (var i = 0; i < meteors.length; i++)
            for (var j = i + 1; j < meteors.length; j++)

                if (meteors[i].position.x - meteors[i].size.width / 2 >= 0 && meteors[i].position.x + meteors[i].size.width / 2 <= screenWidth &&
                    meteors[i].position.y - meteors[i].size.height / 2 >= 0 && meteors[i].position.y + meteors[i].size.height / 2 <= screenHeight &&
                    meteors[j].position.x - meteors[j].size.width / 2 >= 0 && meteors[j].position.x + meteors[j].size.width / 2 <= screenWidth &&
                    meteors[j].position.y - meteors[j].size.height / 2 >= 0 && meteors[j].position.y + meteors[j].size.height / 2 <= screenHeight
                )
                    meteors[i].onCollision(meteors[j], (object, collisionNormal) => {


                        var mag = Math.sqrt(collisionNormal[0] * collisionNormal[0] + collisionNormal[1] * collisionNormal[1]);

                        var v = [collisionNormal[0] / mag, collisionNormal[1] / mag];
                        var u = [-collisionNormal[1] / mag, collisionNormal[0] / mag];


                        var v1 = [
                            object.speed * object.direction.x * v[0] + object.speed * object.direction.y * v[1],
                            object.speed * object.direction.x * u[0] + object.speed * object.direction.y * u[1]
                        ];
                        var s1 = object.speed;
                        var s2 = meteors[j].speed;
                        var v2 = [
                            meteors[j].speed * meteors[j].direction.x * v[0] + meteors[j].speed * meteors[j].direction.y * v[1],
                            meteors[j].speed * meteors[j].direction.x * u[0] + meteors[j].speed * meteors[j].direction.y * u[1]
                        ];
                        var m1 = (object.size.width * object.size.height);
                        var m2 = (meteors[j].size.width * meteors[j].size.height);



                        object.speed = (s1 * (m1 - m2) + 2 * m2 * s2) / (m1 + m2);
                        meteors[j].speed = (s2 * (m2 - m1) + 2 * m1 * s1) / (m1 + m2);



                        object.setDirection([
                            (v1[0] * (m1 - m2) + 2 * m2 * v2[0]) / (m1 + m2) * v[0] + (v1[1] * (m1 - m2) + 2 * m2 * v2[1]) / (m1 + m2) * u[0],
                            (v1[0] * (m1 - m2) + 2 * m2 * v2[0]) / (m1 + m2) * v[1] + (v1[1] * (m1 - m2) + 2 * m2 * v2[1]) / (m1 + m2) * u[1]
                        ]);
                        meteors[j].setDirection([
                            (v2[0] * (m2 - m1) + 2 * m1 * v1[0]) / (m1 + m2) * v[0] + (v2[1] * (m2 - m1) + 2 * m1 * v1[1]) / (m1 + m2) * u[0],
                            (v2[0] * (m2 - m1) + 2 * m1 * v1[0]) / (m1 + m2) * v[1] + (v2[1] * (m2 - m1) + 2 * m1 * v1[1]) / (m1 + m2) * u[1]
                        ]);

                        if (object.speed == 0 || (object.direction.x == 0 && object.direction.y == 0)) {
                            object.speed = 1;
                            object.setDirection([Math.random(), Math.random()]);

                        }
                    })



        for (var i = 0; i < meteors.length; i++) {
            for (var j = 0; j < sheilds.length; j++) {
                var currentMeteor = meteors[i];
                var currentSheild = sheilds[j];

                currentMeteor.onCollision(currentSheild, (object, collisionNormal) => {
                    if (object.direction.x * (screenWidth / 2 - object.position.x) + object.direction.y * (screenHeight / 2 - object.position.y) >= 0) {
                        setDeflects(deflects += 1);
                        var norm = [object.position.x - earth.position.x, object.position.y - earth.position.y];
                        var mag = 200

                        norm = [norm[0] / mag, norm[1] / mag];
                        var dir = [object.direction.x, object.direction.y];
                        var dot = norm[0] * dir[0] + norm[1] * dir[1];

                        object.setDirection([dir[0] - 2 * dot * norm[0], dir[1] - 2 * dot * norm[1]]);

                        new Audio(Bump).play()
                    }


                })
            }
        }

        for (var i = 0; i < meteors.length; i++)
            for (var j = 0; j < planets.length; j++) {
                var currentMeteor = meteors[i];
                var currentPlanet = planets[j];
                currentMeteor.onCollision(currentPlanet, (object, collisionNormal) => {
                    var explosion = new Audio(Explosion);
                    var explotionSize = 100 + object.size.width * object.size.height * object.speed / 432
                    new GameSprite(Images.ExplosionSprite, 5, 3, [object.position.x + 2 * object.speed * object.direction.x, object.position.y + 2 * object.speed * object.direction.y], [explotionSize, explotionSize], 180 / Math.PI * Math.atan2(collisionNormal[1], collisionNormal[0]) + 90);
                    setMeteorCount(meteorCount -= 1);
                    setHealth(health -= (object.speed * (65 - getPlanet(planetNum).stats.strength / 100 * 40) * object.size.width * object.size.height) / 43200);
                    explosion.volume = Math.max(0, Math.min(1, (object.size.width * object.size.height * object.speed / 43200)));
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
        var position = Math.random() * Math.PI * 2;
        var radius = screenWidth / 2 + 100;
        var newMeteor = new GameObject([radius * Math.cos(position) + screenWidth / 2, radius * Math.sin(position) + screenHeight / 2], [size, size], 0, Images.Meteor, "meteor", "", true);
        newMeteor.setDirection([(0.1 + Math.random() * 0.9) * (screenWidth / 2 - newMeteor.position.x), (0.1 + Math.random() * 0.9) * (screenHeight / 2 - newMeteor.position.y)]);
        newMeteor.speed = 0.5 + Math.random() * 2.5;
        newMeteor.applyPhysics = true;
        setMeteorCount(meteorCount += 1);
        newMeteor.angularVelocity = newMeteor.speed;
        newMeteor.isCollidable = true;
        newMeteor.zIndex = 100;

    }

    const [mousePos, setMousePos] = useState({ x: screenWidth / 2, y: screenHeight / 2 });

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
            if (!destroyed && health <= 100)
                setHealth(health = ((health > 100) ? 100 : health + getPlanet(planetNum).stats.defence / 100 * 0.01));

            setTime(time => (time + 1) % 3600000);
        }, 1);

        const meteorSpawn = setInterval(() => {
            if (!destroyed && meteorCount < Math.round(spawnSize))
                createMeteor();

            if (spawnSize < 40)
                spawnSize += 0.025;


        }, 400);

        return () => {
            clearInterval(gameLoop);
            clearInterval(meteorSpawn);
        }


    }, []);

    useEffect(() => {
        var w = screenWidth;
        var h = screenHeight;
        var mouseOrientation = Math.atan2(mousePos.y - scale(earth.position.y), mousePos.x - scale(earth.position.x)) * 180 / Math.PI + 90;
        //  var angle = (mouseOrientation < 0) ? mouseOrientation + 360 : mouseOrientation;
        //console.log(Math.min(angle - earthSheild.orientation, 360 - angle + earthSheild.orientation))
        //if (earthSheild.orientation != angle) {
        //     earthSheild.orientation += (Math.abs(Math.min(Math.abs(angle - earthSheild.orientation)), 360 - Math.abs(angle - earthSheild.orientation)) / 50);
        //    earthSheild.orientation %= 360;
        earthSheild.setOrientation(mouseOrientation);
        earthSheild.setPosition(200 * Math.cos((mouseOrientation - 90) * Math.PI / 180) + w / 2, 200 * Math.sin((mouseOrientation - 90) * Math.PI / 180) + h / 2);
        //  }
    });

    useEffect(() => {
        const moveBackground = setInterval(() => {
            setBackgroundX(backgroundX => (backgroundX - 2) % 708);
            setBackgroundY(backgroundY => (backgroundY - 4) % 707);
        }, 50);

        return () => clearInterval(moveBackground);

    }, []);

    if (destroyed && parseInt(localStorage.getItem("personalBest")) < deflects)
        localStorage.setItem("personalBest", deflects);

    const [spectateHover, setSpectateHover] = useState(false);
    const [menuHover, setMenuHover] = useState(false);
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
                        height: screenHeight,
                        width: screenWidth,

                    }}
                >

                </div>
                <label
                    style={{
                        position: 'absolute',
                        height: scale(40),
                        width: scale(400),
                        top: scale(screenHeight / 2 - 40),
                        left: scaleH(screenWidth / 2) - scale(120),
                        fontFamily: 'fantasy',
                        fontSize: scale(40),
                        zIndex: 100000001,
                        color: "white",
                        textShadow: "10 10 #FF0000"
                    }}

                >TOTAL DEFLECTS </label>

                <label
                    style={{
                        position: 'absolute',
                        height: scale(40),
                        width: scale(400),
                        top: scale(screenHeight / 2 + 80),
                        left: scaleH(screenWidth / 2) - scale(120),
                        fontFamily: 'fantasy',
                        fontSize: scale(40),
                        zIndex: 100000001,
                        color: "purple",
                        textShadow: "10 10 #FF0000"
                    }}

                >PERSONAL BEST</label>


                <label
                    style={{
                        position: 'absolute',
                        height: scale(40),
                        width: scale(screenWidth),
                        top: scale(screenHeight / 2 + 130),
                        left: scaleH(screenWidth / 2) - scale(10 * (deflects == 0 ? 1 : Math.floor(Math.log10(deflects)))),
                        fontFamily: 'fantasy',
                        fontSize: scale(40),
                        zIndex: 100000001,
                        color: "purple",
                        textShadow: "10 10 #FF0000"
                    }}

                >{localStorage.getItem("personalBest")}</label>


                <label
                    style={{
                        position: 'absolute',
                        height: scale(40),
                        width: scale(screenWidth),
                        top: scale(screenHeight / 2 + 10),
                        left: scaleH(screenWidth / 2) - scale(10 * (deflects == 0 ? 1 : Math.floor(Math.log10(deflects)))),
                        fontFamily: 'fantasy',
                        fontSize: scale(40),
                        zIndex: 100000001,
                        color: "white",
                        textShadow: "10 10 #FF0000"
                    }}

                >{deflects}</label>

                <label
                    style={{
                        position: 'absolute',
                        height: scale(40),
                        width: scale(800),
                        top: scale(screenHeight / 2 - 220),
                        left: scaleH(screenWidth / 2) - scale(270),
                        fontFamily: 'fantasy',
                        fontSize: scale(120),
                        zIndex: 100000001,
                        color: "blue",
                        textShadow: "10 10 #FF0000"
                    }}

                >GAME OVER</label>

                <button className='PlayButton'
                    disabled={!destroyed || spectating}
                    style={{
                        position: "absolute",
                        left: scaleH(screenWidth / 2) - scale(220),
                        top: scale(screenHeight / 2 + 200),
                        zIndex: 100000001,
                        width: scale(200),
                        height: scale(60),
                        fontSize: scale(40),
                        color: (menuHover) ? "blueviolet" : "white",
                        padding: 0,

                    }}
                    onMouseEnter={() => {
                        setMenuHover(true);
                    }}

                    onMouseLeave={() => {
                        setMenuHover(false);
                    }}
                    onClick={() => {
                        sessionStorage.setItem("backToMenu", "");
                        sessionStorage.setItem("audioTime", music.currentTime);
                        window.location.reload();
                    }}
                >

                    MENU
                </button>


                <button className='PlayButton'
                    disabled={!destroyed || spectating}
                    style={{
                        position: "absolute",
                        left: scaleH(screenWidth / 2) + scale(20),
                        top: scale(screenHeight / 2 + 200),
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
                        window.location.reload();
                    }}
                >

                    RESTART
                </button>
            </div>

            {!destroyed && <button className='PlayButton'

                style={{
                    position: "absolute",
                    left: scaleH(screenWidth) - scale(160),
                    top: scale(screenHeight - 50),
                    zIndex: 100000001,
                    width: scale(150),
                    height: scale(40),
                    fontSize: scale(25),
                    color: (spectateHover) ? "blueviolet" : "white",

                }}

                onMouseEnter={() => {
                    setSpectateHover(true);
                }}

                onMouseLeave={() => {
                    setSpectateHover(false);
                }}


                onClick={() => {
                    window.location.reload();
                }}
            >

                RESTART
            </button>}


            {!destroyed && <button className='PlayButton'

                style={{
                    position: "absolute",
                    left: scaleH(screenWidth) - scale(320),
                    top: scale(screenHeight - 50),
                    zIndex: 100000001,
                    width: scale(150),
                    height: scale(40),
                    fontSize: scale(25),
                    color: (menuHover) ? "blueviolet" : "white",

                }}
                onMouseEnter={() => {
                    setMenuHover(true);
                }}

                onMouseLeave={() => {
                    setMenuHover(false);
                }}
                onClick={() => {
                    sessionStorage.setItem("backToMenu", "");
                    sessionStorage.setItem("audioTime", music.currentTime);
                    window.location.reload();

                }}
            >

                MENU
            </button>}


            {!destroyed && <label
                style={{
                    position: 'absolute',
                    height: scale(40),
                    width: scale(200),
                    top: scale(40),
                    left: scale(10),
                    fontFamily: 'fantasy',
                    fontSize: scale(20),
                    zIndex: 10000,
                    color: "white"
                }}
            >DEFLECTS: {deflects}</label>}

            {!destroyed && <ProgressBar
                variant={(health > 50) ? "success" : (health < 25) ? "danger" : "warning"}
                now={Math.max(0, health)}
                animated
                speed={100}
                label={`${Math.round(health)}%`}

                style={{
                    position: 'absolute',
                    top: scaleV(10),
                    left: scale(10),
                    backgroundColor: "grey",
                    fontSize: scale(15),
                    fontFamily: "fantasy",
                    alignSelf: 'center',
                    borderRadius: 0,
                    width: scale(400),
                    zIndex: 100000,
                    height: scale(30),
                }}
            />}

            {renderGameObjects()}
            {renderGameSprites()}
        </div>
    );

};


export default SoloGameScreen;

export {
    screenWidth,
    screenHeight
}