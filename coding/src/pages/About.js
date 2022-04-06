import '../App.css';
import React from 'react';
import { useNavigate } from "react-router";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
const About = () => {
  const history = useNavigate();
  
  return (
  <div className="h-screen flex bg-gray-bg1">
    <Navbar/>
    <div className="page-body">
      <h1>About code-breaker.io</h1>
      <h2>Origin</h2>
      <p>Code-breaker.io began as a capstone project for a group of graduating students pursuing their Software Engineering MS in 2022.  Seeing a need for a turnkey educational aid to teach high school students the basics in computer programming, these six members valiantly charged forward in the creation of code-breaker to fill this need.</p>
      <p>As soon as a teacher signs up, they have access to all existing questions on the platform.  They are able to pull those groups of questions and turn them into lessons immediately, or they can modify them to better fit their vision.  For example, if there’s an existing set of questions revolving around recursion, but the teacher wants to break it into two lessons.  Coupled with the goal of a one-minute signup process for students, the ease of getting started on the platform is an attractive alternative to existing solutions.</p>
      <p>In addition to keeping the process easy for the teacher, a goal was to make it exciting for students.  Our competitive mode lets the teacher start a group-wide multiple-choice challenge for their entire class.  Each student will face the same questions and battle their peers for the highest ranking on the leaderboard.  Teachers derive value from this addition through content reinforcement of the quiz and the ability to monitor progress.</p>
      <h2>Roadmap</h2>
      <p>The goal of code-breaker is to set the standard for teacher usability and student engagement, targeting high school computer science classrooms.</p>
      <p>As of April 2022, code-breaker supports instruction in the <a href="https://www.python.org">python</a> programming language.  Code execution and testing is done via remote fetch, so an active web connection is required.</p>
      <p>Future updates include adding more lessons/questions, additional programming language support, and enhancing the usability of the competition mode.</p>
    </div>
    <Footer/>  
  </div>
  );
};
  
export default About;