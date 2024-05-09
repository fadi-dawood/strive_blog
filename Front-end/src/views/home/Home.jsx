import React from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";

const Home = props => {
  return (
    <Container fluid="sm" >
      {!localStorage.getItem("token") &&
        <>
          <h1 className="blog-main-title mb-3 text-center">Benvenuto sullo Strive Blog!</h1>
          <h2 className="blog-main-title mb-3 text-center">Efettua il login per mostrare il contenuto del sito!</h2>
        </>
      }
      {localStorage.getItem("token") &&
        <h2 className="blog-main-title mb-5 ">Tutti i Blog:</h2>
      }
      <BlogList />
    </Container>
  );
};

export default Home;
