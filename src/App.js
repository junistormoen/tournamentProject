import './App.css';
import React, { useState } from 'react';
import { Games } from './Games';
import { Home } from './Home';
import { Start } from './Start';
import { NewTournament } from './NewTournament';
import { auth } from './firebase/firebaseConfig';
import { Button, HoverCard, HoverCardDropdown, HoverCardTarget, Avatar } from '@mantine/core';
import { signOut } from 'firebase/auth';
import logo from './logo.png';

export function App() {
  const [clicked, setClicked] = useState(false);
  const [tournamentId, setTournamentId] = useState(null)

  function onClick(id) {
    setTournamentId(id)
    setClicked(true)
  }

  function onHomeClick() {
    setClicked(false)
  }

  function onSignOutClick() {
    signOut(auth).then(() => {
    }).catch((error) => {
      console.log("Kunne ikke logge ut")
    })
  }

  

  return (

    <>
      {auth.currentUser === null ? <Start /> :
        (clicked) ? <Games id={tournamentId} onClick={onHomeClick} /> : <Home onClick={onClick} />
      }

      {auth.currentUser &&
        <div className='App-header'>
          {(tournamentId) ? <Button onClick={onClick}>Tilbake</Button> : <Button onClick={oncancel} color="pink"> Ny turnering </Button>}
          <HoverCard>
            <HoverCardTarget>
              <Avatar src={auth.currentUser.photoURL} />
            </HoverCardTarget>
            <HoverCardDropdown>
              <Button variant="transparent" size="xs" onClick={onSignOutClick}>Logg ut</Button>
            </HoverCardDropdown>
          </HoverCard>
        </div>}



    </>
  );
}

export default App;
