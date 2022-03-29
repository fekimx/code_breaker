
import React from 'react';
import { useNavigate } from "react-router";
  
const About = () => {
  const history = useNavigate();
  
  return (
  <>
     <button onClick={()=>history("/")}>Return to Dashboard</button>
     <button onClick={()=>history("/about")}>About</button>
     <button onClick={()=>history("/contact")}>Contact Us</button>
     <button onClick={()=>history("/class")}>Class</button>
     <button onClick={()=>history("/solution")}>Solution</button>
     <button onClick={()=>history("/unittest")}>UnitTest</button>
     <button onClick={()=>history("/question")}>Peep some questions!</button>
     <h1 style={{color:"green"}}>What is code-breaker?</h1>
     <p><b>code-breaker</b> is the easiest way for high school computer science teachers to assign asynchronous after-school assignments.  By leveraging the existing content, teachers can quickly spin up lesson plans to augment in-class instruction... but the system is also flexible enough to allow changes to the questions or auto-grading unit-tests.</p>
     

  </>
  )
};
  
export default About;