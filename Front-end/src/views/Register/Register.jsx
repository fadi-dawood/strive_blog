import React, { useContext, useState } from 'react'
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Alert } from 'react-bootstrap';
import { Link, json } from 'react-router-dom';
import "./Register.css"
import { URLSContext } from '../../ContextProvider/URLContextProvider';

export default function Register() {
    let [name, setName] = useState("");
    let [surname, setSurname] = useState("");
    let [email, setEmail] = useState("");
    let [username, setUsername] = useState("");
    let [dateOfBirth, setDateOfBirth] = useState("");
    let [password, setPassword] = useState("");
    let [verificapass, setVerificapass] = useState("");

    const { APIURL } = useContext(URLSContext);


    async function createAcount() {

        // controllare se il user ha compilato tutti i cambi
        if (!name || !surname || !email || !username || !dateOfBirth || !password || !verificapass) {
            document.getElementById("alertBoxNotFilled").classList.remove("d-none");
            setTimeout(() => {
                document.getElementById("alertBoxNotFilled").classList.add("d-none")
            }, 5000);
            return;
        }


        // controllare se le due password combaciano
        if (password !== verificapass) {
            document.getElementById("alertPassword").classList.remove("d-none");
            setTimeout(() => {
                document.getElementById("alertPassword").classList.add("d-none")
            }, 5000);
            return;
        }


        const formData = {
            name: name,
            lastName: surname,
            userName: username,
            password: password,
            email: email,
            date_of_birht: dateOfBirth
        }
        console.log(formData);


        try {
            const response = await fetch(APIURL + "log/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // se il user name non è valido
            if (response.status == 400) {
                document.getElementById("alertUserNameToken").classList.remove("d-none");
                setTimeout(() => {
                    document.getElementById("alertUserNameToken").classList.add("d-none")
                }, 5000);
                setUsername("");
                return;
            }

            // altri errori
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {

                // mostrare un messaggio che l'operazione è andata a buon fine
                document.getElementById("accountCreated").classList.remove("d-none");
                setTimeout(() => {
                    document.getElementById("accountCreated").classList.add("d-none")
                }, 5000);

                //pulire il form:
                setName("");
                setSurname("");
                setEmail("");
                setUsername("");
                setDateOfBirth("");
                setPassword("");
                setVerificapass("");
            }

        } catch (err) {
            console.error(err);
        }
    }




    return (
        <Container fluid="sm">
            <Form className='mt-5'>
                <Form.Group className="mb-3">
                    <Form.Label>Nome *</Form.Label>
                    <Form.Control value={name} type="text" placeholder="Inserisci il tuo nome" onChange={e => setName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Cognome *</Form.Label>
                    <Form.Control value={surname} type="text" placeholder="Inserisci il tuo cognome" onChange={e => setSurname(e.target.value)} />
                </Form.Group>


                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Usename *</Form.Label>
                    <Form.Control value={username} type="text" placeholder="Scegli un username" onChange={e => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control value={email} type="text" placeholder="Inserisci il tuo indirizzo email" onChange={e => setEmail(e.target.value)} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Data di nascita *</Form.Label>
                    <Form.Control value={dateOfBirth} type="date" placeholder="Data di nascita" onChange={e => setDateOfBirth(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control value={password} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Conferma la tua Password *</Form.Label>
                    <Form.Control value={verificapass} type="password" placeholder="Password" onChange={e => setVerificapass(e.target.value)} />
                </Form.Group>

                <Alert id='alertPassword' className='d-none' variant='danger'> le due password non combaciano!</Alert>

                <Alert id='alertBoxNotFilled' className='d-none' variant='danger'> Alcuni campi sono obligattori!</Alert>

                <Alert id='accountCreated' className='d-none' variant='success '> il tuo account è stato creato correttamente </Alert>

                <Alert id='alertUserNameToken' className='d-none' variant='danger'>Questo user name non è disponibile!</Alert>

                <div className='d-flex justify-content-between align-items-center'>
                    <Button variant="primary" type="button" onClick={createAcount}>
                        Crea account
                    </Button>
                    <div className='d-flex justify-content-center align-items-center gap-4'>
                        <p className='m-0'>Oppure hai già un account!</p>
                        <Link to="/log/login" variant="primary" type="submit">
                            Login
                        </Link>
                    </div>
                </div>
            </Form>
        </Container>
    );
}