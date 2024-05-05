import React, { useContext, useState } from 'react'
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import "./LogIn.css"
import { URLSContext } from '../../ContextProvider/URLContextProvider';
import { useNavigate } from 'react-router-dom';

export default function LogIn() {
    // variabili del form
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    // URL context provider
    const { APIURL } = useContext(URLSContext);

    const navigate = useNavigate();


    // body of call variable
    const dataForm = {
        userName: userName,
        password: password,
    }
    // la chiamata fatch
    async function loginCall() {
        try {
            // effettuare il log in
            const response = await fetch(APIURL + "log/login",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataForm)
                });
            console.log(response.status)
            // prendere il token
            if (response.ok) {
                const user = await response.json()
                let token = user.token;

                // salvare il token nel localStorage
                localStorage.setItem("token", token);

                // rimandare alla home page
                navigate("/home");
                // aggiornare la pagine per aggirnare il nome nella navbar
                window.location.reload();


                // gestire le risposte negative
            } else if (response.status == 404) {
                document.getElementById("alert-username").classList.remove("d-none");
                setTimeout(() => {
                    document.getElementById("alert-username").classList.add("d-none");
                }, 5000)
            } else if (response.status == 400) {
                document.getElementById("alert-password").classList.remove("d-none");
                setTimeout(() => {
                    document.getElementById("alert-password").classList.add("d-none");
                }, 5000)
            }

        } catch (err) {
            console.error(err);
        }
    }


    return (
        <Container fluid="sm">
            <Form className='mt-5'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control value={userName} onChange={e => setUserName(e.target.value)} type="text" placeholder="Enter your Username" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
                </Form.Group>

                <Alert id="alert-username" className='d-none' variant='danger'>Username errato</Alert>
                <Alert id="alert-password" className='d-none' variant='danger'>Password errata</Alert>

                <div className='d-flex justify-content-between align-items-center'>
                    <Button onClick={loginCall} variant="primary" type="button">
                        Login
                    </Button>
                    <div className='d-flex justify-content-center align-items-center gap-4'>
                        <p className='m-0'>Oppure sei nuovo?</p>
                        <Link to="/log/register" variant="primary" type="button">
                            Registera
                        </Link>
                    </div>
                </div>
            </Form>
        </Container>
    );
}