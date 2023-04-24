import './App.css'
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameScreen from './screens/GameScreen/GameScreen';
import LogoScreen from './screens/LogoScreen/LogoScreen'
import ChangePlanet from './screens/ChangePlanet/ChangePlanet';

sessionStorage.setItem("refreshCount", 0);


if (sessionStorage.getItem("GameID") == null)
  fetch('/userID', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ UUID: "" })
  })
    .then(async response => await response.json())
    .then(async data => {
      console.log("Reached: " + data)
      sessionStorage.setItem("GameID", await data)
    })


function App() {

  if (sessionStorage.getItem("GameID") == null)
    window.location.reload();



  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/" element={<LogoScreen />} />
          <Route path="/GameScreen" element={<GameScreen />} />
          <Route path="/ChangePlanetScreen" element={<ChangePlanet />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

const scaleV = function (val) {
  return val * window.screen.height / 863;
}

const scaleH = function (val) {
  return val * window.screen.width / 1535;
}

const scale = function (val) {
  return val * Math.min(window.screen.height, window.screen.width) / 863;
}
const UUID = sessionStorage.getItem("GameID")

window.onunload  = function () {

  fetch('/removeUserID', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ UUID: UUID })
  })
}

export {
  scale,
  scaleH,
  scaleV,
  UUID,
}
