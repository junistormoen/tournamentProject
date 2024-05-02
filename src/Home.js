import { Button, NumberInput } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import tournamentService from './firebase/TournamentService';
import { Games } from './Games';
import { NewTournament } from './NewTournament';
import { auth, signInWithGooglePopup } from './firebase/firebase';

export function Home(props) {
    const [tournament, setTournament] = useState(null)
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        getTournamentNames();
    }, [])

    async function getTournamentNames() {
        const tournament = await tournamentService.getTournaments();
        setTournament(tournament);
    }

    function showTournament(id) {
        props.setId(id)
        props.onClick();
    }

    function onNewTournamentClick() {
        console.log("trykket på knappen")
        setClicked(true)
    }

    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        console.log(response);
      };

    const onGoogleButtonClicked = async () => {
        console.log("Current user: ")
        console.log(auth.currentUser)
        console.log("Name: ")
        console.log(auth.currentUser.displayName)
    }


    return (
        <div className="App-header">

            <Button
                type="submit"
                onClick={onGoogleButtonClicked}
            >
                Google
            </Button>

            {clicked ? <NewTournament /> : (
                <>
                    {tournament?.map(tournamentItem => (
                        <p
                            key={tournamentItem.id}
                            onClick={() => showTournament(tournamentItem.id)}
                            style={{ cursor: "pointer" }}
                        >
                            {tournamentItem.name}
                        </p>
                    ))}
                    < Button onClick={onNewTournamentClick} color="pink"> Ny trunering </Button>
                </>
            )}

        </div >
    )
}