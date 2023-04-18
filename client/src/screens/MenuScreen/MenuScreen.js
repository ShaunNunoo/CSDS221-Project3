import React, { Fragment, useState, useEffect, useRef } from 'react'
import Images from '../../Images'
import '../LogoScreen/LogoScreen.css'
import LobbyTheme from '../../Sounds/LobbyTheme.mp3'
import GameObject from '../../components/GameObject'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Routes
} from "react-router-dom";



const MenuScreen = () => {

    var meteor = useRef();
    var earth = useRef();
    var earthSheild = useRef();



    var GameRefferences = [
        meteor,
        earth,
        earthSheild,
    ];

    var CollidableObjects = [
        earthSheild
    ];

    var GameObjects = [
        <GameObject hitBox="circle" image={Images.Meteor} ref={meteor} position={[100, 300]} size={[50, 50]} />,
        <GameObject hitBox="circle" image={Images.Earth} ref={earth} position={[0, 0]} size={[500, 500]} />,
        <GameObject hitBox="circle" image={Images.PlanetSheild} ref={earthSheild} position={[-1000, -1000]} size={[150, 50]} />,


    ];


    const checkCollision = function () {


    }

    GameObjects.push(<GameObject hitBox="circle" image={Images.Meteor} ref={useRef()} position={[Math.random() * window.screen.width, Math.random() * window.screen.height]} size={[50, 50]} />,)
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
                    <div>
                        <label
                            style={{
                                color: "white"
                            }}
                        >
                            {object}
                        </label>
                    </div>
                </Fragment>
            ))
        )
    }


    useEffect(() => {
        var angle = 0;
        var x = 0;
        x = 1;
        var y = 0;
        y = 1;
        const gameLoop = setInterval(() => {
            angle = (angle + 0.5) % 360;
            if (meteor.current.hasBoundX())
                x = x * -1;

            if (meteor.current.hasBoundY())
                y = y * -1;

            meteor.current.setOrientation(angle);
            meteor.current.position.x += x * 2;
            meteor.current.position.y += y * 3;


            GameObjects[3].ref.current.position.x += 0.1;

        }, 1);

        return () => clearInterval(gameLoop);

    }, []);


    useEffect(() => {

        earthSheild.current.setOrientation(Math.atan2(mousePos.y - earth.current.position.y, mousePos.x - earth.current.position.x) * 180 / Math.PI + 90);//setPosition(mousePos.x, mousePos.y);
        earthSheild.current.setPosition(300 * Math.cos(Math.atan2(mousePos.y, mousePos.x)), 300 * Math.sin(Math.atan2(mousePos.y, mousePos.x)));
    }, [mousePos.x, mousePos.y]);


    return (
        <div
            style={{
                color: "white"
            }}
        >
            {renderGameObjects()}
        </div>
    );
};

export default MenuScreen;