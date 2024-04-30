import React, { useCallback, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./styles.css";
import { convertToRaw } from "draft-js"
import draftToHtml from "draftjs-to-html"



const NewBlogPost = props => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [durata, setDurata] = useState("");
  const [durataUnita, setDurataUnita] = useState("");
  // const [image, setImage] = useState(null);

  const handleChange = useCallback(value => {
    setText(draftToHtml(value));
    // console.log(convertToRaw(value.getCurrentContent()))
  });

  // const handleImageChange = event => {
  //   const file = event.target.files[0];
  //   setImage(file);
  // };

  const handleSubmit = async event => {

    event.preventDefault();

    const formData = {
      title: title,
      category: category,
      content: text,
      readTime: {
        value: durata,
        unit: durataUnita
      }
    };

    // const formData = new FormData();
    // formData.append("title", title);
    // formData.append("category", category);
    // formData.append("content", text);
    // formData.append("readTime[value]", durata);
    // formData.append("readTime[unit]", durataUnita);
    // formData.append("image", image);


    // contollare che tutto il form è stato compilato
    if (!title || !category || !text || !durata || !durataUnita) {
      let labels = document.getElementsByTagName("label");
      console.log(labels);
      Array.from(labels).forEach(label => {
        if (!label.classList.contains("txt-red")) {
          label.classList.add("txt-red");
        }
      });
      return;
    };

    try {
      const response = await fetch('http://localhost:3001/blogPost/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle successful response
      console.log('Blog post submitted successfully!');
      // Optionally, redirect or perform other actions upon success
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }


  };

  //resettare il form
  function resetForm() {
    let labels = document.getElementsByTagName("label");
    Array.from(labels).forEach(label => {
      label.classList.remove("txt-red");
    });
  };


  return (
    <Container className="new-blog-container">
      <Form className="mt-5">


        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo*</Form.Label>
          <Form.Control size="lg" placeholder="Title" onChange={e => setTitle(e.target.value)} />
        </Form.Group>


        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria*</Form.Label>
          <Form.Control size="lg" as="select" onChange={e => setCategory(e.target.value)} >
            <option value="" defaultChecked>Seleziona una categoria</option>
            <option value="Cucina" >Cucina</option>
            <option value="Sport" >Sport</option>
            <option value="Lettura" >Lettura</option>
            <option value="Film" >Film</option>
            <option value="Altro" >Altro</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Durata lettura*</Form.Label>
          <div className="d-flex gap-5">
            <Form.Control size="lg" placeholder="durata lettura" type="number" min={1} onChange={e => (setDurata(e.target.value))} />
            <Form.Control size="lg" as="select" onChange={e => (setDurataUnita(e.target.value))}>
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
        {/* <Form.Group controlId="blog-image" className="mt-3">
          <Form.Label>Carica immagine</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group> */}

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
        </Form.Group>

      </Form>
    </Container>
  );
};

export default NewBlogPost;
