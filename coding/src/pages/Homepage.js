import React from "react";
import NavHeader from "../components/navbar/NavHeader";
import "../App.css"
import Hero from "../components/Hero";
import Footer from "../components/Footer";
function Homepage() {

  return (
      <div>
          <NavHeader user="None" title="Code-Breaker" />
          <Hero/>
          <Footer/>
      </div>
  );
}

export default Homepage;