import './App.css';
import React, { useState } from 'react';
import { Games } from './Games';
import { Home } from './Home';
import { Start } from './Start';
import { auth, signInWithGooglePopup } from './firebase/firebaseConfig';
import { Button, HoverCard, HoverCardDropdown, HoverCardTarget, Avatar } from '@mantine/core';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { NewTournament } from './NewTournament';


export function App() {
  const [isGameClicked, setIsGameClicked] = useState(false);
  const [tournamentId, setTournamentId] = useState(null)

  function onClick(id) {
    setTournamentId(id)
    setIsGameClicked(true)
  }

  function onBackClicked() {
    setTournamentId(null)
    setIsGameClicked(false)
  }

  function onNewTournamentClick() {
    setTournamentId("new")
  }

  function onHomeClick() {
    setIsGameClicked(false)
  }

  function onSignOutClick() {
    signOut(auth).then(() => {
    }).catch((error) => {
      console.log("Kunne ikke logge ut")
    })
  }

  async function onDeleteUserClick() {
    await signInWithGooglePopup()

    const auth = getAuth()
    const user = auth.currentUser

    if (user) {
      deleteUser(user).then(() => {
      }).catch((error) => {
        alert(error)
      })
    }
  }

  return (

    <>
      {auth.currentUser === null ? <Start /> :
        (tournamentId === "new") ? <NewTournament></NewTournament> :
          (isGameClicked) ? <Games id={tournamentId} onClick={onHomeClick} /> : <Home onClick={onClick} />
      }

      {auth.currentUser &&
        <div className='App-header'>
          {(tournamentId) ?
            <Button onClick={onBackClicked} color='#DB594A'>Tilbake</Button> : <Button onClick={onNewTournamentClick} color='#DB594A'> Ny turnering </Button>}
          <HoverCard>
            <HoverCardTarget>
              <Avatar src={auth.currentUser.photoURL} />
            </HoverCardTarget>
            <HoverCardDropdown>
              <Button variant="transparent" size="sm" onClick={onSignOutClick}>Logg ut</Button>
              <br></br>
              <Button variant="transparent" size="xs" color='red' onClick={onDeleteUserClick}>Slett bruker</Button>
            </HoverCardDropdown>
          </HoverCard>
        </div>}
    </>
  );
}

export default App;
