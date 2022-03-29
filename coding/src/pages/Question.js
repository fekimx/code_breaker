
import React from "react";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import axios from "axios";
import { useSearchParams } from "react-router-dom";

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
      code: "def divisbleByTwo(n):\n",
      unit_test_1_background: "none",
      unit_test_2_background: "none",
      stderr: "",
      unitTests: [],
      solutions: [],
      showSolutions: false
    }

    axios.get(`/api/question/${this.props.questionId}/`,    {
      //ClassViewset gets a specific class classes
    })
    .then((res) => {
      this.setState({ 
        code: res.data['code'],
        unitTests: res.data['unitTests'].map((unitTest, index) => {
          if (unitTest.visible) {
            return <div key={index}>Input: {unitTest.input} Expected Output: {unitTest.expectedOutput}</div>
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
      {this.state.unitTests}
      {this.state.showSolutions ? this.state.solutions : null }
      <div><a href="#" onClick={ () => this.setState({showSolutions: !this.state.showSolutions}) }>{this.state.showSolutions ? "Hide Solutions" : "Show Solutions"}</a></div>
      <button onClick={ () => this.runCode() }>Run</button>
      <div style={{backgroundColor: "red"}}>
        {this.state.stderr}
      </div>
    </div>
    )
  }
};

export default withMyHook(Question);