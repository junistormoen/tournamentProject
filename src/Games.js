import React, { useState, useEffect } from 'react';
import { Table, Text, Popover, Button, Tabs, Flex } from '@mantine/core';
import tournamentService from './firebase/TournamentService';

export function Games(props) {
    const [tournament, setTournament] = useState(null)
    const [rounds, setRounds] = useState([])
    console.log(props)

    useEffect(() => {
        getTournament();
    }, [])

    async function getTournament() {
        const tournamentInfo = await tournamentService.getTournament(props.id);

        setTournament(tournamentInfo);
        setRounds(tournamentInfo.rounds)
    }

    function onReturnClick(){
        console.log("RETURN")
        props.onClick()
    }




    return (
        <>
            <div className='App-header'>
                    <Button onClick={onReturnClick}>Tilbake</Button>
            </div>

            <div className='App-container'>

                <h1>{tournament?.name}</h1>

                <Tabs color="teal" variant="pills" defaultValue="tournament">
                    <Tabs.List>
                        <Tabs.Tab value="tournament">
                            Turnering
                        </Tabs.Tab>
                        <Tabs.Tab value="messages">
                            Resultater
                        </Tabs.Tab>
                        <Tabs.Tab value="settings">
                            Lag
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="tournament">
                        {rounds.map((round, roundIndex) => (
                            <div key={roundIndex}>
                                <Text style={{ marginTop: "20px" }} c="dimmed">Runde {roundIndex + 1} </Text>
                                <Table>
                                    <Table.Tbody>
                                        {round.matches.map((match, matchIndex) => (
                                            <Table.Tr key={matchIndex} >
                                                <Table.Td>{match.team1}</Table.Td>
                                                <Table.Td>vs</Table.Td>
                                                <Table.Td>{match.team2}</Table.Td>
                                            </Table.Tr>
                                        ))
                                        }
                                    </Table.Tbody>
                                </Table>

                            </div>
                        ))}
                    </Tabs.Panel>

                    <Tabs.Panel value="messages">
                        Messages tab content
                    </Tabs.Panel>

                    <Tabs.Panel value="settings">
                        {tournament?.teams.map((team, index) => (
                            <Text key={index}>{team}</Text>
                        ))}
                    </Tabs.Panel>
                </Tabs>


            </div >
        </>
    )
}