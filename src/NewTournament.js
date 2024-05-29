import React, { useState } from "react"
import { Input, Button, Image } from "@mantine/core"
import { Games } from "./Games";
import tournamentService from "./firebase/TournamentService";
import { auth } from './firebase/firebaseConfig';
import logo from "./logo.png"


export function NewTournament() {
    const [tournamentId, setTournamentId] = useState("");
    const [tournamentName, setTournamentName] = useState("Min turnering");
    const [tournamentTeams, setTournamentTeams] = useState([{ name: 'Lag 1', score: 0 }, { name: 'Lag 2', score: 0 }]);

    const [clicked, setClicked] = useState(false);


    function onNameInputChange(input) {
        setTournamentName(input.target.value)
    }

    function onTeamInputChange(index, input) {
        const updatedTeams = tournamentTeams.map((team, idx) => {
            if (idx === index) {
                return { ...team, name: input.target.value }
            }
            return team
        })
        setTournamentTeams(updatedTeams)
    }

    function onAddTeamClick() {
        const newTeamName = 'Lag ' + (tournamentTeams.length + 1);
        const newTeam = { name: newTeamName, score: 0 }
        setTournamentTeams([...tournamentTeams, newTeam])
    }

    async function onGenerateClick() {
        const rounds = generateRounds(tournamentTeams)

        const data = {
            userId: auth.currentUser.uid,
            name: tournamentName,
            numberOfTeams: tournamentTeams.length,
            teams: tournamentTeams,
            rounds: rounds
        }

        setTournamentId(await tournamentService.addTournament(data));
        setClicked(true)
    }


    function generateRounds(teams) {
        let numTeams = teams.length;
        let addedTeam = false;
        const rounds = [];

        if (numTeams % 2 !== 0) {
            teams.push(null);
            numTeams++;
            addedTeam = true
        }

        for (let i = 0; i < numTeams - 1; i++) {
            rounds[i] = { matches: [] };
            for (let j = 0; j < numTeams / 2; j++) {
                const team1 = teams[j];
                const team2 = teams[numTeams - 1 - j];

                if (team1 && team2) {
                    rounds[i].matches.push({
                        team1: team1.name,
                        team2: team2.name
                    });
                }

            }
            teams.splice(1, 0, teams.pop());
        }

        if (addedTeam) {
            teams.pop()
        }

        return rounds;
    }


    return (
        <div className="App-container">
            {clicked ? <Games id={tournamentId}></Games> : (
                <>
                <Image src={logo} style={{ height: 300, width: 250, paddingBottom: 10 }}></Image>
                    <h3>Legg til ny turnering</h3>
                    <Input.Wrapper label="Navn" description="Legg til et navn på turneringen">
                        <Input id="name" onChange={onNameInputChange} />
                    </Input.Wrapper>
                    <Input.Wrapper label="Lag" description=" ">
                        {tournamentTeams.map((team, index) => (
                            <Input
                                key={index} 
                                id={'team' + { index }} 
                                onChange={(e) => onTeamInputChange(index, e)} 
                                placeholder={team.name}
                                />
                        ))}
                    </Input.Wrapper>
                    <br />
                    <Button variant='subtle' onClick={onAddTeamClick}>Legg til flere lag</Button>
                    <br />
                    <Button onClick={onGenerateClick}>Generer turnering</Button>
                </>
            )}
        </div>
    )



}