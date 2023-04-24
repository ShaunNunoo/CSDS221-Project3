import React, { useState, useEffect, useRef } from 'react'
import Images from '../../Images'
import { useNavigate } from "react-router-dom";
import '../LogoScreen/LogoScreen.css'
import LobbyTheme from '../../Sounds/LobbyTheme.mp3'
import { scale, scaleH, scaleV } from '../../App'
import { selectedPlanet } from '../ChangePlanet/ChangePlanet';
import GameObject from '../../components/GameObject';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import ButtonClick from '../../Sounds/ButtonClick.mp3'
import ButtonHover from '../../Sounds/ButtonHover.mp3'
import PlanetChange from '../../Sounds/PlanetChange.mp3'
import { UUID } from '../../App';
var music = new Audio(LobbyTheme);
var earthSheild = new GameObject([500, 500], [225, 75], 0, Images.PlanetSheild, "none", "", false);
var planet = new GameObject([0, window.screen.height], [1000, 1000], 0, selectedPlanet.planet, "none", "", false);
var planetAngle = 0;
var gameName = ""
var screen;




const LogoScreen = () => {
    try {
        music.play();
    } catch (error) {

    }

    const pageAccessedByReload = (
        (window.performance.navigation && window.performance.navigation.type === 1) ||
        window.performance
            .getEntriesByType('navigation')
            .map((nav) => nav.type)
            .includes('reload')
    );

    var [lobbyState, setLobbyState] = useState("");

    function removeUser() {
        fetch('/removeUserID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ UUID: UUID })
        })
    }

    function setScreen(state) {

        fetch('/setScreen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ UUID: UUID, data: state })
        });


    }

    function updateLobbyState() {

        fetch('/getScreen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ UUID: UUID })
        }).then(async response => await response.json())
            .then(async data => {
                setLobbyState(data);
            })
    }




    const navigate = useNavigate();
    var [name, setName] = useState("");
    var [playersCount, setPLayersCount] = useState(4);
    var [backgroundX, setBackgroundX] = useState(0);
    var [backgroundY, setBackgroundY] = useState(0);
    var [logoOpacity, setLogoOpacity] = useState(0);

    var [hoverSolo, setHoverSolo] = useState(false);
    var [hoverMP, setHoverMP] = useState(false);
    var [hoverCP, setHoverCP] = useState(false);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });



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
        planet.image = selectedPlanet.planet;
    }, [selectedPlanet])

    useEffect(() => {
        const planetRotation = setInterval(() => {
            planetAngle = (planetAngle + 0.01) % 360;

        }, 1);

        return () => clearInterval(planetRotation);

    }, []);

    useEffect(() => {
        gameName = name;
    }, [name])

    useEffect(() => {

        earthSheild.setOrientation(Math.atan2(mousePos.y - window.screen.height, mousePos.x) * 180 / Math.PI + 90);
        earthSheild.setPosition(550 * Math.cos(Math.atan2(window.screen.height - mousePos.y, mousePos.x)), window.screen.height - scaleV(550) * Math.sin(Math.atan2(window.screen.height - mousePos.y, mousePos.x)));
    }, [mousePos.x, mousePos.y]);

    useEffect(() => {
        if (lobbyState != "logo")
            updateLobbyState();
    }, [UUID])

    const displayQueueScreen = function () {

        return (
            <div>
                <img
                    src={Images.GameLogo}
                    style={{
                        left: window.screen.width - scale(180),
                        top: window.screen.height - scale(144),
                        position: 'absolute',
                        width: scale(180),
                        height: scale(144),
                        zIndex: 100000,

                    }}
                />

                <button

                    onClick={() => {
                        (new Audio(ButtonHover)).play();
                        setScreen("menu");
                        updateLobbyState();
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
                        top: window.screen.height / 2 + scale(25),
                        left: window.screen.width / 2 + scale(105),
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
                        top: window.screen.height / 2 + scale(25),
                        left: window.screen.width / 2 - scale(155),
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
                        top: window.screen.height / 2 + scale(17),
                        left: window.screen.width / 2 - scale(10),
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
                        top: window.screen.height / 2 + scale(30),
                        left: window.screen.width / 2 - scale(150),
                        zIndex: 1000,
                    }}
                    src={Images.BackButton}
                />

                <img

                    style={{
                        position: 'absolute',
                        top: window.screen.height / 2 + scale(30),
                        left: window.screen.width / 2 + scale(110),
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
                        transform: "scaleX(-1)"

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
                            left: window.screen.width / 2 - scale(150),
                            top: window.screen.height / 2 - scale(50),

                        }}
                        placeholder="Enter Name" />

                </Form.Group>

                <button className='PlayButton'
                    disabled={name == ""}

                    style={{
                        left: window.screen.width / 2 - scale(100),
                        top: window.screen.height / 2 + scale(105),
                        width: scale(200),
                        height: scale(60),
                        fontSize: scale(40),
                        color: (name == "") ? "grey" : "cyan",

                    }}
                    onClick={() => {
                        (new Audio(ButtonHover)).play();
                        navigate('GameScreen');
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
                        left: window.screen.width / 2 - scale(300),
                        top: window.screen.height / 2 - scale(300),
                        position: 'absolute',
                        width: scale(600),
                        height: scale(480),

                    }}
                />



                <button className='PlayButton'
                    disabled={logoOpacity < 1}
                    style={{

                        opacity: (logoOpacity >= 1) ? 1 : 0,
                        left: window.screen.width / 2 - scale(100),
                        top: window.screen.height / 2 + scale(220),
                        width: scale(200),
                        height: scale(60),
                        fontSize: scale(40),

                    }}
                    onClick={() => {
                        (new Audio(ButtonHover)).play();
                        setScreen("menu");
                            updateLobbyState();
                    }}

                >

                    PLAY
                </button>
            </div>
        )

    }

    const displayMenu = function () {

        planet.setOrientation(planetAngle);
        return (
            <div
                style={{
                    color: 'red'
                }}
            >

                {planet.render()}

                <img
                    src={Images.GameLogo}
                    style={{
                        left: window.screen.width - scale(180),
                        top: window.screen.height - scale(144),
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
                            setScreen("queue");
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
        var img = new Image();
        img.src = Images.SpaceBackground1;

        const timerId = setInterval(() => {
            setBackgroundX(backgroundX => (backgroundX + 1) % img.width);
            setBackgroundY(backgroundY => (backgroundY + 3) % img.height);
        }, 50);

        const timerId2 = setInterval(() => {
            setLogoOpacity(logoOpacity => Math.min(logoOpacity + 0.01, 1))

        }, 100);

        return () => clearInterval(timerId);

    }, []);



    return (
        <div className='LogoScreen'
            style={{
                backgroundPositionX: backgroundX,
                backgroundPositionY: backgroundY,
                color: "red"
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
    music
}