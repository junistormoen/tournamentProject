import { auth, signInWithGooglePopup } from './firebase/firebaseConfig';
import { Button, Image } from '@mantine/core';
import { App } from "./App.js";
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import logo from './logo.png';

export function Start() {
    const [loginUser, setLoginUser] = useState("");

    const logGoogleUser = async () => {
        await signInWithGooglePopup();
    };

    useEffect(() => {
        const subscriber = onAuthStateChanged(auth, setLoginUser);
        return subscriber
    }, [])

    console.log(logo)

    return (
        <>
            {loginUser ? <App /> :
                <div className="App-container">
                    <Image src={logo} style={{height: 400, width: 400, paddingBottom: 50}}></Image>
                    <Button
                        color='#DB594A'
                        type="submit"
                        onClick={logGoogleUser}
                    >
                        Logg inn
                    </Button>
                </div>
            }
        </>
    )
}