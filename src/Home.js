
import React, { useState, useEffect } from 'react';
import tournamentService from './firebase/TournamentService';
import { NewTournament } from './NewTournament';
import { auth } from './firebase/firebaseConfig';
import { signOut } from 'firebase/auth';

export function Home(props) {
    const [tournament, setTournament] = useState([])
    const [clicked, setClicked] = useState(false);

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



    console.log(auth)

    return (
        <>

            <div className="App-container">
                

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
                    </>
                )}
            </div >
        </>
    )
}