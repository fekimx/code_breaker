import '../App.css';
import React from 'react';
import { useNavigate } from "react-router";
import Navbar from "../components/navbar/Navbar";
  
const About = () => {
  const history = useNavigate();
  
  return (
    <div>
      <Navbar/>
      <h1>About code-breaker</h1>
      <p>code-breaker is the easiest way for high school computer science teachers to assign asynchronous after-school assignments.</p>
      <p>By leveraging the existing content, teachers can quickly spin up lesson plans to augment in-class instruction...</p>
      <p>but the system is also flexible enough to allow changes to the questions or auto-grading unit-tests.</p>
    </div>
  );
};
  
export default About;