import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import NavHeader from "../components/navbar/NavHeader";

function Legal() {
  
return (
    <div className="h-screen flex bg-gray-bg1"> <NavHeader user="None" title="" />
    <div className="termspad">
    <div className="termscontainer" >
    <h1  className="text-2xl font-medium text-primary mt-4 mb-12 text-left">
           Privacy Policy
          <p className="text-2xl font-medium text-secondary mt-4 mb-12 text-left">
          <p>Privacy<br></br>
            We will not sell any of your personal information.
                    </p>
         <p>Security<br></br>
         We strive to keep your personal information safe.
                    </p>
          <p>Cost<br></br>
                Our site is currently free to use with no monetization incentives. We do not display advertising. Our mission is to provide you with a world class education, not to sell you products.
                    </p>
                    <p>Email<br></br>
                We will not send you spam nor sell your email information.
                    </p>
                    <p>Do we use Cookies? <br></br>
                        Currently, no.
                    </p>    
                    </p>                 
        </h1>
        <h2 className="text-2xl font-medium text-primary mt-4 mb-12 text-left">
          Children's Privacy Policy
          <p className="text-2xl font-medium text-secondary mt-4 mb-12 text-left">
          <p>Use Case<br></br>
            Our website is not meant to be used outside of the United States. It is intended to be a learning aid for high school teachers and students.
                    </p>
         <p>Age<br></br>
         To comply with COPPA regulation, users may not use our website if under the age of 13. 
         Teachers must acquire parental permission before giving students their class codes which allow them to participate on the site. 
                    </p>
          <p>What Information is Collected?<br></br>
                When users create an account, their email address and full names are collected for future logins. This data is not shared to any third parties for sale.
                    </p>
                    <p>Account Choices<br></br>
                    Teachers, users and parents may request deletion of an account and information at any time by emailing code-breaker.io through our contact page.
                    </p>
                    <p>Reason Steps of Parental Verification<br></br>
                        Teachers can't distribute class codes to potential student users unless they gain their student's parental consent.
                        The website is designed for only high school students at least 16 years old or higher.
                        Student accounts for use in school settings can only be created with consent of a teacher.
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
        <h5 className="text-2xl font-medium text-primary mt-4 mb-12 text-left">
          Specific Laws
          <p className="text-2xl font-medium text-secondary mt-4 mb-12 text-left">
          <p>California Online Privacy Protection Act <br></br>
                    According to CalOPPA: users can visit our site anonymously; we link to this Privacy Policy on the home page; and our Privacy Policy link, and can be easily be found on the home page.
                        Users will be notified of any privacy policy changes on this Privacy Policy Page. Users are able to change their personal information by emailing us.
                    </p>
                    <p>FERPA <br></br>
                    Our collection, use, and disclosure of student data is governed by this privacy policy, any other agreement with an educational agency, the provisions of the Family Educational Rights and Privacy Act (FERPA), COPPA, and applicable state laws which relate to the collection of student data. See the rest of this privacy policy for other details on the limited ways in which we handle student data.</p>
                    </p>
                    <p>AB 1584<br></br>
                    Our site is compliant with AB 1584.  Students may retain possession and control of their own content by editing or deleting their content from our servers by emailing code-breaker.io.  Third parties will not have access to any personally identifiable information in the student's record for any purpose. Parents, legal guardians, and eligible pupils may review their information and request corrections to erroneous information by emailing us.
                    Our site will not use pupil records to engage in targeted advertising.
                    In the event of an unauthorized disclosure of a pupil's records, we shall report to an affected parent, legal guardian, or teacher via email. 
                    </p>
                    <p>Fair Information Practices <br></br>
                    The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information. In order to be in line with Fair Information Practices, should a data breach occur, we will notify the affected users via email within 7 business days (or within 72 hours for certain categories of breach). 
                    We also agree to the individual redress principle, which requires that individuals have a right to pursue legally enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights against data users, but also that individuals have recourse to courts or a government agency to investigate and/or prosecute non-compliance by data processors.
                    </p>
        </h5>
      </div>
    </div>
    <Footer/>  
    </div>
  );
}

export default Legal;