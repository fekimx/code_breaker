import React from "react";
import Navbar from "../components/navbar/Navbar";
import "../App.css"
import Hero from "../components/Hero";
import Footer from "../components/Footer";
function Homepage() {

  return (
      <div>
          <Navbar/>
          <Hero/>
          <Footer/>
      </div>
  );
}

export default Homepage;