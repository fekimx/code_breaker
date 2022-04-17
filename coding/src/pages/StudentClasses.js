import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import useSWR from 'swr';
import {fetcher} from "../utils/axios";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import axiosService from "../utils/axios";

class StudentClasses extends React.Component {

  
  constructor(props) {
      super(props);

      this.state={
        
        classes: []
      }
      //this.divRef = React.createRef();
  }


  componentDidMount = () => {
    //when we have a way to get the user id, replace the 1 with that userId variable
    fetch(`/api/studentClass/1/`)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          classes: result
        });
      //const listItems = response.data.map((d) => console.log("ok", d.name))
      //this.setState({ classes: data });
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
  render = () => {
  
    const listItems = this.state.classes.map((d) => <li key={d.name}>{d.name}</li>);

    return (
      <div className="h-screen flex bg-gray-bg1">
        <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
            List of All Classes
          </h1>
          <div>
          {listItems }
          </div>
        </div>
      </div>
    );
  }
};

export default StudentClasses;

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