import React from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import LogIn from "./views/login/LogIn";
import NewBlogPost from "./views/new/New";
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./views/Register/Register";
import URLSContextProvider from "./ContextProvider/URLContextProvider";
import MyProfile from "./views/Profile/Profile";

function App() {
  return (
    <>
      <URLSContextProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/log/login" exact element={<LogIn />} />
            <Route path="/log/Register" exact element={<Register />} />
            <Route path="/blogpost/:id/modify" element={<NewBlogPost />} />
            <Route path="/blogpost/:id" element={<Blog />} />
            <Route path="/new" element={<NewBlogPost />} />
            <Route path="/myprofile" element={<MyProfile />} />
          </Routes>
          <Footer />
        </Router>
      </URLSContextProvider>
    </>
  );
}

export default App;
