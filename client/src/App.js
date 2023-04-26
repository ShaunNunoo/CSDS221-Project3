import './App.css'
import React, {useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogoScreen from './screens/LogoScreen/LogoScreen'
import ChangePlanet from './screens/ChangePlanet/ChangePlanet';
import SoloGameScreen from './screens/SoloGameScreen/SoloGameScreen';
import LobbyTheme from './Sounds/LobbyTheme.mp3'

var music = new Audio(LobbyTheme);
music.loop = true;
const screenWidth = Math.max( window.screen.width, window.screen.height);
const screenHeight = Math.min( window.screen.width, window.screen.height);

if (sessionStorage.getItem("screen") == null)
  sessionStorage.setItem("screen", "logo")

if (sessionStorage.getItem("selectedPlanet") == null)
  sessionStorage.setItem("selectedPlanet", 2)


function App() {

  useEffect(() => {
    music.play();

    if(sessionStorage.getItem("audioTime")!=null){
      music.currentTime = sessionStorage.getItem("audioTime");
      sessionStorage.removeItem("audioTime");
  }
  })


  return (
    <Router>
      <div className='App'
        style={{
          backgroundColor: "black"
        }}
      >
        <Routes>
          <Route path="/" element={<LogoScreen />} />
          <Route path="/SoloGameScreen" element={<SoloGameScreen />} />
          <Route path="/ChangePlanetScreen" element={<ChangePlanet />} />
        </Routes>
      </div>

    </Router>
  );
}

export default App;

const scaleV = function (val) {
  return val * screenHeight / 863;
}

const scaleH = function (val) {
  return val * screenWidth / 1535;
}

const scale = function (val) {
  return val * screenHeight / 863;
}
//var UUID = sessionStorage.getItem("GameID")

export {
  scale,
  scaleH,
  scaleV,
  //UUID,
  screenHeight,
  screenWidth,
  music
}
