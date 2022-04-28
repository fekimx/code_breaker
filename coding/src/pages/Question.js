
import React from "react";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import axiosService from "../utils/axios";
import { useSearchParams } from "react-router-dom";
import NavHeader from "../components/navbar/NavHeader";
import { useState } from "react";
import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";

function withMyHook(Component) {
  


  return function WrappedComponent(props) {


    let [searchParams, setSearchParams] = useSearchParams();
    let questionId = searchParams.get("id");
    let assignmentId = searchParams.get("assignmentId");
    let competitionId = searchParams.get("competitionId");

    return <Question {...props} questionId={questionId} assignmentId={assignmentId} competitionId={competitionId} />;
  }
}



class Question extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      competitionId: this.props.competitionId,
      assignmentId: this.props.assignmentId,
      questionId: this.props.questionId,
      name: "",
      description: "",
      code: "def divisbleByTwo(n):\n",
      stderr: "",
      unitTests: [],
      unitTestData: [],
      solutions: [],
      showSolutions: false,
      showWinner: false
    }
  
    axiosService.get(`/api/student/question/${this.props.questionId}/`,    {
      //ClassViewset gets a specific class classes
    })
    .then((res) => {
      this.setState({ 
        name: res.data['name'],
        description: res.data['description'],
        code: res.data['code'],
        unitTestData: res.data['unitTests'],
        unitTests: res.data['unitTests'].map((unitTest, index) => {
          if (unitTest.visible) {
            return <div key={index}><strong>Input:</strong> {unitTest.input} <strong>Expected Output:</strong> {unitTest.expectedOutput}</div>
          } else {
            return <div key={index}>Hidden Unit Test #{index}</div>
          }
        }),
        solutions: res.data['solutions'].map((solution, index) => {
          return <CodeMirror
          key={index}
          value={solution.code}
          height="200px"
          extensions={[python({})]}
          readOnly={true}
        />
        })
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }


  runCode() {
    console.log("Running codes: ", this.state.code);
    axiosService.post(`/api/run/`, { competitionId: this.state.competitionId, assignmentId: this.state.assignmentId, questionId: this.state.questionId, code: this.state.code })
    .then((res) => {
      this.setState({stderr: ""});

      if (res['data']['stderr']) {
        this.setState({stderr: res['data']['stderr']});
      }

      let unitTests = [];

      for (let i = 0; i < res['data']['unit_test_results'].length; i++) {
        let result = res['data']['unit_test_results'][i];
        let unitTest = this.state.unitTestData[i];
        if (result) {
          if (unitTest.visible) {
            unitTests.push(<div style={{backgroundColor: "#adff2f"}} key={i}><strong>Input:</strong> {unitTest.input} <strong>Expected Output:</strong> {unitTest.expectedOutput}</div>);
          } else {
            unitTests.push(<div style={{backgroundColor: "#adff2f"}} key={i}>Hidden Unit Test #{i}</div>);
          }
        } else {
          if (unitTest.visible) {
            unitTests.push(<div style={{backgroundColor: "red"}} key={i}><strong>Input:</strong> {unitTest.input} <strong>Expected Output:</strong> {unitTest.expectedOutput}</div>);
          } else {
            unitTests.push(<div style={{backgroundColor: "red"}} key={i}>Hidden Unit Test #{i}</div>);
          }
        }
      }
      console.log("Setting state", unitTests);
      this.setState({
        unitTests
      });
    })
    .catch((err) => {
      console.log("Received an error while running the code", err);
    });
  }
  


  render() {

  
  
    
    return (
    <div>
    <NavHeader user="Student" title="" />


      <button variant="primary" onClick={() => this.setState({ showWinner: true })}>
        Launch static backdrop modal
      </button>


      <Modal
        show={this.state.showWinner}
        onHide={() => this.setState({ showWinner: false })}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Don't even try to press
          escape key.
        </Modal.Body>
        <Modal.Footer>
          <button variant="secondary" onClick={() => this.setState({ showWinner: false })}>
            Close
          </button>
          <button variant="primary">Understood</button>
        </Modal.Footer>
      </Modal>


      <div className="pad">
      <div className="container">
      <h3>{this.state.name}</h3>
      <div>{this.state.description}</div>
      <CodeMirror
        value={this.state.code}
        height="200px"
        extensions={[python({})]}
        onChange={(value, viewUpdate) => {
          console.log('value:', value);
          this.state.code = value;
        }}
      />
      {this.state.unitTests}
      {this.state.showSolutions ? this.state.solutions : null }
      <div><a href="#" onClick={ () => this.setState({showSolutions: !this.state.showSolutions}) }>{this.state.showSolutions ? "Hide Solutions" : "Show Solutions"}</a></div>
      <button onClick={ () => this.runCode() }>Run</button>
      <div style={{backgroundColor: "red"}}>
        {this.state.stderr}
      </div>
      </div>
      </div>
    </div>
    )
  }
};

export default withMyHook(Question);
