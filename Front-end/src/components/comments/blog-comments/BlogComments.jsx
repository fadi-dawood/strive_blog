import React, { useContext, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { CardGroup, CardTitle, Col, Row } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { URLSContext } from '../../../ContextProvider/URLContextProvider';
import { useParams } from 'react-router-dom';
import NewComment from '../new-comment/NewComment';


export default function BlogComments({ comment, downloadComments }) {
    let [showInputModify, setShowInputModify] = useState(false);

    // url da usecontext
    let { APIURL } = useContext(URLSContext);

    // l'id del post dat URL
    let { id } = useParams();

    // cancellare un post
    async function deleteComment() {
        // controllare se il user sta cancellando un commento suo
        if (!comment.isCommentOfLoggedUser) {
            return;
        } else {
            //chiamata fetch
            try {
                await fetch(`${APIURL}blogpost/${id}/comment/${comment._id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": localStorage.getItem("token"),
                        "content-type": "application/json"
                    }
                });

                // ricaricare i commenti del post
                downloadComments();
            } catch (err) {
                console.log(err);
            };
        };
    };


    // modificare un commento:
    function modifyComment() {
        // controllare se il user sta cancellando un commento suo
        if (!comment.isCommentOfLoggedUser) {
            return;
        } else {
            setShowInputModify(!showInputModify);
        };

    };





    return (
        <div>
            <Container>
                <Card className='my-3 py-1 border-0'>
                    <CardGroup xs={2}>
                        <Card.Title className='p-0 m-0'>{comment.user}</Card.Title>
                    </CardGroup>
                    <CardGroup className='d-flex flex-row justify-content-start align-items-center '>
                        <Card.Body className='p-0 m-0'>{comment.comment_content}</Card.Body>
                        {(comment.isCommentOfLoggedUser) &&
                            <div>
                                <Button variant="outline-secondary" className='mx-2' onClick={modifyComment}>
                                    <FontAwesomeIcon icon={faPencil} />
                                </Button>
                                <Button variant="outline-danger" className='mx-2' onClick={deleteComment}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </div>
                        }
                    </CardGroup>
                    {showInputModify &&
                        <NewComment downloadComments={downloadComments} setShowInputModify={setShowInputModify} commentToBeModified={comment}></NewComment>
                    }
                </Card>

            </Container>
            <hr />
        </div>
    )
}
