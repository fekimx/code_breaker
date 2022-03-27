
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
     <button onClick={()=>history("/about")}>About</button>
     <button onClick={()=>history("/question")}>Peep some questions!</button>
     <h1 style={{color:"green"}}>This is an admin only page to create teachers</h1>
     <p><b>code-breaker</b>If you got here, you must have an admin account</p>
     

  </>
  )
};
  
export default About;