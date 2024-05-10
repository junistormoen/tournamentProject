import './App.css';
import React, { useState } from 'react';
import { Games } from './Games'; 
import { Home } from './Home';
import { Start } from './Start';
import { auth } from './firebase/firebaseConfig';

export function App() {
  const [clicked, setClicked] = useState(false);
  const [tournamentId, setTournamentId] = useState(null)
 
  function onClick(id) {
    setTournamentId(id) 
    setClicked(true) 
  }

  function onHomeClick(){
    setClicked(false)
  }
  
  console.log(auth.currentUser)

  return (
    
    <div className="App-header">
 
      {auth.currentUser === null ? <Start />: 
        (clicked) ? <Games id={tournamentId} onClick={onHomeClick}/> : <Home onClick={onClick} />
      } 

    </div>
  );
}

export default App;
