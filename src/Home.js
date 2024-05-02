import { Button, NumberInput } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import tournamentService from './firebase/TournamentService';
import { Games } from './Games';
import { NewTournament } from './NewTournament';
import { auth, signInWithGooglePopup } from './firebase/firebase';
import { toBeInTheDOM } from '@testing-library/jest-dom/dist/matchers';
//import {signOut} from './firebase.auth'

export function Home(props) {
    const [tournament, setTournament] = useState([])
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        getTournamentNames();
    }, [])

    async function getTournamentNames() {
        const allTournaments = await tournamentService.getTournaments();
        const newTournament = []

        for(let i = 0; i <allTournaments.length; i++){
            if(allTournaments[i].userId === auth.currentUser.uid){
                newTournament.push(allTournaments[i])
            }
        }
        setTournament(newTournament);
    }

    function showTournament(id) {
        props.setId(id)
        props.onClick();
    }

    function onNewTournamentClick() {
        console.log("trykket på knappen")
        setClicked(true)
    }

    //console.log(auth.currentUser.uid)
    
    return (
        <div className="App-header">

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