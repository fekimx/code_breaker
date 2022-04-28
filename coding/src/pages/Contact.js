import '../App.css';
import React from 'react';
import { useNavigate } from "react-router";
import NavHeader from "../components/navbar/NavHeader";
import Footer from "../components/Footer";

const Contact = () => {
  const history = useNavigate();

  return (
    <div className="single-column">
    <NavHeader user="None" title="Contact" />

    <div class="container">

      <h1>Contact Us</h1>

    <div className="page-body">
      <h2>Contact code-breaker.io</h2>
      <p>We would love to hear from you!  Please send all comments/questions to <a href="mailto:project.codebreaker@gmail.com">project.codebreaker@gmail.com</a>.</p>

    </div>
    </div>
    <Footer/>  
    </div>
  );
};


export default Contact; 