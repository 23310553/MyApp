import { useState } from 'react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';


export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    console.log(auth?.currentUser?.email);

    //Create account/ Sign in with email
    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err)
        };
    };

    //Create account/ Sign in with Google email
    const signInWithGoogle = async () => {
        const googleProvider = new GoogleAuthProvider();
            googleProvider.addScope('profile');
            googleProvider.addScope('email');

        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err)
        };
    };

    //Log out of account
    const signout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err)
        };
    };

    return (
        <div>
            <input 
                placeholder="Email" 
                onChange={(e) => setEmail(e.target.value) } 
            />
            <input 
                placeholder="Password" 
                type="password"
                onChange={(e) => setPassword(e.target.value) }
            />
            <button onClick={signIn}> Sign In</button>
            <button onClick={signInWithGoogle}> Sign In with Google </button>

            <button onClick={signout}> Sign Out </button>
        </div>
    );
};