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

  setResults: async function (tournamentId, roundIndex, matchIndex, result) {
    const tournamentRef = doc(db, "tournaments", tournamentId);
    const torunamentDoc = await getDoc(tournamentRef);
    const tournamentData = torunamentDoc.data();

    console.log(result)
    const updatedRounds = [...tournamentData.rounds]
    updatedRounds[roundIndex].matches[matchIndex].result = result

    const matchTeams = updatedRounds[roundIndex].matches[matchIndex]

    const team1Score = parseInt(result.team1);
    const team2Score = parseInt(result.team2);

    tournamentData.teams.forEach((team) => {
      if (team.name === matchTeams.team1) {
        if (team1Score > team2Score) {
          team.score += 3;
        } else if (team1Score < team2Score) {
          team.score += 0;
        } else {
          team.score += 1;
        }
      } else if (team.name === matchTeams.team2) {
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
  }
};

export default tournamentService
