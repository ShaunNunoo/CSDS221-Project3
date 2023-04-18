import React, { useState, useEffect } from 'react'
import Images from '../../Images'
import '../LogoScreen/LogoScreen.css'
import LobbyTheme from '../../Sounds/LobbyTheme.mp3'
import MenuScreen from '../MenuScreen/MenuScreen'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Routes
} from "react-router-dom";


const LogoScreen = () => {
    var [backgroundX, setBackgroundX] = useState(0);
    var [backgroundY, setBackgroundY] = useState(0);
    var [logoOpacity, setLogoOpacity] = useState(0);
    var [music, setMusic] = useState(new Audio(LobbyTheme));

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




    useEffect(() => {
        const playMusic = setInterval(() => {
            music.play();
        }, 1000);

    }, []);


    return (
        <div className='LogoScreen'
            style={{
                backgroundPositionX: backgroundX,
                backgroundPositionY: backgroundY,
            }}
        >
            <img
                className='GameLogo'
                src={Images.GameLogo}
                style={{
                    opacity: logoOpacity
                }}
            />

            <button className='PlayButton'
                style={{ opacity: (logoOpacity >= 1) ? 1 : 0 }}
            >
                PLAY
            </button>

            <Routes>
                <Route path="/" element={<MenuScreen />} />
            </Routes>


        </div >
    );

};

export default LogoScreen;
