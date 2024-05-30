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

  setResults: async function (tournamentId, updatedTournament) {
    const tournamentRef = doc(db, "tournaments", tournamentId);
    console.log(updatedTournament)
    await updateDoc(tournamentRef, {
      rounds: updatedTournament.rounds,
      teams: updatedTournament.teams
    })
  },

  updateTeamNames: async function (tournamentId, updatedTournament) {
    console.log(updatedTournament)
    const tournamentRef = doc(db, "tournaments", tournamentId);
    await updateDoc(tournamentRef, updatedTournament)
  }
};

export default tournamentService
