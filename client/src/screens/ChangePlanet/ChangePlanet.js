import React, { useState } from 'react'
import Images from '../../Images'
import '../LogoScreen/LogoScreen.css'
import {useNavigate } from "react-router-dom";
import { scale, scaleV, screenHeight, screenWidth } from '../../App'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ButtonHover from '../../Sounds/ButtonHover.mp3'
import PlanetChange from '../../Sounds/PlanetChange.mp3'
import { getPlanet } from '../LogoScreen/LogoScreen';

var planetNum = parseInt(sessionStorage.getItem("selectedPlanet"));
const ChangePlanet = () => {

    var [selectNum, setSelectNum] = useState(planetNum);

    const navigate = useNavigate();
    
    return (
        <div
            style={{
                height: screenHeight,
                width: screenWidth,
                backgroundColor: "black",
                backgroundImage: `url(${getPlanet(selectNum).image})`,
                backgroundSize: "cover",
            }}
        >
            <img
                    src={Images.GameLogo}
                    style={{
                        left: screenWidth - scale(180),
                        top:  screenHeight - scale(144),
                        position: 'absolute',
                        width: scale(180),
                        height: scale(144),
                        zIndex: 100000,

                    }}
                />
            <label
                style={{
                    position: 'absolute',
                    left: screenWidth / 2 - scale(50),
                    top: scale(80),
                    fontFamily: 'fantasy',
                    fontWeight: 'bold',
                    textShadow: '0 0 20px #ffffff',
                    color: 'white',
                    fontSize: scale(50)
                }}
            >
                {getPlanet(planetNum).name}
            </label>
            <button

     
                onClick={() => {
                    (new Audio(ButtonHover)).play();
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
                    borderRadius: scale(100)


                }}

            />



            <div
                style={{
                    position: "absolute",
                    height: scale(500),
                    width: scale(500),
                    top: screenHeight / 2 - scale(250),
                    left: screenWidth / 2 - scale(250),
                }}
            >
                <img
                    style={{
                        height: "100%",
                        width: "100%",
                    }}

                    src={getPlanet(selectNum).planet}
                />


            </div>

            <button
        
                onClick={() => {

                    if (planetNum > 1 /*&& planets[planetSelect - 1].image != null*/) {
                        sessionStorage.setItem("selectedPlanet", --planetNum);
                        setSelectNum(selectNum-=1)
                        console.log(planetNum);
                        (new Audio(PlanetChange)).play();
                    } else {
                        sessionStorage.setItem("selectedPlanet", 1);
                        setSelectNum(1)
                        planetNum = 1;
                        console.log(planetNum);
                    }
                }}

                style={{
                    borderWidth: 0,
                    position: 'absolute',
                    top: screenHeight / 2 - scale(30),
                    left: screenWidth / 2 - scale(550),
                    height: scale(60),
                    width: scale(60),
                    borderRadius: scale(10),
                    borderWidth: scale(4),
                    padding: 0,
                    backgroundColor: "black",
                    borderColor: "white"


                }}
            />



            <img

                style={{
                    position: 'absolute',
                    height: scale(40),
                    width: scale(40),
                    top: screenHeight / 2 - scale(20),
                    left: screenWidth / 2 - scale(540),
                    zIndex: 1000,
                }}
                src={Images.BackButton}
            />

            <img

                style={{
                    position: 'absolute',
                    top: screenHeight / 2 - scale(20),
                    left: screenWidth / 2 + scale(500),
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

            <div className="d-flex"
                style={{
                    backgroundColor: "black",
                    borderColor: "white",
                    borderWidth: scale(2),
                    position: 'absolute',
                    padding: scale(30),
                    borderStyle: "solid",
                    display: 'grid',
                    alignContent: 'center',
                    width: scale(1000),
                    height: scale(80),
                    top: scaleV(720),
                    left: screenWidth / 2 - scale(500)
                }}
            >
                <label
                    style={{
                        fontFamily: 'fantasy',
                        fontWeight: 'bold',
                        color: '#198754',
                        alignSelf: 'center',
                        fontSize: scale(30)
                    }}
                >
                    STRENGTH
                </label>

                <ProgressBar
                    variant="success"
                    animated
                    now={getPlanet(planetNum).stats.strength}
                    style={{
                        backgroundColor: "grey",
                        alignSelf: 'center',
                        borderRadius: 0,
                        width: scale(300),
                        height: scale(30),
                        marginLeft: scale(30),
                    }}
                ></ProgressBar>

                <label
                    style={{
                        fontFamily: 'fantasy',
                        fontWeight: 'bold',
                        color: '#0D6EFD',
                        alignSelf: 'center',
                        marginLeft: scale(30),
                        fontSize: scale(30)
                    }}
                >
                    DEFENSE
                </label>

                <ProgressBar
                    animated
                    className='defence'
                    now={getPlanet(planetNum).stats.defence}
                    style={{
                        backgroundColor: "grey",
                        alignSelf: 'center',
                        borderRadius: 0,
                        width: scale(300),
                        height: scale(30),
                        marginLeft: scale(30),
                    }}
                ></ProgressBar>



            </div>

            <button

                onClick={() => {

                    if (planetNum < 4 /*&& planets[planetSelect + 1].image != null*/) {

                        setSelectNum(selectNum+=1)
                        sessionStorage.setItem("selectedPlanet", ++planetNum);
                        console.log(planetNum);
                        (new Audio(PlanetChange)).play();
                    } else {
                        sessionStorage.setItem("selectedPlanet", 4);
                        planetNum = 4;
                        setSelectNum(4)
                        console.log(planetNum);

                    }
                }}

                style={{
                    borderWidth: 0,
                    position: 'absolute',
                    top: screenHeight / 2 - scale(30),
                    left: screenWidth / 2 + scale(490),
                    height: scale(60),
                    width: scale(60),
                    borderRadius: scale(10),
                    borderWidth: scale(4),
                    backgroundColor: "black",
                    borderColor: "white"

                }}
            />





        </div >
    )
}


export default ChangePlanet;
