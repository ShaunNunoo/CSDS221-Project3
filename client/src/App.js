import './App.css'
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameScreen from './screens/GameScreen/GameScreen';
import LogoScreen from './screens/LogoScreen/LogoScreen'
import ChangePlanet from './screens/ChangePlanet/ChangePlanet';

function App() {

  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])


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

export {
  scale,
  scaleH,
  scaleV,
}
