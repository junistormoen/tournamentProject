import { auth, signInWithGooglePopup } from './firebase/firebase';
import { Button } from '@mantine/core';
import { Home } from './Home';

export function Start() {

    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        console.log(auth);

    };



    return (
        <div className="App-header">

            {!auth ? <Home/> :
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