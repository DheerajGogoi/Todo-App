import './Login.scss'
import { useState, useRef } from "react";
import { Box, Center, FormControl, Input, Button, Text, Image, Heading, Alert, AlertDescription, Spinner } from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import google from "../../Assets/google.png";
import facebook from "../../Assets/facebook.png";
import {  WarningIcon } from "@chakra-ui/icons";
import { db } from "../../firebase";
import firebase from "firebase/compat/app";
import { authActions } from "../../redux/store";
import { useDispatch } from "react-redux";

export default function Login(){
    const dispatch = useDispatch();

    const emailRef = useRef();
    const passwordRef = useRef();

    const [error, setError ] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleLogin = e => {
        e.preventDefault();
    }

    const handleSignInWithGoogle = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            firebase.auth().signInWithPopup(provider).then(function(result) {
                var token = result.credential.accessToken;
                var user = result.user;
                let {displayName, email, photoURL, uid} = user._delegate;
                let user_cred = {displayName, email, photoURL, uid};
                dispatch(authActions.login({user_cred}))
            });
            setLoading(false);
        } catch (e) {
            setError(e.message);
            alert(e.message);
        }
    }


    return (
        <center>
            <div className='login-page'>

                <div className='login-box'>

                    <h2>Login to continue</h2>

                    <form onSubmit={ handleLogin }>
                        <button className='login-button' onClick={handleSignInWithGoogle}>
                            <img src={google} alt="" />
                            <div className='btn-text'>Continue with google</div>
                        </button>
                    </form>

                </div>
            </div>
        </center>
    );
}