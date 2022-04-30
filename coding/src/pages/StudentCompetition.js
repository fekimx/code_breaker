import React from "react";
import axiosService from "../utils/axios";
import { useSearchParams } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import '../App.css';
import Tabs from './Tabs';
import TeacherAssignmentStudentTable from './TeacherAssignmentStudentTable';
import StudentCompetitionQuestionTable from './StudentCompetitionQuestionTable';
import NavHeader from "../components/navbar/NavHeader";
import Footer from "../components/Footer";

function withMyHook(Component) {
  return function WrappedComponent(props) {
    let [searchParams, setSearchParams] = useSearchParams();
    let assignmentId = searchParams.get("id");
    return <Assignment {...props} assignmentId={assignmentId} />;
  }
}




class Competition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      competitionId: this.props.competitionId,
      name: "",
      author: 1,
      questions: []
    }

    axiosService.get(`/api/student/competition/${this.props.competitionId}/`,    {

    })
    .then((res) => {
      this.setState({ 
        name: res.data['name'],
        author: res.data['author'],
        questions: res.data['questions']
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  runCode() {
    console.log("Running codes: ", this.state.code);
    axiosService.post(`/api/run/`, { competitionId: this.state.competitionId, code: this.state.code })
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
            <StudentCompetitionQuestionTable/>
          </div>
        </div>
        </div>
        <Footer/>  
      </div>
    );
    }
  };
export default withMyHook(Competition);
