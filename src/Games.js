import React, { useState, useEffect, useCallback } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Table, Text, Button, Tabs, Modal, Input } from '@mantine/core';
import tournamentService from './firebase/TournamentService';

export function Games(props) {
    const [tournamentStarted, setTournamentStarted] = useState(false)
    const [tournament, setTournament] = useState(null);
    const [editTournament, setEditTournament] = useState(null)
    const [rounds, setRounds] = useState([])

    const [selectedMatch, setSelectedMatch] = useState({});
    const [team1Result, setTeam1Result] = useState('');
    const [team2Result, setTeam2Result] = useState('');
    const [alertText, setAlertText] = useState(false)

    const [addScoreModal, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [editTeamsModal, { open: openEditor, close: closeEditor }] = useDisclosure(false);

    const getTournamentInfo = useCallback(async () => {
        const tournamentInfo = await tournamentService.getTournament(props.id);
        setTournament(tournamentInfo);
        setRounds(tournamentInfo.rounds);
    }, [props.id]);

    useEffect(() => {
        getTournamentInfo();
    }, [getTournamentInfo])

    function onTournamentClick(match, roundIndex, matchIndex) {
        setSelectedMatch({ match, roundIndex, matchIndex })
        openModal()
    }

    async function onSaveResultsClick() {
        if (team1Result && team2Result) {
            closeModal()
            const oldResult = selectedMatch.match.result || false;
            const result = { team1: team1Result, team2: team2Result };
            await tournamentService.setResults(props.id, selectedMatch.roundIndex, selectedMatch.matchIndex, result, oldResult)
            getTournamentInfo()

            setTournamentStarted(true)
            setTeam1Result(null)
            setTeam2Result(null)
            setAlertText(false)
        } else {
            setAlertText(true)
        }
    }

    function onEditClick() {
        openEditor()
        setEditTournament(tournament)
    }

    function onDeleteClick(teamName) {
        const updatedTeams = editTournament.teams.filter(team => team.name !== teamName);
        const updatedRounds = editTournament.rounds.map(round => ({
            ...round,
            matches: round.matches.filter(match => match.team1 !== teamName && match.team2 !== teamName)
        }));

        setEditTournament({ ...editTournament, teams: updatedTeams, rounds: updatedRounds, numberOfTeams: updatedTeams.length })
    }

    function handleNameChange(oldName, newName) {
        tournament.teams.forEach((team) => {
            if (team.name === oldName) {
                team.name = newName
                return;
            }
        })

        tournament.rounds.forEach((round) => {
            round.matches.forEach((match) => {
                if (match.team1 === oldName) {
                    match.team1 = newName
                } else if (match.team2 === oldName) {
                    match.team2 = newName
                }
            })
        })

        setTournament(tournament)
    }

    function onSaveEditClick() {
        closeEditor();
        tournamentService.updateTeamNames(props.id, editTournament)
        getTournamentInfo()
    }

    return (
        <>
            <div className='App-container'>
                <div className='App-title'>
                    <h1>{tournament?.name}</h1>
                </div>

                <Tabs color="teal" variant="pills" defaultValue="tournament" radius="md" style={{ color: '#838584' }}>
                    <Tabs.List >
                        <Tabs.Tab value="tournament">
                            Kamper
                        </Tabs.Tab>
                        <Tabs.Tab value="results">
                            Resultater
                        </Tabs.Tab>
                        <Tabs.Tab value="teams">
                            Info
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="tournament" style={{ color: 'white' }}>
                        <Text size="xs" style={{ paddingTop: '20px' }}>Klikk på en kamp for å legge til resultater</Text>
                        {rounds.map((round, roundIndex) => (
                            <div key={roundIndex}>
                                <Text style={{ marginTop: "20px" }} c="dimmed">Runde {roundIndex + 1} </Text>
                                <Table>
                                    <Table.Tbody>
                                        {round.matches.map((match, matchIndex) => (
                                            <Table.Tr key={matchIndex}
                                                style={{ opacity: match.result ? 0.5 : 1, cursor: "pointer" }}
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
                        <Modal opened={addScoreModal} onClose={closeModal} title="Legg til resultater">
                            {selectedMatch.match && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <p style={{ margin: '0 10px' }}>{selectedMatch.match.team1}</p>
                                    <Input
                                        style={{ width: '50px', margin: '0 10px' }}
                                        placeholder={(selectedMatch.match.result) ? selectedMatch.match.result.team1 : "-"}
                                        type="number"
                                        onChange={(e) => setTeam1Result(e.target.value)}
                                    />
                                    <p style={{ margin: '0 20px' }}> vs </p>
                                    <Input
                                        style={{ width: '50px', margin: '0 10px' }}
                                        placeholder={(selectedMatch.match.result) ? selectedMatch.match.result.team2 : "-"}
                                        type="number"
                                        onChange={(e) => setTeam2Result(e.target.value)}
                                    />
                                    <p style={{ margin: '0 10px' }}>{selectedMatch.match.team2}</p>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Button onClick={() => onSaveResultsClick()}>Lagre</Button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                {alertText && <Text color='red' size='sm'>Legg til resultater for å lagre</Text>}
                            </div>
                        </Modal>
                    </Tabs.Panel>

                    <Tabs.Panel value="results" style={{ color: 'white' }}>
                        <Table>
                            <Table.Tbody>
                                {tournament?.teams
                                    .slice()
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

                    <Tabs.Panel value="teams" style={{ color: 'white' }}>
                        <Table style={{ margin: '0 auto', maxWidth: 600, textAlign: 'center' }}>
                            <Table.Tbody>
                                {tournament?.teams
                                    .map((team, index) => (
                                        <Table.Tr key={index}>
                                            <Table.Td>{team.name}</Table.Td>
                                        </Table.Tr>
                                    ))}
                            </Table.Tbody>

                        </Table>
                        <Button
                            size="xs"
                            onClick={onEditClick}
                            variant='transparent'
                            color='gray'
                        >
                            Rediger
                        </Button>
                        <Modal opened={editTeamsModal} onClose={closeEditor} title="Rediger lagnavn" >
                            {editTournament?.teams.map((team, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', justifyContent: 'center' }}>
                                    <Input
                                        placeholder={team.name}
                                        onChange={(e) => handleNameChange(team.name, e.target.value)}
                                    />
                                    <Button variant='transparent' color='gray' size='xs' onClick={() => onDeleteClick(team.name)}>slett</Button>
                                </div>
                            ))}

                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                {tournamentStarted ?
                                    <Text size='xs' color='grey'>Kan ikke legge til flere lag</Text>
                                    :
                                    <Button variant='subtle' size='xs'>Legg til flere lag</Button>
                                }
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Button onClick={() => onSaveEditClick()}>Lagre</Button>
                            </div>
                        </Modal>
                    </Tabs.Panel>
                </Tabs>
            </div >
        </>
    )
}