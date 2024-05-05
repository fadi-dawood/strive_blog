import React, { useContext, useEffect, useState } from "react";
import { Container, Image, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import { URLSContext } from "../../ContextProvider/URLContextProvider";
import "./styles.css";
import BlogComments from "../../components/comments/blog-comments/BlogComments";
import NewComment from "../../components/comments/new-comment/NewComment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';



const Blog = props => {
  //^ i variabili del dataform:
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const [authorId, setAuthorId] = useState();

  //^ URL context provider
  const { APIURL } = useContext(URLSContext);

  //^ l'id del post
  const { id } = params;

  //^ chiamata fetch per ottenere il blog
  const fetchData = async () => {
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

      const blogData = await response.json();

      // aggiornare l'id del creattore del blog per confrontarlo dopo con l'id di ogni commento
      setAuthorId(blogData.author.author_id);

      console.log(blogData)

      setBlog(blogData);
      setLoading(false);
    } catch (err) {
      console.error('There was a problem with your fetch operation:', err);
      setLoading(false);
      navigate("/404");
    }
  }

  //^ avviare la fetch al caricamento della pagina
  useEffect(() => {
    fetchData();
  }, []);

  //^ rifare la fetch per aggiornare i commenti una volta agiiunto un nuovo commento
  function downloadComments() {
    fetchData();
  };

  //^ Rindirizza to the pagina per modificare il post
  function goToModifyPost() {
    const origin = window.location.origin;
    const modifyUrl = `${origin}/blogpost/${id}/modify`;
    window.location.href = modifyUrl;
  }


  //^ cancella il post
  async function deletePost() {
    try {
      const response = await fetch(`${APIURL}blogPost/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });

      // se le risposta del server è negativa
      if (!response.ok) {
        throw new Error("Error")
      }

      navigate(`/home`)
    } catch (err) {
      console.error('There was a problem with your fetch operation:', err);

    }
  };




  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={blog.cover} fluid />
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="blog-details-title">{blog.title}</h1>
            <div>
              <Button variant="outline-secondary" className='mx-2' onClick={goToModifyPost}>
                <FontAwesomeIcon icon={faPencil} />
                <span className="ms-2">Modifica Blog</span>
              </Button>
              <Button variant="outline-danger" className='mx-2' onClick={deletePost}>
                <FontAwesomeIcon icon={faTrash} />
                <span className="ms-2">Delete Blog</span>
              </Button>
            </div>
          </div>


          <div className="blog-details-container">
            <div className="blog-details-author">
              <BlogAuthor {...blog.author} />
            </div>
            <div className="blog-details-info">
              <div>{blog.createdAt}</div>
              <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>
            </div>
          </div>


          <div
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          ></div>

          <hr className="my-5 py-5" />

          <div className="my-5">
            <h3>Tutti i commenti:</h3>
            {blog.comments.map((comment, i) => (
              <BlogComments key={i} comment={comment} downloadComments={downloadComments} />
            ))}
          </div>

          <hr className="my-5 py-5" />

          <div lassName="my-5">
            <h4>Aggiungi un commento:</h4>
            <NewComment downloadComments={downloadComments}></NewComment>
          </div>
        </Container>

      </div>
    );
  }
};

export default Blog;
