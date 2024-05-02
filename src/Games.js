import React, { useState, useEffect } from 'react';
import { Table, Text, Popover, Button } from '@mantine/core';
import tournamentService from './firebase/TournamentService';
import { toBeRequired } from '@testing-library/jest-dom/matchers';


export function Games(props) {
    const [tournament, setTournament] = useState(null)
    const [rounds, setRounds] = useState([])

    useEffect(() => {
        getTournament();
    }, [])

    async function getTournament() {
        const tournamentInfo = await tournamentService.getTournament(props.id);
        const rounds = tournamentInfo.rounds

        setTournament(tournamentInfo);
        setRounds(tournamentInfo.rounds)
    }




    return (
        <div>
            <h1>{tournament?.name}</h1>

            <Popover width={200} position="bottom" withArrow shadow="md">
                <Popover.Target>
                    <Button variant='transparent' color='teal' size="xs">Klikk her for å se alle lagene</Button>
                </Popover.Target>
                <Popover.Dropdown>
                    {tournament?.teams.map((team, index) => (
                        <Text key={index}>{team}</Text>
                    ))}
                </Popover.Dropdown>
            </Popover>

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
        </div >
    )
}