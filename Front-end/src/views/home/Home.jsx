import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";
import { useParams } from "react-router-dom";

const Home = props => {
  // Call useParams inside the functional component
  const { accesstoken } = useParams();

  useEffect(() => {
    // Use the access token obtained from useParams here
    if (accesstoken) {
      localStorage.setItem("token", accesstoken);
    }
  }, [accesstoken]);


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
