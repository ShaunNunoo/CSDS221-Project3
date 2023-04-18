import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes
} from "react-router-dom";
import './App.css'

import LogoScreen from './screens/LogoScreen/LogoScreen'


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
    <div className='App'
      style={{
        backgroundColor: "blue",
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<LogoScreen />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
