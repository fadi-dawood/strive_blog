import React, { useContext, useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { URLSContext } from '../../ContextProvider/URLContextProvider';
import ListGroup from 'react-bootstrap/ListGroup';
import { Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Col, Row } from "react-bootstrap";
import BlogItem from '../../components/blog/blog-item/BlogItem';
import { useNavigate } from 'react-router-dom';



export default function MyProfile() {
    //^ Variabili
    // API URL 
    const { APIURL } = useContext(URLSContext);
    // i dati del user già loggato 
    const [user, setUser] = useState("");

    //& variabili per il modale
    // modifica dati section
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // modifica foto section
    const [showAvatar, setShowAvatar] = useState(false);
    const handleCloseAvatar = () => setShowAvatar(false);
    const handleShowAvatar = () => setShowAvatar(true);
    // delete account section
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);
    const handleCloseDeleteAccount = () => setShowDeleteAccount(false);
    const handleShowDeleteAccount = () => setShowDeleteAccount(true);
    // i variabili per il modale per la modifica dei dati del utente
    const [name, setName] = useState(user.name);
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [password, setPassword] = useState("");
    // variabili per getAllMyBlogs()
    const [blogs, setBlogs] = useState([]);
    // variabili per modificare l'avatar:
    const [avatar, setAvatar] = useState(null);

    const navigate = useNavigate();

    const handleImageChange = event => {
        const file = event.target.files[0];
        setAvatar(file);
    };



    //^-----------------------------------------------------------------------------------------------------------------------//
    //^ ottenere i dati del user già loggato
    async function getLoggedUserData() {
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
        } catch (err) {
            console.log(err);
        };
    };



    //^-----------------------------------------------------------------------------------------------------------------------//
    //^ Modifica i dati del profilo
    async function modifyProfile() {

        // controllare se il user ha compilato tutti i cambi
        if (!name || !surname || !email || !username || !dateOfBirth || !password) {
            document.getElementById("alertBoxNotFilled").classList.remove("d-none");
            setTimeout(() => {
                document.getElementById("alertBoxNotFilled").classList.add("d-none");
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
                setPassword("");
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
                document.getElementById("alertError").classList.remove("d-none");
                setTimeout(() => {
                    document.getElementById("alertError").classList.add("d-none")
                }, 5000);
                throw new Error('Network response was not ok');
            };



        } catch (err) {
            console.error(err);
        }
    };


    //^-----------------------------------------------------------------------------------------------------------------------//
    //^Ottenere tutti i post del utente
    async function getAllMyBlogs() {
        try {
            const response = await fetch(`${APIURL}blogpost/profile/blogs`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },

            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blogsData = await response.json();
            setBlogs(blogsData);
        } catch (err) {
            console.log(err);
        }
    };


    //^-----------------------------------------------------------------------------------------------------------------------//
    //^modificare la foto del profilo
    async function avatarModify() {
        const formData = new FormData();
        formData.append("avatar", avatar);

        try {
            const response = await fetch(`${APIURL}authors/avatar`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                //pulire il form:
                setAvatar(null);

                // chiudere il modale
                handleCloseAvatar();
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
        }
    };


    //^-----------------------------------------------------------------------------------------------------------------------//
    //^cancellare il tuo account
    async function deleteAccount() {
        try {
            const response = await fetch(`${APIURL}authors/`, {
                method: "DELETE",
                headers: {
                    "Authorization": localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                handleCloseDeleteAccount();
                localStorage.removeItem("token");
                navigate("/");
                window.location.reload();
            } else {

            }
        } catch (err) {

        }
    };


    //^-----------------------------------------------------------------------------------------------------------------------//
    //^al montaggio del componente
    useEffect(() => {
        getLoggedUserData();
        getAllMyBlogs()
    }, []);





    return (
        <Container fluid="sm">
            <div>
                <Tabs
                    defaultActiveKey="blogs"
                    id="uncontrolled-tab-example"
                    className="mb-3">
                    <Tab eventKey="account" title="Account" >
                        <div className="d-flex gap-2 align-items-center">
                            <img className="img-profile" src={`${user.avatar}`} alt="profilo" />
                            <p className="m-0 p-0">{`${user.name} ${user.lastName}`}</p>
                        </div>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h4 className='mt-5 mb-4 ms-2'>Le tue informazioni:</h4>
                            <div>
                                <Button variant="outline-secondary" className='mx-2' onClick={handleShow}>
                                    <FontAwesomeIcon icon={faPencil} />
                                    <span className="ms-2">Modifica Dati</span>
                                </Button>
                                <Button variant="outline-secondary" className='mx-2' onClick={handleShowAvatar}>
                                    <FontAwesomeIcon icon={faPencil} />
                                    <span className="ms-2">Modifica foto profilo</span>
                                </Button>
                                <Button variant="outline-danger" className='mx-2' onClick={handleShowDeleteAccount}>
                                    <FontAwesomeIcon icon={faTrash} />
                                    <span className="ms-2">Elimina Account</span>
                                </Button>
                            </div>
                        </div>


                        <ListGroup >
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


                                    <Form.Group className="mb-3" controlId="formBasicUsename">
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

                                    <Form.Group className="mb-3" controlId="formBasicDateOfBirth">
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

                                    <Alert id='alertError' className='d-none' variant='danger'>Qualcosa è andata storta!</Alert>
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


                        <Modal show={showAvatar} onHide={handleCloseAvatar}>
                            <Modal.Header closeButton>
                                <Modal.Title>Modifica dati personali</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='pe-5'>
                                <Form.Group controlId="blog-image" className="mt-3">
                                    <Form.Label>Carica immagine</Form.Label>
                                    <Form.Control type="file" onChange={handleImageChange} />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseAvatar}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={avatarModify}>
                                    Save new foto
                                </Button>
                            </Modal.Footer>
                        </Modal>


                        <Modal show={showDeleteAccount} onHide={handleCloseDeleteAccount}>
                            <Modal.Header closeButton>
                                <Modal.Title>Elimina il tuo Account</Modal.Title>
                            </Modal.Header>
                            <div className='p-4'>
                                <Form.Text>Sei sicuro di voler cancellare il tuo account!</Form.Text>
                                <br />
                                <Form.Text>I tuoi dati non saranno più recuperabili</Form.Text>
                            </div>
                            <Modal.Footer>
                                <Button variant="primary" onClick={handleCloseDeleteAccount}>
                                    Close
                                </Button>
                                <Button variant="danger" onClick={deleteAccount}>
                                    Cancella account
                                </Button>
                            </Modal.Footer>
                        </Modal>


                    </Tab>

                    <Tab eventKey="blogs" title="Blogs" >
                        <div className='d-flex justify-content-between align-items-center my-5'>
                            <h2>I tuoi Post:</h2>

                            <Button as={Link} to="/new" className="blog-navbar-add-button bg-dark" size="lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-plus-lg"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                                </svg>
                                Nuovo Articolo
                            </Button>
                        </div>
                        {!blogs.length &&
                            <h3>Non hai ancora pubblicato nessun blog!</h3>
                        }
                        <div>
                            <Row>
                                {blogs.map((blog) => (
                                    <Col
                                        key={blog._id}
                                        md={3}
                                        style={{
                                            marginBottom: 50,
                                        }}
                                    >
                                        <BlogItem {...blog} />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </Container>
    )
}