import React, { useState, useEffect, useRef } from 'react'
import Images from '../../Images'
import { useNavigate } from "react-router-dom";
import '../LogoScreen/LogoScreen.css'
import { scale, scaleH, scaleV } from '../../App'
import Planets from '../../components/Planets';
import GameObject from '../../components/GameObject';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import ButtonClick from '../../Sounds/ButtonClick.mp3'
import ButtonHover from '../../Sounds/ButtonHover.mp3'
import PlanetChange from '../../Sounds/PlanetChange.mp3'
import LobbyTheme from '../../Sounds/LobbyTheme.mp3'
const screenWidth = 1535;
const screenHeight = 863;
const getPlanet = function (num) {
    switch (num) {
        case 0:
            return Planets.Mercury;
        case 1:
            return Planets.Venus;
        case 2:
            return Planets.Earth;
        case 3:
            return Planets.Mars;
        case 4:
            return Planets.Jupiter;
        case 5:
            return Planets.Neptune;
        case 6:
            return Planets.Uranus;
        case 7:
            return Planets.Neptune;
        case 8:
            return Planets.Pluto;
        default:
            return Planets.Earth;
    }
}



var planetNum = parseInt(sessionStorage.getItem("selectedPlanet"));
var earthSheild = new GameObject([500, 500], [225, 75], 0, Images.PlanetSheild, "none", "", false);
var planet = new GameObject([0, screenHeight], [1000, 1000], 0, getPlanet(planetNum), "none", "", false);
var gameName = ""
const music = new Audio(LobbyTheme);
music.loop = true;
music.autoplay = true;

const LogoScreen = () => {
    console.log("v: " + sessionStorage.getItem("previous"))
    music.play();
    useEffect(() => {

        if (sessionStorage.getItem("previous") == "game")
            sessionStorage.setItem("previous", "refresh")

        if (sessionStorage.getItem("audioTime") != null) {
            music.currentTime = sessionStorage.getItem("audioTime");
            sessionStorage.removeItem("audioTime");
        }
    })




    planetNum = parseInt(sessionStorage.getItem("selectedPlanet"));
    var [lobbyState, setLobbyState] = useState("");


    function setScreen(state) {
        sessionStorage.setItem("screen", state);
        /*var fetched = false;
        fetch('/setScreen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ UUID: UUID, data: state })
        })
            .then(async response => await response.json())
            .then(async data => {
                fetched = await data;
            });
*/

    }

    function updateLobbyState() {

        /*   fetch('/getScreen', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({ UUID: UUID })
           })
               .then(async response => await response.json())
               .then(async data => {
                   setLobbyState(await data);
               })*/

        setLobbyState(sessionStorage.getItem("screen"));
    }




    const navigate = useNavigate();
    var [name, setName] = useState("");
    var [playersCount, setPLayersCount] = useState(4);
    var [backgroundX, setBackgroundX] = useState(0);
    var [backgroundY, setBackgroundY] = useState(0);
    var [logoOpacity, setLogoOpacity] = useState(0);
    var [queueClick, setQueueClick] = useState(false);
    var [hoverSolo, setHoverSolo] = useState(false);
    var [hoverMP, setHoverMP] = useState(false);
    var [hoverCP, setHoverCP] = useState(false);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const planetRotation = setInterval(() => {
            planet.setOrientation((planet.orientation + 0.01) % 360);
        }, 1);

        return () => clearInterval(planetRotation);

    }, []);

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

    useEffect(() => {
        planet.image = getPlanet(planetNum).planet;
    })



    useEffect(() => {
        gameName = name;
    }, [name])

    useEffect(() => {

        earthSheild.setOrientation(Math.atan2(mousePos.y - scale(screenHeight), mousePos.x) * 180 / Math.PI + 90);
        earthSheild.setPosition(550 * Math.cos(Math.atan2(scale(screenHeight) - mousePos.y, mousePos.x)), screenHeight - 550 * Math.sin(Math.atan2(scale(screenHeight) - mousePos.y, mousePos.x)));
    }, [mousePos.x, mousePos.y]);

    useEffect(() => {
        if (lobbyState != "logo")
            updateLobbyState();
    }, [])

    const displayQueueScreen = function () {

        return (
            <div style={{
                color: "red"
            }}>
                <img
                    src={Images.GameLogo}
                    style={{
                        left: scaleH(screenWidth) - scale(180),
                        top: scale(screenHeight - 144),
                        position: 'absolute',
                        width: scale(180),
                        height: scale(144),
                        zIndex: 100000,

                    }}
                />

                <button

                    onClick={() => {
                        (new Audio(ButtonHover)).play();
                        setQueueClick(false);
                        setName("");


                        setScreen("menu", 0);
                        updateLobbyState();



                    }}

                    style={{
                        borderWidth: 0,
                        position: 'absolute',
                        top: scaleV(10),
                        left: scaleH(10),
                        height: scale(80),
                        width: scale(80),
                        borderColor: "lightblue",
                        backgroundColor: "transparent",
                        borderWidth: scale(4),
                        borderRadius: scale(100)


                    }}

                />

                <button
                    onClick={() => {
                        (new Audio(ButtonHover)).play();
                        if (playersCount < 4)
                            setPLayersCount(playersCount + 1)
                    }}
                    style={{
                        position: 'absolute',
                        top: scale(screenHeight / 2 + 25),
                        left: scaleH(screenWidth / 2) + scale(105),
                        backgroundColor: "black",
                        borderColor: "white",
                        borderRadius: scale(10),
                        borderWidth: scale(4),
                        height: scale(50),
                        width: scale(50),
                    }}
                />

                <button
                    onClick={() => {
                        (new Audio(ButtonHover)).play();
                        if (playersCount > 2)
                            setPLayersCount(playersCount - 1)
                    }}
                    style={{
                        position: 'absolute',
                        top: scale(screenHeight / 2 + 25),
                        left: scaleH(screenWidth / 2) - scale(155),
                        backgroundColor: "black",
                        borderColor: "white",
                        borderRadius: scale(10),
                        borderWidth: scale(4),
                        height: scale(50),
                        width: scale(50),
                    }}
                />
                <label
                    style={{
                        position: 'absolute',
                        height: scale(40),
                        width: scale(40),
                        top: scale(screenHeight / 2 + 17),
                        left: scaleH(screenWidth / 2) - scale(10),
                        fontFamily: 'fantasy',
                        fontWeight: 'bold',
                        fontSize: scale(50),
                        zIndex: 1000,
                        color: "white"
                    }}
                >
                    {playersCount}
                </label>


                <img

                    style={{
                        position: 'absolute',
                        height: scale(40),
                        width: scale(40),
                        top: scale(screenHeight / 2 + 30),
                        left: scaleH(screenWidth / 2) - scale(150),
                        zIndex: 1000,
                    }}
                    src={Images.BackButton}
                />

                <img

                    style={{
                        position: 'absolute',
                        top: scale(screenHeight / 2 + 30),
                        left: scaleH(screenWidth / 2) + scale(110),
                        height: scale(40),
                        width: scale(40),
                        zIndex: 1000,
                        transform: "rotate(180deg) scaleY(-1)"
                    }}
                    src={Images.BackButton}
                />


                <img

                    style={{
                        position: 'absolute',
                        top: scaleV(25),
                        left: scale(23),
                        height: scale(50),
                        width: scale(50),
                        transform: "scaleX(-1)",
                        padding: 0,

                    }}
                    src={Images.BackButton2}
                />

                <Form.Group
                >
                    <Form.Control
                        maxLength={15}
                        onChange={(event) => {
                            setName(event.target.value);
                        }}

                        style={{
                            backgroundColor: "black",
                            color: 'white',
                            borderRadius: 0,
                            textAlign: "center",
                            width: scale(300),
                            height: scale(40),
                            fontSize: scale(20),
                            position: 'absolute',
                            left: scaleH(screenWidth / 2) - scale(150),
                            top: scale(screenHeight / 2 - 50),

                        }}
                        placeholder="Enter Name" />

                </Form.Group>
                {queueClick &&
                    <label

                        style={{
                            position: "absolute",
                            left: scaleH(screenWidth / 2) - scale(70),
                            top: scale(screenHeight / 2 + 180),
                            width: scale(200),
                            height: scale(60),
                            fontSize: scale(10),
                            color: "red"

                        }}
                    >
                        GAME MODE NOT AVALIABLE!
                    </label>
                }

                <button className='PlayButton'
                    disabled={name == ""}

                    style={{
                        position: "absolute",
                        left: scaleH(screenWidth / 2) - scale(100),
                        top: scale(screenHeight / 2 + 105),
                        width: scale(200),
                        height: scale(60),
                        fontSize: scale(40),
                        color: (name == "") ? "grey" : (queueClick) ? "red" : "cyan",

                    }}
                    onClick={() => {
                        (new Audio(ButtonHover)).play();
                        setQueueClick(true);
                    }}
                >

                    QUEUE
                </button>

            </div>
        )
    }

    const displayLogo = function () {


        return (
            <div>
                <img
                    src={Images.GameLogo}
                    style={{
                        opacity: logoOpacity,
                        left: scaleH(screenWidth / 2) - scale(300),
                        top: scale(screenHeight / 2 - 300),
                        position: 'absolute',
                        width: scale(600),
                        height: scale(480),
                        zIndex: 100000,

                    }}
                />



                <button className='PlayButton'
                    disabled={logoOpacity < 1}
                    style={{

                        opacity: (logoOpacity >= 1) ? 1 : 0,
                        left: scaleH(screenWidth / 2) - scale(100),
                        top: scale(screenHeight / 2 + 220),
                        width: scale(200),
                        height: scale(60),
                        fontSize: scale(40),

                    }}
                    onClick={() => {
                        (new Audio(ButtonHover)).play();
                        setScreen("menu", 0);
                        updateLobbyState();
                    }}

                >

                    PLAY
                </button>
            </div>
        )

    }

    const displayMenu = function () {


        return (
            <div
                style={{
                    color: 'red'
                }}
            >
                <label
                    style={{
                        position: "absolute",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: scale(15),
                        left: scale(5),
                        top: scale(5)
                    }}
                >
                    F11 for full screen
                </label>

                {planet.render()}

                <img
                    src={Images.GameLogo}
                    style={{
                        left: scaleH(screenWidth) - scale(180),
                        top: scale(screenHeight - 144),
                        position: 'absolute',
                        width: scale(180),
                        height: scale(144),
                        zIndex: 100000,

                    }}
                />

                {earthSheild.render()}

                <div className='menuButton '
                    style={{
                        width: scale(120),
                        height: scale(100),
                        display: "grid",
                        top: scaleV(230),
                        left: scale(100),
                        fontSize: (hoverSolo) ? scale(60) : scale(40),
                        color: (hoverSolo) ? "blueviolet" : "white",
                        textShadow: "10 10 #FF0000"
                    }}
                >

                    <label
                        style={{
                            justifySelf: "center",
                            alignSelf: "center"
                        }}
                        onMouseOver={() => {
                            (new Audio(ButtonClick)).play();
                            setHoverSolo(true);
                        }}

                        onMouseLeave={() => {

                            setHoverSolo(false);
                        }}

                        onClick={() => {
                            (new Audio(ButtonHover)).play();
                            setHoverSolo(false);
                            navigate('SoloGameScreen');

                        }}

                    >
                        SOLO
                    </label>
                </div>


                <div className='menuButton '
                    style={{
                        width: scale(300),
                        height: scale(100),
                        display: "grid",
                        top: scaleV(450),
                        left: scale(410),
                        fontSize: (hoverMP) ? scale(60) : scale(40),
                        color: (hoverMP) ? "blueviolet" : "white",
                    }}
                >

                    <label
                        onClick={() => {
                            (new Audio(ButtonHover)).play();
                            setHoverMP(false);
                            setScreen("queue", 0);
                            updateLobbyState();

                        }}
                        style={{
                            justifySelf: "center",
                            alignSelf: "center"
                        }}
                        onMouseOver={() => {
                            (new Audio(ButtonClick)).play();
                            setHoverMP(true);
                        }}

                        onMouseLeave={() => {
                            setHoverMP(false);
                        }}

                    >
                        MULTIPLAYER
                    </label>
                </div>


                <div className='menuButton '
                    style={{
                        width: scale(400),
                        height: scale(100),
                        display: "grid",
                        top: scaleV(750),
                        left: scale(490),
                        fontSize: (hoverCP) ? scale(60) : scale(40),
                        color: (hoverCP) ? "blueviolet" : "white",
                    }}
                >

                    <label
                        style={{
                            justifySelf: "center",
                            alignSelf: "center"
                        }}
                        onMouseOver={() => {
                            (new Audio(ButtonClick)).play();
                            setHoverCP(true);
                        }}

                        onMouseLeave={() => {
                            setHoverCP(false);
                        }}

                        onClick={() => {
                            (new Audio(ButtonHover)).play();
                            navigate('ChangePlanetScreen');

                        }}

                    >
                        CHANGE PLANET
                    </label>
                </div>

            </div>
        )
    }

    useEffect(() => {

        const timerId = setInterval(() => {
            setBackgroundX(backgroundX => (backgroundX + 1) % 512);
            setBackgroundY(backgroundY => (backgroundY + 3) % 512);
        }, 50);

        const timerId2 = setInterval(() => {
            setLogoOpacity(logoOpacity => Math.min(logoOpacity + 0.03, 1))

        }, 100);

        return () => clearInterval(timerId);

    }, []);



    return (
        <div className='LogoScreen'
            style={{
                backgroundPositionX: backgroundX,
                backgroundPositionY: backgroundY,

            }}
        >
            {(lobbyState == "logo") && displayLogo()}
            {(lobbyState == "menu") && displayMenu()}
            {(lobbyState == "queue") && displayQueueScreen()}

        </div>
    );


};

export default LogoScreen;

export {
    gameName,
    getPlanet,
    music
}