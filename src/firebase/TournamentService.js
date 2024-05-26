import { collection, getDoc, addDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";


const tournamentService = {
  getTournaments: async function () {
    const tournaments = [];
    const querySnapshot = await getDocs(collection(db, 'tournaments'));

    querySnapshot.forEach((doc) => {
      tournaments.push({ id: doc.id, ...doc.data() });
    });

    return tournaments;
  },

  getTournament: async function (tournamentId) {
    const docSnap = await getDoc(
      doc(db, "tournaments", tournamentId)
    )

    if (!docSnap.exists()) {
      return []
    }

    return docSnap.data()
  },

  addTournament: async function (tournament) {
    const data = await addDoc(collection(db, "tournaments"), tournament);
    return data.id
  },

  setResults: async function (tournamentId, roundIndex, matchIndex, result, oldResult) {
    const tournamentRef = doc(db, "tournaments", tournamentId);
    const torunamentDoc = await getDoc(tournamentRef);
    const tournamentData = torunamentDoc.data();

    const updatedRounds = [...tournamentData.rounds]
    const match = updatedRounds[roundIndex].matches[matchIndex]
    match.result = result

    const team1Score = parseInt(result.team1);
    const team2Score = parseInt(result.team2);

    if (oldResult) {
      tournamentData.teams.forEach((team) => {
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

    tournamentData.teams.forEach((team) => {
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

    await updateDoc(tournamentRef, {
      rounds: updatedRounds,
      teams: tournamentData.teams
    })
  },

  updateTeamNames: async function (tournamentId, updatedTournament) {
    const tournamentRef = doc(db, "tournaments", tournamentId);
    await updateDoc(tournamentRef, updatedTournament)
  }
};

export default tournamentService
