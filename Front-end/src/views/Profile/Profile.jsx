import React, { useContext, useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { URLSContext } from '../../ContextProvider/URLContextProvider';
import ListGroup from 'react-bootstrap/ListGroup';
import { Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Alert } from 'react-bootstrap';
import { Link, json } from 'react-router-dom';


export default function MyProfile() {
    // API URL 
    const { APIURL } = useContext(URLSContext);
    // i dati del user già loggato 
    const [user, setUser] = useState("");

    // variabili per il modale
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // i variabili per il modale per la modifica dei dati del utente
    const [name, setName] = useState(user.name);
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [password, setPassword] = useState("");


    // ottenere i dati del user già loggato
    async function getLoggedUser() {
        try {
            const response = await fetch(`${APIURL}authors/logged-user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });

            const userData = await response.json();
            setUser(userData);
            console.log(user);
        } catch (err) {
            console.log(err);
        };
    };

    useEffect(() => {
        getLoggedUser();
    }, []);



    async function modifyProfile() {

        // controllare se il user ha compilato tutti i cambi
        if (!name || !surname || !email || !username || !dateOfBirth || !password) {
            document.getElementById("alertBoxNotFilled").classList.remove("d-none");
            setTimeout(() => {
                document.getElementById("alertBoxNotFilled").classList.add("d-none")
            }, 5000);
            return;
        };


        const formData = {
            name: name,
            lastName: surname,
            userName: username,
            password: password,
            email: email,
            date_of_birht: dateOfBirth
        }


        try {
            const response = await fetch(APIURL + "authors/", {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {

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

                // chiudere il modale
                handleClose();
            }

            // se la password è errata
            else if (response.status == 406) {
                console.log(response);
                document.getElementById("alertPassword").classList.remove("d-none");
                setTimeout(() => {
                    document.getElementById("alertPassword").classList.add("d-none")
                }, 5000);
                setUsername("");
                return;
            }

            // se il nuovo user name non è valido
            else if (response.status == 400) {
                console.log(response);
                document.getElementById("alertUserNameToken").classList.remove("d-none");
                setTimeout(() => {
                    document.getElementById("alertUserNameToken").classList.add("d-none")
                }, 5000);
                setUsername("");
                return;
            }

            // altri errori
            else {
                throw new Error('Network response was not ok');
                document.getElementById("alertPassword").classList.remove("d-none");
                setTimeout(() => {
                    document.getElementById("alertPassword").classList.add("d-none")
                }, 5000);
                setUsername("");
                return;
            } ;



        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container fluid="sm">
            <div>
                <Tabs
                    defaultActiveKey="profile"
                    id="uncontrolled-tab-example"
                    className="mb-3">
                    <Tab eventKey="account" title="Account" >
                        <div className="d-flex gap-2 align-items-center">
                            <img className="img-profile" src={`${user.avatar}`} alt="profilo" />
                            <p className="m-0 p-0">{`${user.name} ${user.lastName}`}</p>
                        </div>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h4 className='mt-5 mb-4 ms-2'>Le tue informazioni:</h4>
                            <Button variant="outline-secondary" className='mx-2' onClick={handleShow}>
                                <FontAwesomeIcon icon={faPencil} />
                                <span className="ms-2">Modifica Dati</span>
                            </Button>
                        </div>
                        <ListGroup>
                            <ListGroup.Item>
                                <span>Nome: </span>
                                <span className='fw-bold'>{user.name}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span>Cognome: </span>
                                <span className='fw-bold'>{user.lastName}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span>User name: </span>
                                <span className='fw-bold'>{user.userName}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span>Email: </span>
                                <span className='fw-bold'>{user.email}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span>Data di nascità: </span>
                                <span className='fw-bold'>{user.date_of_birht}</span>
                            </ListGroup.Item>
                        </ListGroup>


                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Modifica dati personali</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>

                                <Form className='mt-5'>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nome *</Form.Label>
                                        <Form.Control className='w-75' value={name} type="text" placeholder="Inserisci il tuo nome" onChange={e => setName(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Cognome *</Form.Label>
                                        <Form.Control className='w-75' value={surname} type="text" placeholder="Inserisci il tuo cognome" onChange={e => setSurname(e.target.value)} />
                                    </Form.Group>


                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Usename *</Form.Label>
                                        <Form.Control className='w-75' value={username} type="text" placeholder="Scegli un username" onChange={e => setUsername(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email *</Form.Label>
                                        <Form.Control className='w-75' value={email} type="text" placeholder="Inserisci il tuo indirizzo email" onChange={e => setEmail(e.target.value)} />
                                        <Form.Text className="text-muted">
                                            We'll never share your email with anyone else.
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Data di nascita *</Form.Label>
                                        <Form.Control className='w-75' value={dateOfBirth} type="date" placeholder="Data di nascita" onChange={e => setDateOfBirth(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>La tua attuale password *</Form.Label>
                                        <Form.Control className='w-75' value={password} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                                    </Form.Group>


                                    <Alert id='alertPassword' className='d-none' variant='danger'> La password inserita è errata!</Alert>

                                    <Alert id='alertBoxNotFilled' className='d-none' variant='danger'> Alcuni campi sono obligattori!</Alert>

                                    <Alert id='accountCreated' className='d-none' variant='success '> il tuo account è stato modificato correttamente </Alert>

                                    <Alert id='alertUserNameToken' className='d-none' variant='danger'>Questo user name non è disponibile!</Alert>
                                </Form>



                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={modifyProfile}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Tab>

                    <Tab eventKey="blogs" title="Blogs">
                        Tab content for blogs
                        <h2>1</h2>
                    </Tab>
                    {/* <Tab eventKey="contact" title="Contact">
                        Tab content for Contact
                    </Tab> */}
                </Tabs>
            </div>
        </Container>
    )
}