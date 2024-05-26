
import React, { useState, useEffect } from 'react';
import tournamentService from './firebase/TournamentService';
import { NewTournament } from './NewTournament';
import { auth } from './firebase/firebaseConfig';
import { Image, Text } from '@mantine/core';
import logo from './logo.png';

export function Home(props) {
    const [tournament, setTournament] = useState([])
    const clicked = false;

    useEffect(() => {
        if (auth.currentUser) {
            getTournamentNames();
        }
    }, [])

    async function getTournamentNames() {
        try {
            const allTournaments = await tournamentService.getTournaments();
            const newTournament = []

            for (let i = 0; i < allTournaments.length; i++) {
                if (allTournaments[i].userId === auth.currentUser.uid) {
                    newTournament.push(allTournaments[i])
                }

            }
            setTournament(newTournament);
        } catch (error) {
            console.error("Feil ved henting av turneringsnavn: ", error)
        }
    }

    function showTournament(id) {
        props.onClick(id);
    }


    return (
        <>

            <div className="App-container">
                {clicked ? <NewTournament /> : (
                    <>
                        <Image src={logo} style={{ height: 300, width: 250, paddingBottom: 50 }}></Image>

                        {tournament?.map(tournamentItem => (
                            <p
                                key={tournamentItem.id}
                                onClick={() => showTournament(tournamentItem.id)}
                                style={{ cursor: "pointer" }}
                            >
                                {tournamentItem.name}
                            </p>
                        ))}

                        {(tournament.length === 0) &&
                            <Text>Ingen turneringer enda</Text>}
                    </>
                )}
            </div >
        </>
    )
}