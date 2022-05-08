import React from "react";
import axiosService from "../utils/axios";
import { useSearchParams } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import '../App.css';
import Tabs from './Tabs';
import TeacherAssignmentStudentTable from './TeacherAssignmentStudentTable';
import StudentAssignmentQuestionTable from './StudentAssignmentQuestionTable';
import NavHeader from "../components/navbar/NavHeader";
import Footer from "../components/Footer";

function withMyHook(Component) {
  return function WrappedComponent(props) {
    let [searchParams, setSearchParams] = useSearchParams();
    let assignmentId = searchParams.get("id");
    return <Assignment {...props} assignmentId={assignmentId} />;
  }
}




class Assignment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assignmentId: this.props.assignmentId,
      name: "",
      author: 1,
      questions: []
    }

    axiosService.get(`/api/student/assignment/${this.props.assignmentId}/`,    {

    })
    .then((res) => {
      this.setState({ 
        name: res.data[0]['name'],
        author: res.data[0]['author'],
        questions: res.data[0]['questions']
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  runCode() {
    console.log("Running codes: ", this.state.code);
    axiosService.post(`/api/run/`, { assignmentId: this.state.assignmentId, code: this.state.code })
    .then((res) => {
      this.setState({stderr: ""});
      Question
    })
    .catch((err) => {
      console.log("Received an error while running the code", err);
    });
  }
  


  render() {
    
    return (
      <div>
      <NavHeader user="Student" title="" />
        <div className="pad">
        <div className="container">
        <h1>Assignment: {this.state.name}</h1>
          <div label="Questions">
            <StudentAssignmentQuestionTable/>
          </div>
        </div>
        </div>
        <Footer/>  
      </div>
    );
    }
  };
export default withMyHook(Assignment);
