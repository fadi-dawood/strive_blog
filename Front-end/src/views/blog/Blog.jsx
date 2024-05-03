import React, { useContext, useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import { URLSContext } from "../../ContextProvider/URLContextProvider";
import "./styles.css";
import BlogComments from "../../components/comments/blog-comments/BlogComments";
import NewComment from "../../components/comments/new-comment/NewComment";



const Blog = props => {
  // i variabili del dataform:
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const [authorId, setAuthorId] = useState();

  // URL context provider
  const { APIURL } = useContext(URLSContext);


  // l'id del post
  const { id } = params;

  // chiamata fetch 
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

      console.log( blogData)

      setBlog(blogData);
      setLoading(false);
    } catch (err) {
      console.error('There was a problem with your fetch operation:', err);
      setLoading(false);
      navigate("/404");
    }
  }

  // avviare la fetch al caricamento della pagina
  useEffect(() => {
    fetchData();
  }, []);

  // rifare la fetch per aggiornare i commenti
  function downloadComments() {
    fetchData();
  };


  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={blog.cover} fluid />
          <h1 className="blog-details-title">{blog.title}</h1>


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


          <div className="my-5">
            <h3>Comments:</h3>
            {blog.comments.map((comment, i) => (
              <BlogComments key={i} comment={comment} downloadComments={downloadComments} />
            ))}
          </div>


          <div>
            <h4>Aggiungi un commento:</h4>
            <NewComment downloadComments={downloadComments}></NewComment>
          </div>
        </Container>

      </div>
    );
  }
};

export default Blog;
