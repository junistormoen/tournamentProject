import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Table, Text, Button, Tabs, Modal, Input } from '@mantine/core';
import tournamentService from './firebase/TournamentService';

export function Games(props) {
    const [tournament, setTournament] = useState(null)
    const [rounds, setRounds] = useState([])

    const [selectedMatch, setSelectedMatch] = useState({});
    const [team1Result, setTeam1Result] = useState('');
    const [team2Result, setTeam2Result] = useState('');

    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        getTournamentInfo();
    })

    async function getTournamentInfo() {
        const tournamentInfo = await tournamentService.getTournament(props.id);

        setTournament(tournamentInfo);
        setRounds(tournamentInfo.rounds)
    }

    function onTournamentClick(match, roundIndex, matchIndex) {
        setSelectedMatch({ match, roundIndex, matchIndex })
        open()

        console.log("klikket på " + match.team1 + " vs " + match.team2)
    }

    async function onSaveResultsClick() {
        close()
        const result = { team1: team1Result, team2: team2Result };
        await tournamentService.setResults(props.id, selectedMatch.roundIndex, selectedMatch.matchIndex, result)
    }

    function onEditClick() {

    }

    return (
        <>
            <div className='App-header'>
                <Button onClick={props.onClick}>Tilbake</Button>
            </div>

            <div className='App-container' style={{textAlign:'center'}}>
                <h1>{tournament?.name}</h1>

                <Tabs color="teal" variant="pills" defaultValue="tournament">
                    <Tabs.List>
                        <Tabs.Tab value="tournament">
                            Turnering
                        </Tabs.Tab>
                        <Tabs.Tab value="results">
                            Resultater
                        </Tabs.Tab>
                        <Tabs.Tab value="teams">
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
                                            <Table.Tr key={matchIndex}
                                                style={{ opacity: match.result ? 0.5 : 1 }}
                                                onClick={() => onTournamentClick(match, roundIndex, matchIndex)}>
                                                <Table.Td>{match.team1}</Table.Td>
                                                {match.result ? (<Table.Td>{match.result.team1}</Table.Td>) : (<Table.Td>-</Table.Td>)}
                                                <Table.Td>vs</Table.Td>
                                                {match.result ? (<Table.Td>{match.result.team2}</Table.Td>) : (<Table.Td>-</Table.Td>)}
                                                <Table.Td>{match.team2}</Table.Td>
                                            </Table.Tr>
                                        ))
                                        }
                                    </Table.Tbody>
                                </Table>
                            </div>
                        ))}
                        <Modal opened={opened} onClose={close} title="Legg til resultater">
                            {selectedMatch.match && (
                                <div>
                                    <h3>{selectedMatch.match.team1}
                                        <Input
                                            type="number"
                                            onChange={(e) => setTeam1Result(e.target.value)}
                                        />
                                        vs
                                        <Input
                                            type="number"
                                            onChange={(e) => setTeam2Result(e.target.value)}
                                        />
                                        {selectedMatch.match.team2}</h3>
                                    <Button onClick={() => onSaveResultsClick()}>Lagre</Button>
                                </div>
                            )}
                        </Modal>
                    </Tabs.Panel>

                    <Tabs.Panel value="results">
                        <Table>
                            <Table.Tbody>
                                {tournament?.teams
                                    .sort((a, b) => b.score - a.score)
                                    .map((team, index) => (
                                        <Table.Tr key={index}>
                                            <Table.Td>{index + 1 + "."}</Table.Td>
                                            <Table.Td>{team.name}</Table.Td>
                                            <Table.Td>{team.score + " poeng"}</Table.Td>
                                        </Table.Tr>
                                    ))}
                            </Table.Tbody>
                        </Table>
                    </Tabs.Panel>

                    <Tabs.Panel value="teams">
                        <Table style={{ margin: '0 auto', maxWidth: 600, textAlign: 'center' }}>
                            <Table.Tbody>
                                {tournament?.teams.map((team, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td>{team.name}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>

                        </Table>
                        <Button
                            size="xs"
                            onClick={() => onEditClick()}
                        >
                            Rediger
                        </Button>
                    </Tabs.Panel>
                </Tabs>
            </div >
        </>
    )
}