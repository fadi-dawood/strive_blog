import React, { useEffect, useState } from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./styles.css";
import Nav from 'react-bootstrap/Nav';
import { useContext } from "react";
import { URLSContext } from "../../ContextProvider/URLContextProvider";
import NavDropdown from 'react-bootstrap/NavDropdown';


const NavBar = props => {

  const { APIURL } = useContext(URLSContext);
  const [user, setUser] = useState("");

  async function getLoggedUser() {
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

  useEffect(() => {
    getLoggedUser();
  }, []);

  function logOutBtn() {
    localStorage.removeItem("token");
    // go to home page
    const origin = window.location.origin;
    const modifyUrl = `${origin}/`;
    window.location.href = modifyUrl;
  };


  function goToLoginPage() {
    const origin = window.location.origin;
    const modifyUrl = `${origin}/log/login`;
    window.location.href = modifyUrl;
  }

  function goToProfilePage() {
    const origin = window.location.origin;
    const modifyUrl = `${origin}/myprofile`;
    window.location.href = modifyUrl;
  }

  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between align-items-center">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>


        {!localStorage.getItem("token") &&
          <Nav.Link onClick={goToLoginPage} >Log-in</Nav.Link>
        }
        {localStorage.getItem("token") &&
          <div className="d-flex gap-4 align-items-center">
            <Nav.Link onClick={goToProfilePage} className="d-flex gap-2 align-items-center">
              <img className="img-profile" src={`${user.avatar}`} alt="profilo" />
              <p className="m-0 p-0">{`${user.name} ${user.lastName}`}</p>
            </Nav.Link>
            <NavDropdown align={{ lg: 'end' }} title="" id="dropdown-menu-align-responsive-1">
              <NavDropdown.Item onClick={goToProfilePage}>Your profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logOutBtn}>Log-Out</NavDropdown.Item>
            </NavDropdown>
          </div>
        }
      </Container>
    </Navbar>
  );
};

export default NavBar;
