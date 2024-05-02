import React, { useState } from "react"
import { Input, Button } from "@mantine/core"
import { Games } from "./Games";
import tournamentService from "./firebase/TournamentService";
import { auth } from './firebase/firebase';


export function NewTournament() {
    const [tournamentId, setTournamentId] = useState("");
    const [tournamentName, setTournamentName] = useState("");
    const [tournamentTeams, setTournamentTeams] = useState(['Lag 1', 'Lag 2']);

    const [clicked, setClicked] = useState(false);

    function onIdInputChange(input) {
        setTournamentId(input.target.value)
    }

    function onNameInputChange(input) {
        setTournamentName(input.target.value)
    }

    function onTeamInputChange(index, input) {
        const newTeamNames = [...tournamentTeams]
        newTeamNames[index] = input.target.value
        setTournamentTeams(newTeamNames);
    }

    function onAddTeamClick() {
        setTournamentTeams([...tournamentTeams, 'Lag ' + (tournamentTeams.length + 1)])
    }

    async function onGenerateClick() {
        console.log(tournamentTeams)

        const rounds = generateRounds(tournamentTeams)
        console.log(rounds)

        const data = {
            userId: auth.currentUser.uid,
            name: tournamentName,
            numberOfTeams: tournamentTeams.length,
            teams: tournamentTeams,
            rounds: rounds
        }
        console.log(data)

        tournamentService.setTournament(tournamentId, data);
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
            rounds[i] = {matches:[]};
            for (let j = 0; j < numTeams / 2; j++) {
                const team1 = teams[j];
                const team2 = teams[numTeams - 1 - j];

                if (team1 && team2) {
                    rounds[i].matches.push({
                        team1: team1,
                        team2: team2
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
        <div className="App-header">
            {clicked ? <Games id={tournamentId}></Games> : (
                <>
                    <h3>Legg til ny turnering</h3>
                    <Input.Wrapper label="ID" description="Legg til en id på turneringen">
                        <Input id="id" onChange={onIdInputChange}></Input>
                    </Input.Wrapper>
                    <Input.Wrapper label="Navn" description="Legg til et navn på turneringen">
                        <Input id="name" onChange={onNameInputChange}></Input>
                    </Input.Wrapper>
                    <Input.Wrapper label="Lag" description=" ">
                        {tournamentTeams.map((team, index) => (
                            <Input key={index} id={'team' + { index }} onChange={(e) => onTeamInputChange(index, e)} placeholder={team}></Input>
                        ))}
                    </Input.Wrapper>
                    <br />
                    <Button fullWidth variant='subtle' onClick={onAddTeamClick}>Legg til flere lag</Button>
                    <br />
                    <Button fullWidth onClick={onGenerateClick}>Generer turnering</Button>
                </>
            )}
        </div>
    )



}