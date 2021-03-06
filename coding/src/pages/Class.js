
import React from "react";
import axiosService from "../utils/axios";

class Class extends React.Component {
  constructor(props) {
      super(props);
    
    this.divRef = React.createRef();
    this.state = {
      code: "def divisbleByTwo(n):\n",
      unit_test_1_background: "none",
      unit_test_2_background: "none",
      stderr: ""
    }
  }

  tryPost() {
    console.log("Post Request ");
    axiosService.post(`/api/class/`,    {

      //This is just an example
      id: 5,
      name: "TestClass1",
      secretKey: "001",
      active: true,
      TAs: [],
      students: []

  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  }

  tryGetAll() {
    console.log("Get request: ");
    axiosService.get(`/api/class/`,    {
    //ClassViewset currently just gets all the classes
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  }

  tryGet() {
    console.log("Get request: ");
    axiosService.get(`/api/class/5/`,    {
    //ClassViewset gets a specific class classes
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  }

  tryDelete() {
    console.log("Get request: ");
    axiosService.delete(`/api/class/5/`,    {
    //ClassViewset gets a specific class classes
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  }

  
  
  render() {
    return (
    <div>
      <div style={{backgroundColor: this.state.unit_test_1_background}}>Look in Class.js for examples to use the api // look in viewsets.py ClassViewSet for more info</div>
      <button onClick={ () => this.tryPost() }>Post</button>
      <button onClick={ () => this.tryGetAll() }>Get All</button>
      <button onClick={ () => this.tryGet() }>Retrieve specific</button>
      <button onClick={ () => this.tryDelete() }>Delete specific</button>
      
      <div style={{backgroundColor: this.state.unit_test_1_background}}>Here's buttons that make requests</div>
      <div style={{backgroundColor: "red"}}>
        {this.state.stderr}
      </div>
    </div>
    )
  }
};

export default Class;

function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();

          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

              break;
          }
      }
  }

  return cookieValue;
}