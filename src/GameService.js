const gameService = {
    generateRounds: function (teams) {
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
    },

    calculateResults: async function (tournament, newResult, oldResult, roundIndex, matchIndex) {
        const updatedRounds = [...tournament.rounds]
        const match = updatedRounds[roundIndex].matches[matchIndex]
        match.result = newResult

        const team1Score = parseInt(newResult.team1);
        const team2Score = parseInt(newResult.team2);

        if (oldResult) {
            tournament.teams.forEach((team) => {
                if (team.name === match.team1) {
                    if (oldResult.team1 > oldResult.team2) {
                        team.score -= 3;
                    } else if (oldResult.team1 === oldResult.team2) {
                        team.score -= 1;
                    }
                } else if (team.name === match.team2) {
                    if (oldResult.team2 > oldResult.team1) {
                        team.score -= 3;
                    } else if (oldResult.team2 === oldResult.team1) {
                        team.score -= 1;
                    }
                }
            });
        }

        tournament.teams.forEach((team) => {
            if (team.name === match.team1) {
                if (team1Score > team2Score) {
                    team.score += 3;
                } else if (team1Score < team2Score) {
                    team.score += 0;
                } else {
                    team.score += 1;
                }
            } else if (team.name === match.team2) {
                if (team2Score > team1Score) {
                    team.score += 3;
                } else if (team2Score < team1Score) {
                    team.score += 0;
                } else {
                    team.score += 1;
                }
            }
        });
        
        return tournament
    }
}

export default gameService