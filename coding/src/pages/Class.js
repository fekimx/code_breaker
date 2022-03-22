
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import useSWR from 'swr';
import {fetcher} from "../utils/axios";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import axios from "axios";

class Class extends React.Component {
  constructor(props) {
      super(props);

    //   this.account = useSelector((state) => state.auth.account);
    //   const dispatch = useDispatch();
    //   const history = useNavigate();
    
    //   const userId = account?.id;
    
    //   const user = useSWR(`/api/user/${userId}/`, fetcher)
    
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
    axios.post(`/api/class/`,    {

      //This is just an example
      id: 3,
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

  tryGet() {
    console.log("Get request: ");
    axios.get(`/api/class/`,    {
    //ClassViewset currently just gets all the classes
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
      <div style={{backgroundColor: this.state.unit_test_1_background}}>Look in Class.js for examples to use the api // look in viewsets.py > ClassViewSet for more info</div>
      <button onClick={ () => this.tryPost() }>Post</button>
      <button onClick={ () => this.tryGet() }>Get</button>
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