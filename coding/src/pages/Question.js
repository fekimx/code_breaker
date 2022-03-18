
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import useSWR from 'swr';
import {fetcher} from "../utils/axios";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

class Question extends React.Component {
  constructor(props) {
      super(props);

    //   this.account = useSelector((state) => state.auth.account);
    //   const dispatch = useDispatch();
    //   const history = useNavigate();
    
    //   const userId = account?.id;
    
    //   const user = useSWR(`/api/user/${userId}/`, fetcher)
    
    this.divRef = React.createRef();
  }

  componentDidMount() {

  };
  
  render() {
    return <CodeMirror
    value="console.log('hello world!');"
    height="200px"
    extensions={[python({})]}
    onChange={(value, viewUpdate) => {
      console.log('value:', value);
    }}
  />
  }
};

export default Question;