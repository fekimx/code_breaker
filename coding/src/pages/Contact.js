
import React from 'react';
import { useNavigate } from "react-router";
  
const ContactUs = () => {
  const history = useNavigate();
  
  return (
  <>
     <!-- start of nav bar -->
     <button onClick={()=>history("/")}>Return to Dashboard</button>
     <button onClick={()=>history("/about")}>About</button>
     <button onClick={()=>history("/contact")}>Contact Us</button>
     <button onClick={()=>history("/class")}>Class</button>
     <button onClick={()=>history("/solution")}>Solution</button>
     <button onClick={()=>history("/unittest")}>UnitTest</button>
     <button onClick={()=>history("/about")}>About</button>
     <button onClick={()=>history("/question")}>Peep some questions!</button>
     <!-- end of nav bar -->
     <h1 style={{color:"green"}}>Contact Us</h1>
<script type="text/javascript">
(function(d, t){
   var g = d.createElement(t),
       s = d.getElementsByTagName(t)[0];
   g.src = "http://www.foxyform.com/js.php?id=977499&sec_hash=2850f2fd18d&width=350px";
   s.parentNode.insertBefore(g, s);
}(document, "script"));
</script>

  </>
  )
};
  
export default ContactUs;