import React from 'react'
import Button from 'react-bootstrap/Button';



export default function GoogleAuth() {
    const handleGoogleAuth = async() => {
        const str = "http://localhost:3001/log/googleLogin";
        window.open(str, "_self");
    };


    return (
        <Button variant="success"  onClick={handleGoogleAuth}>
            Accedi con Google
        </Button>
    )
}
