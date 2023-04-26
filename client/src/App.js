import './App.css'
import React from 'react'
import Images from './Images';






function App() {

 
  return (
      <div className='App'
        style={{
          backgroundColor: "black"
        }}
      >
       <img
        src={Images.GameLogo}
       />
      </div>
  );
}

export default App;

