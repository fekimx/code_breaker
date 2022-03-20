
import React from 'react';
import { useNavigate } from "react-router";
  
const Class = () => {
  const history = useNavigate();
  
  return (
  <>
     <h1 style={{color:"green"}}>Here is where we'll have Classes!</h1>
     <button onClick={()=>history("/")}>Return to Dashboard</button>
     <button onClick={()=>history("/about")}>About</button>
     <button onClick={()=>history("/class")}>Class</button>
     <button onClick={()=>history("/solution")}>Solution</button>
     <button onClick={()=>history("/unittest")}>UnitTest</button>
     <button onClick={()=>history("/about")}>About</button>
     <button onClick={()=>history("/question")}>Peep some questions!</button>
  </>
  )
};
  
export default Class;