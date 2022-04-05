import '../App.css';
import React from 'react';
import { useNavigate } from "react-router";
import Navbar from "../components/navbar/Navbar";

const Contact = () => {
  const history = useNavigate();

  return (

  <div className="h-screen flex bg-gray-bg1">
    <Navbar/>
<div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10vh'
      }}
    >
      <h1>Contact Us</h1>

    </div><div className="page-body">
      <h2>About code-breaker.io</h2>
      <p>We would love to hear from you!  Please send all comments/questions to <a href="mailto:project.codebreaker@gmail.com">project.codebreaker@gmail.com</a>.</p>

    </div>
    </div>
  );
};


export default Contact; 