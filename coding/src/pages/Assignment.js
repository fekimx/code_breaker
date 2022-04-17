import React from "react";
import axiosService from "../utils/axios";
import { useSearchParams } from "react-router-dom";

import '../App.css';
import Tabs from './Tabs';
import TeacherAssignmentStudentTable from './TeacherAssignmentStudentTable';
import TeacherAssignmentQuestionTable from './TeacherAssignmentQuestionTable';
import NewNav from "../components/navbar/NewNav";
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

    axiosService.get(`/api/teacher/assignment/${this.props.assignmentId}/`,    {

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
    axiosService.post(`/api/run/`, { assignmentId: this.state.assignmentId, code: this.state.code })
    .then((res) => {
      this.setState({stderr: ""});
      Question
      // let unitTests = [];

      // for (let i = 0; i < res['data']['unit_test_results'].length; i++) {
      //   let result = res['data']['unit_test_results'][i];
      //   let unitTest = this.state.unitTestData[i];
      //   if (result) {
      //     if (unitTest.visible) {
      //       unitTests.push(<div style={{backgroundColor: "#adff2f"}} key={i}><strong>Input:</strong> {unitTest.input} <strong>Expected Output:</strong> {unitTest.expectedOutput}</div>);
      //     } else {
      //       unitTests.push(<div style={{backgroundColor: "#adff2f"}} key={i}>Hidden Unit Test #{i}</div>);
      //     }
      //   } else {
      //     if (unitTest.visible) {
      //       unitTests.push(<div style={{backgroundColor: "red"}} key={i}><strong>Input:</strong> {unitTest.input} <strong>Expected Output:</strong> {unitTest.expectedOutput}</div>);
      //     } else {
      //       unitTests.push(<div style={{backgroundColor: "red"}} key={i}>Hidden Unit Test #{i}</div>);
      //     }
      //   }
      // }
      // console.log("Setting state", unitTests);
      // this.setState({
      //   unitTests
      // });
    })
    .catch((err) => {
      console.log("Received an error while running the code", err);
    });
  }
  
  render() {
    return (
      <div>
        <NewNav/>
        <div className="pad">
        <div className="container">
        <h1>Assignment: {this.state.name}</h1>
        <Tabs>
          <div label="Questions">
            <TeacherAssignmentQuestionTable/>
          </div>
          <div label="Students">
            <TeacherAssignmentStudentTable/>
          </div>
        </Tabs>
        </div>
        </div>
        <Footer/>  
      </div>
    );
    }
  };
export default withMyHook(Assignment);
