import { collection, getDoc, addDoc, doc, getDocs } from "firebase/firestore";
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
      console.log("No such document!");
      return []
    }

    return docSnap.data()
  },

  setTournament: async function (tournament) {
    console.log(tournament)
    const data = await addDoc(collection(db, "tournaments"), tournament);
    return data.id
  }
};

export default tournamentService
