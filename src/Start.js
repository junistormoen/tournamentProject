import { auth, signInWithGooglePopup } from './firebase/firebaseConfig';
import { Button } from '@mantine/core';
import { App } from "./App.js";
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';

export function Start() {
    const [loginUser, setLoginUser] = useState("");

    const logGoogleUser = async () => {
        await signInWithGooglePopup();
    };

    useEffect(() => {
        const subscriber = onAuthStateChanged(auth, setLoginUser);
        return subscriber
    }, [])


    return (
        <div className="App-container">

            {loginUser ? <App /> :
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