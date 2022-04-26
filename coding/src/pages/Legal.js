import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";

function Legal() {
  
return (
    <div className="h-screen flex bg-gray-bg1"> <Navbar/>
    <div className="termspad">
    <div class="termscontainer" >
    <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-left">
          Legal Notice
          <p className="text-2xl font-small text-secondary mt-4 mb-12 text-left">
            Last updated April 26, 2022
            </p>
        </h1>
        <h2 className="text-2xl font-medium text-primary mt-4 mb-12 text-left">
          Privacy Policy
          <p className="text-2xl font-medium text-secondary mt-4 mb-12 text-left">
          <p>Privacy<br></br>
            We will not sell any of your personal information.
                    </p>
         <p>Security<br></br>
         We strive to keep your personal information safe.
                    </p>
          <p>Cost<br></br>
                Our site is currently free to use with no monetization incentives.
                    </p>
                    <p>Email<br></br>
                We will not send you spam nor sell your email information.
                    </p>
                    <p>Do we use Cookies? <br></br>
                        Currently, no.
                    </p>
                    </p>
        </h2>
        <h3 className="text-2xl font-medium text-primary mt-4 mb-12 text-left">
          Copyright and Licensing
          <p className="text-2xl font-medium text-secondary mt-4 mb-12 text-left">
                    <p>Client-Side Code <br></br>
                    All client-side code for code-breaker.io is in a GitHub repository and database.
                    </p>
                     </p>
        </h3>
        <h4 className="text-2xl font-medium text-primary mt-4 mb-12 text-left">
          Third Party Disclosure
          <p className="text-2xl font-medium text-secondary mt-4 mb-12 text-left">
                    <p>Code-breaker.io currently uses the following third parties: <br></br>
                    <a href="https://dashboard.heroku.com"> Heroku</a>
                    </p>
                     </p>
        </h4>
      </div>
    </div>
    <Footer/>  
    </div>
  );
}

export default Legal;