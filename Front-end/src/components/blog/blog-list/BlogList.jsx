import { React, useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";


const BlogList = props => {

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/blogPost/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        });
        //console.log(`Bearer ${localStorage.getItem("token")}`)
        if (!response.ok) {
          throw new Error("Error")
        }

        const blogsData = await response.json();
        setBlogs(blogsData);

      } catch (err) {
        console.error('There was a problem with your fetch operation:', err);
      }
    }

    fetchData();
  }, []);




  return (
    <Row>
      {blogs.map((blog, i) => (
        <Col
          key={`item-${i}`}
          md={4}
          style={{
            marginBottom: 50,
          }}
        >
          <BlogItem key={blogs.title} {...blog} />
        </Col>
      ))}
    </Row>
  );
};

export default BlogList;
