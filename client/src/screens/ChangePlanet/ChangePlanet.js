import React, { useState, useEffect } from 'react'
import Images from '../../Images'
import '../LogoScreen/LogoScreen.css'
import LobbyTheme from '../../Sounds/LobbyTheme.mp3'
import { Navigate, useNavigate } from "react-router-dom";
import { scale, scaleH, scaleV } from '../../App'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ButtonClick from '../../Sounds/ButtonClick.mp3'
import ButtonHover from '../../Sounds/ButtonHover.mp3'
import PlanetChange from '../../Sounds/PlanetChange.mp3'
const planets = [
    {
        name: "Mercury",
        stats: {},
        image: null,
        planet: null,
    },

    {
        name: "Venus",
        stats: {
            strength: 70,
            defence: 50
        },
        image: Images.VenusBackground,
        planet: Images.Venus,
    },

    {
        name: "Earth",
        stats: {
            strength: 60,
            defence: 70
        },
        image: Images.EarthBackground,
        planet: Images.Earth,
    },

    {
        name: "Mars",
        stats: {
            strength: 20,
            defence: 80
        },
        image: Images.MarsBackground,
        planet: Images.Mars,
    },

    {
        name: "Jupiter",
        stats: {
            strength: 90,
            defence: 40
        },
        image: Images.JupiterBackground,
        planet: Images.Jupiter,
    },

    {
        name: "Saturn",
        stats: {
            strength: 50,
            defence: 60
        },
        image: null,
        planet: null,
    },

    {
        name: "Uranus",
        stats: {},
        image: null,
        planet: null,
    },

    {
        name: "Neptune",
        stats: {},
        image: null,
        planet: null,
    },

    {
        name: "Pluto",
        stats: {},
        image: null,
        planet: null,
    },


]

var selectedPlanet = planets[2];


const ChangePlanet = () => {
    const [planetSelect, setPlanetSelect] = useState(planets.indexOf(selectedPlanet));

    const navigate = useNavigate()
    return (
        <div
            style={{
                height: window.screen.height,
                width: window.screen.width,
                backgroundColor: "black",
                backgroundImage: `url(${planets[planetSelect].image})`,
                backgroundSize: "cover",
            }}
        >
            <label
                style={{
                    position: 'absolute',
                    left: window.screen.width / 2 - scale(50),
                    top: scale(80),
                    fontFamily: 'fantasy',
                    fontWeight: 'bold',
                    textShadow: '0 0 20px #ffffff',
                    color: 'white',
                    fontSize: scale(50)
                }}
            >
                {selectedPlanet.name}
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
                    top: window.screen.height / 2 - scale(250),
                    left: window.screen.width / 2 - scale(250),
                }}
            >
                <img
                    style={{
                        height: "100%",
                        width: "100%",
                    }}

                    src={planets[planetSelect].planet}
                />


            </div>

            <button
        
                onClick={() => {

                    if (planetSelect > 0 && planets[planetSelect - 1].image != null) {
                        setPlanetSelect(planetSelect - 1);
                        selectedPlanet = planets[planetSelect - 1];
                        (new Audio(PlanetChange)).play();
                    } else if (planets[planets.length - 1].image != null) {
                        setPlanetSelect(planets.length - 1);
                        selectedPlanet = planets[planets.length - 1];
                        (new Audio(PlanetChange)).play();
                    }
                }}

                style={{
                    borderWidth: 0,
                    position: 'absolute',
                    top: window.screen.height / 2 - scale(30),
                    left: window.screen.width / 2 - scale(550),
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
                    top: window.screen.height / 2 - scale(20),
                    left: window.screen.width / 2 - scale(540),
                    zIndex: 1000,
                }}
                src={Images.BackButton}
            />

            <img

                style={{
                    position: 'absolute',
                    top: window.screen.height / 2 - scale(20),
                    left: window.screen.width / 2 + scale(500),
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
                    left: window.screen.width / 2 - scale(500)
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
                    now={selectedPlanet.stats.strength}
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
                    now={selectedPlanet.stats.defence}
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

                    if (planetSelect < planets.length && planets[planetSelect + 1].image != null) {
                        setPlanetSelect(planetSelect + 1);
                        selectedPlanet = planets[planetSelect + 1];
                        (new Audio(PlanetChange)).play();
                    } else if (planets[0].image != null) {
                        setPlanetSelect(0);
                        selectedPlanet = planets[0];
                        (new Audio(PlanetChange)).play();
                    }
                }}

                style={{
                    borderWidth: 0,
                    position: 'absolute',
                    top: window.screen.height / 2 - scale(30),
                    left: window.screen.width / 2 + scale(490),
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

export {
    selectedPlanet
}