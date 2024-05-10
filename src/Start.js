import { auth, signInWithGooglePopup } from './firebase/firebaseConfig';
import { Button } from '@mantine/core';
import { Home } from './Home';
import { App } from "./App.js";
import { onAuthStateChanged } from 'firebase/auth';
import React, { useState } from 'react';

export function Start() {
    const [currentUser, setCurrentUser] = useState("");

    const logGoogleUser = async () => {
        console.log("START")
        await signInWithGooglePopup();
        console.log(auth);
        console.log(auth.currentUser)
    };

    onAuthStateChanged(auth, (user) => {
        setCurrentUser(user)
    })


    return (
        <div className="App-container">

            {auth.currentUser !== null ? <App /> :
                <Button
                    type="submit"
                    onClick={logGoogleUser}
                >
                    Logg inn
                </Button>
            }
        </div>
    )
}