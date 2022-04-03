import React from "react";
import Navbar from "../components/navbar/Navbar";
import "../App.css"
import Hero from "../components/Hero";

function Homepage() {

  return (
      <div>
          <Navbar/>
          <Hero/>
      </div>
  );
}

export default Homepage;