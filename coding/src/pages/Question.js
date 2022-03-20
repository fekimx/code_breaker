
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import useSWR from 'swr';
import {fetcher} from "../utils/axios";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import axios from "axios";

class Question extends React.Component {
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

  runCode() {
    console.log("Running codes: ", this.state.code);
    axios.post(`/api/run/`, { code: this.state.code })
    .then((res) => {
      console.log("Run code result", res['data']['unit_test_results']);
      this.setState({stderr: ""});

      if (res['data']['stderr']) {
        this.setState({stderr: res['data']['stderr']});
      }

      if (res['data']['unit_test_results'][0]) {
        console.log("setting green");
        this.setState({unit_test_1_background: "#adff2f"})
      } else {
        this.setState({unit_test_1_background: "red"})
      }

      if (res['data']['unit_test_results'][1]) {
        this.setState({unit_test_2_background: "#adff2f"})
      } else {
        this.setState({unit_test_2_background: "red"})
      }
    })
    .catch((err) => {
      console.log("Received an error while running the code", err);
    });
  }
  
  render() {
    return (
    <div>
      <div>Write a function that returns true if a number is evenly divisible by 2, otherwise return false:</div>
      <CodeMirror
        value={this.state.code}
        height="200px"
        extensions={[python({})]}
        onChange={(value, viewUpdate) => {
          console.log('value:', value);
          this.state.code = value;
        }}
      />
      <div style={{backgroundColor: this.state.unit_test_1_background}}>Unit test #1: divisbleByTwo(4)</div>
      <div style={{backgroundColor: this.state.unit_test_2_background}}>Unit test #2: divisbleByTwo(9)</div>
      <button onClick={ () => this.runCode() }>Run</button>
      <div style={{backgroundColor: "red"}}>
        {this.state.stderr}
      </div>
    </div>
    )
  }
};

export default Question;