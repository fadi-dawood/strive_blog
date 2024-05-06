import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./styles.css";
import draftToHtml from "draftjs-to-html"
import { useParams } from "react-router-dom";
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { convertFromRaw, convertToRaw } from 'draft-js';
import { URLSContext } from "../../ContextProvider/URLContextProvider";



function NewBlogPost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [durata, setDurata] = useState("");
  const [durataUnit, setdurataUnit] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const { APIURL } = useContext(URLSContext);

  // l'id del post nel caso di voler modificare un post specifico
  const { id } = useParams();

  const handleChange = useCallback(value => {
    setText(draftToHtml(value));
    // console.log(convertToRaw(value.getCurrentContent()))
  });

  const handleImageChange = event => {
    const file = event.target.files[0];
    setImage(file);
  };


  //^modifica un post esistente (precompilazione form con i vecchi dati)
  async function preCompilationForm() {
    try {
      const response = await fetch(`${APIURL}blogPost/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });

      // se le risposta del server è negativa
      if (!response.ok) {
        throw new Error("Error")
      }

      // aggiornare il modulo nel frontend
      const blogData = await response.json();
      setTitle(blogData.title || "");
      setCategory(blogData.category || "");
      setDurata(blogData.readTime.value || "");
      setdurataUnit(blogData.readTime.unit || "");
      //!non funziona
      setText(blogData.content || "");
    } catch (err) {
      console.error('There was a problem with your fetch operation:', err);
    }

  };


  //^modifica un post esistente (avviare la funzione per la precompilazione del form)
  useEffect(() => {
    if (id) {
      preCompilationForm();
    }
  }, []);

  //^modifica un post esistente (chiamata put per l'aggornamento del blog)
  async function sendModifiedBlog() {
    console.log("ciao");


    // contollare che tutto il form è stato compilato
    if (!title || !category || !text || !durata || !durataUnit) {
      let labels = document.getElementsByTagName("label");
      Array.from(labels).forEach(label => {
        if (!label.classList.contains("txt-red")) {
          label.classList.add("txt-red");
        }
      });
      return;
    };

    // preparare il payload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", text);
    formData.append("readTime[value]", durata);
    formData.append("readTime[unit]", durataUnit);
    formData.append("cover", image);

    try {
      const response = await fetch(`${APIURL}blogPost/${id}/modify`, {
        method: 'put',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`

        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      };

      console.log('Blog post submitted successfully!');

    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    };


  };




  //^ Mandare un nuovo post:
  const handleSubmit = async event => {
    console.log("ciao");
    event.preventDefault();

    // contollare che tutto il form è stato compilato
    if (!title || !category || !text || !durata || !durataUnit) {
      let labels = document.getElementsByTagName("label");
      console.log(labels);
      Array.from(labels).forEach(label => {
        if (!label.classList.contains("txt-red")) {
          label.classList.add("txt-red");
        }
      });
      return;
    };

    // preparare il payload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", text);
    formData.append("readTime[value]", durata);
    formData.append("readTime[unit]", durataUnit);
    formData.append("cover", image);



    try {
      const response = await fetch('http://localhost:3001/blogPost/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Blog post submitted successfully!');

    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }


  };

  //^ resettare il form
  function resetForm() {
    let labels = document.getElementsByTagName("label");
    Array.from(labels).forEach(label => {
      label.classList.remove("txt-red");
    });
  };

  if (!localStorage.getItem("token")) { return null; }
  else {
    return (
      <Container className="new-blog-container">
        <Form className="mt-5">


          <Form.Group controlId="blog-form" className="mt-3">
            <Form.Label>Titolo*</Form.Label>
            <Form.Control value={title} size="lg" placeholder="Title" onChange={e => setTitle(e.target.value)} />
          </Form.Group>


          <Form.Group controlId="blog-category" className="mt-3">
            <Form.Label>Categoria*</Form.Label>
            <Form.Control value={category} size="lg" as="select" onChange={e => setCategory(e.target.value)} >
              <option value="" defaultChecked>Seleziona una categoria</option>
              <option value="Cucina" >Cucina</option>
              <option value="Sport" >Sport</option>
              <option value="Lettura" >Lettura</option>
              <option value="Film" >Film</option>
              <option value="Film" >Cultura e Lingue</option>
              <option value="Altro" >Altro</option>
            </Form.Control>
          </Form.Group>s

          <Form.Group>
            <Form.Label>Durata lettura*</Form.Label>
            <div className="d-flex gap-5">
              <Form.Control value={durata} size="lg" placeholder="durata lettura" type="number" min={1} onChange={e => (setDurata(e.target.value))} />
              <Form.Control value={durataUnit} size="lg" as="select" onChange={e => (setdurataUnit(e.target.value))}>
                <option value="" defaultChecked>Seleziona Unità</option>
                <option value="minuto" >minuto</option>
                <option value="ora" >ora</option>
              </Form.Control>
            </div>
          </Form.Group>

          <Form.Group controlId="blog-content" className="mt-3">
            <Form.Label>Contenuto Blog*</Form.Label>
            <Editor value={text} onChange={handleChange} className="new-blog-content" />
          </Form.Group>

          {/* per il caricamento delle foto */}
          <Form.Group controlId="blog-image" className="mt-3">
            <Form.Label>Carica immagine</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
          </Form.Group>

          <Form.Group className="d-flex mt-3 justify-content-end">
            <Button type="reset" size="lg" variant="outline-dark" onClick={resetForm}>
              Reset
            </Button>

            <Button
              type="submit"
              size="lg"
              variant="dark"
              style={{
                marginLeft: "1em",
              }}
              onClick={handleSubmit}
            >
              Invia
            </Button>
            <Button
              type="button"
              size="lg"
              variant="dark"
              style={{
                marginLeft: "1em",
              }}
              onClick={sendModifiedBlog}
            >
              Modifica
            </Button>
          </Form.Group>

        </Form>
      </Container>
    );
  }


};

export default NewBlogPost;
