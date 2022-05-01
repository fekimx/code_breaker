import '../App.css';
import React, { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/navbar/Navbar";
import NavHeader from "../components/navbar/NavHeader";
import Footer from "../components/Footer";

const PageNotFound= () =>{
    const history = useNavigate();

return ( <div className="h-screen flex bg-gray-bg1">
<NavHeader user="None" title="/"
 />
<div className="pad">
<div class="container">
        <h1>404 Error</h1>
        <h1>Page Not Found</h1>
        <p>We are sorry but the page you are looking for does not exist.</p>
   
        </div>
    </div><Footer/>  
    </div>
);
};

export default PageNotFound;