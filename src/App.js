import './App.css';
import React, { useState } from 'react';
import { Games } from './Games';
import { Home } from './Home';
import { Button } from '@mantine/core';

function App() {
  const [clicked, setClicked] = useState(false);
  const [numberOfTeams, setNumberOfTeams] = useState(8);
  const [tournamentId, setTournamentId] = useState(null)
  
  function onClick() {
    setClicked(true)
  }

  

  return (
    <div className="App-header">
      

      {(clicked) ? <Games id={tournamentId}/> : <Home setTeams={setNumberOfTeams} teams={numberOfTeams} setId={setTournamentId} id={tournamentId} onClick={onClick}/>}

    </div>

  );
}

export default App;
