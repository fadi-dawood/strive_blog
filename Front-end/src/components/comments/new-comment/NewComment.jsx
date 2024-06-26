import React, { useContext, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { URLSContext } from '../../../ContextProvider/URLContextProvider';
import { useParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

export default function NewComment({ downloadComments, commentToBeModified = "", setShowInputModify }) {
  // il contenuto del commento
  const [comment, setComment] = useState("");
  const params = useParams();

  // url
  const { APIURL } = useContext(URLSContext);


  //^ New comment
  async function sendNewComment() {
    const { id } = params;

    // il payload da mandare con la fetch
    const payload = {
      comment_content: comment
    };

    // controllare che il commento non sia vuoto
    if (comment === "") { return };

    try {
      const response = await fetch(`${APIURL}blogpost/${id}`, {
        method: "POST",
        headers: {
          "Authorization": localStorage.getItem("token"),
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      }
      );

      // gestire la risposta
      if (!response.ok) {
        document.getElementById("faild-comment").classList.remove("d-none");
        setTimeout(() => {
          document.getElementById("faild-comment").classList.add("d-none");
        }, 5000)
        throw new Error("Error");
      } else {
        setComment("");
        // rifare la fetch per caricare il commento appena inviato
        downloadComments();
      };

    } catch (err) {
      console.log(err);
    };
  };





  //^ Modificare il commento
  async function modifyComment() {
    const { id } = params;

    // il payload da mandare con la fetch
    const payload = {
      comment_content: comment
    };

    // controllare che il commento non sia vuoto
    if (comment === "") { return };

    try {
      const response = await fetch(`${APIURL}blogpost/${id}/comment/${commentToBeModified._id}`, {
        method: "PUT",
        headers: {
          "Authorization": localStorage.getItem("token"),
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      }
      );

      // gestire la risposta
      if (!response.ok) {
        document.getElementById("faild-comment").classList.remove("d-none");
        setTimeout(() => {
          document.getElementById("faild-comment").classList.add("d-none");
        }, 5000)
        throw new Error("Error");
      } else {
        setComment("");
        // rifare la fetch per caricare il commento appena inviato
        downloadComments();
        //nascondere l'input della modifica
        setShowInputModify(false);
      };

    } catch (err) {
      console.log(err);
    };
  };


  return (
    <div>
      <InputGroup className="mb-3">
        {!commentToBeModified &&
          <>
            <Form.Control
              placeholder="Aggiungi il tuo commento..."
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <Button variant="primary" id="button-addon2" onClick={sendNewComment}>
              Invia
            </Button>
          </>
        }
        {commentToBeModified &&
          <>
            <Form.Control
              placeholder="Modifica qua il tuo commento..."
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <Button variant="primary" id="button-addon2" onClick={modifyComment}>
              Modifica
            </Button>

          </>
        }
      </InputGroup>
      <Alert className="d-none" id="faild-comment" variant="danger">Qualcosa è andata storta!</Alert>
    </div>
  )
}
