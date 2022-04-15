
import React from "react";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import axiosService from "../utils/axios";
import { useSearchParams } from "react-router-dom";
import NewNav from "../components/navbar/NewNav";

function withMyHook(Component) {
  return function WrappedComponent(props) {
    let [searchParams, setSearchParams] = useSearchParams();
    let questionId = searchParams.get("id");
    return <Question {...props} questionId={questionId} />;
  }
}

class Question extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questionId: this.props.questionId,
      name: "",
      description: "",
      code: "def divisbleByTwo(n):\n",
      stderr: "",
      unitTests: [],
      unitTestData: [],
      solutions: [],
      showSolutions: false
    }

    axiosService.get(`/api/question/${this.props.questionId}/`,    {
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
    axiosService.post(`/api/run/`, { questionId: this.state.questionId, code: this.state.code })
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
      <NewNav/>
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