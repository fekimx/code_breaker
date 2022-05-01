import React, { useState } from "react";
import NavHeader from "../components/navbar/NavHeader";
import Footer from "../components/Footer";

function Terms() {
  
return (
    <div className="h-screen flex bg-gray-bg1">
            <NavHeader user="None" title="" />

    <div className="pad">
    <div className="container">

        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Terms and Conditions
        </h1>
        <h2 className="text-2xl font-medium text-secondary mt-4 mb-12 text-center">
            Last updated April 4, 2022
            <p>
                    BY CLICKING THE REGISTER BOX AND CREATING AN ACCOUNT, THE USER INDICATES ACCEPTANCE AND AGREES TO THESE TERMS. IF THE INDIVIDUAL ACCEPTING THESE TERMS DOES NOT AGREE WITH THESE TERMS, SUCH INDIVIDUAL MUST NOT ACCEPT THESE TERMS AND MAY NOT USE THE PLATFORM.
                </p>
                <p>1. PLATFORM.
                        Subject to the terms and conditions of these Terms, Code-Breaker.io grants you during the Term (defined below) a limited, non-exclusive, non-transferable, non-sublicenseable right to access and use the software platform.
                    </p>
                        <p>2. RESTRICTIONS.
                                The rights granted to you in these Terms are subject to the following restrictions: (a) you may not license, sell, rent, lease, transfer, assign, distribute, host, or otherwise commercially exploit the Platform, whether in whole or in part, or any content displayed on the Platform; (b) you may not modify, make derivative works of, disassemble, reverse compile or reverse engineer any part of the Platform; and (c) except as expressly stated herein, no part of the Platform may be copied, reproduced, distributed, republished, downloaded, displayed, posted or transmitted in any form or by any means.  Unless otherwise indicated, any future release, update, or other addition to functionality of the Platform is subject to these Terms.  Unless otherwise specified on the Platform, all copyright and other proprietary notices on the Platform (or on any content displayed on the Platform) must be retained on all copies thereof.
                                </p>
                                <p>3. ACCOUNTS.
                                        i. Registration. In order to use certain features of the Platform, you must register for an account (“Account”) and provide certain information about yourself as prompted by the account registration form.  You represent and warrant that: (i) all required registration information you submit is truthful and accurate; (ii) you will maintain the accuracy of such information. You may delete your Account at any time, for any reason.
                                        ii. Responsibilities. You are responsible for maintaining the confidentiality of your Account login information and are fully responsible for all activities that occur under your Account.  You agree to immediately notify the platform of any unauthorized use, or suspected unauthorized use of your Account or any other breach of security.  Code-breaker.io cannot and will not be liable for any loss or damage arising from your failure to comply with the above requirements.
                                    </p>
                                    </h2>
      </div>
    </div><Footer/>  
    </div>
  );
}

export default Terms;