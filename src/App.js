import './App.css';
import React, { useState } from 'react';
import { Games } from './Games';
import { Home } from './Home';
import { Start } from './Start';
import { auth } from './firebase/firebase';

function App() {
  //const [loggedIn, setLogedIn] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [tournamentId, setTournamentId] = useState(null)

  function onClick() {
    setClicked(true)
  }

  return (
    <div className="App-header">

      {!auth ? <Start />:
        (clicked) ? <Games id={tournamentId} /> : <Home setId={setTournamentId} id={tournamentId} onClick={onClick} />
      }

    </div>
  );
}

export default App;
