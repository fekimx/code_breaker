import React, { useState } from "react";
import {useSelector} from "react-redux";
import axiosService from "../utils/axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import NavHeader from "../components/navbar/NavHeader";
import { useNavigate } from "react-router-dom";
import Tabs from "./Tabs";

var dangerTxt = ""
function CreateQuestion() {
  const account = useSelector((state) => state.auth.account);
  const userId = account?.id;
  let navigate = useNavigate();

  const removeSolution = () => {
    setSolutions(solutions => {
      solutions.pop();
      return [...solutions];
    });
    setSolutionsData(solutionsData => {
      solutionsData.pop();
      return [...solutionsData];
    })
  }

  const removeUnitTest = () => {
    setUnitTests(unitTests => {
      unitTests.pop();
      return [...unitTests];
    });
    setUnitTestsData(unitTestsData => {
      unitTestsData.pop();
      return [...unitTestsData];
    })
  }

  const setSolutionN = (num, value) => {
    setSolutionsData(solutionsData => {
      solutionsData[num] = value;
      return [...solutionsData];
    })
  }

  const setUnitTestFieldN = (num, field, value) => {
    setUnitTestsData(unitTestsData => {
      if (unitTestsData[num] == undefined) {
        unitTestsData[num] = {};
      }
      unitTestsData[num][field] = value;
      return [...unitTestsData];
    })
  }

  const solutionHTMLByNum = (num) => {
    return <div key={num.toString()}>
      <h5>Solution #{num.toString()}</h5>
      <CodeMirror
        height="100px"
        extensions={[python({})]}
        onChange={(value, viewUpdate) => {
          setSolutionN(num - 1, value);
        }}
      />
    </div>;
  }

  const styleLeft = {
    display: "inline-block"
  }
  const stylePadding = {
    paddingLeft: "30px"
  }
  const stylePaddingOutput = {
    paddingLeft: "110px"
  }
  const unitTestHTMLByNum = (num) => {
    return <div key={num.toString()}>
      <br/> 
      <h5>Test Case #{num.toString()}</h5>
      {num.toString() == 1 &&
      <>
        <div style={{...styleLeft, ...stylePadding}}>
          <label>Input</label>
          <p><strong>Ex: </strong><code>isEven(4)</code></p>
        </div>
        <div style={{...styleLeft, ...stylePaddingOutput}}>
          <label>Output</label>
          <p><strong>Ex: </strong><code>True</code></p>
        </div>
      <br/>
      </>
      }
      <input
        style={{marginRight:"35px"}}
        className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
        type="text"
        onChange={(value, viewUpdate) => {
          setUnitTestFieldN(num - 1, 'input', event.target.value);
        }}
      />
      <input
        className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
        type="text"
        onChange={(value, viewUpdate) => {
          setUnitTestFieldN(num - 1, 'output', event.target.value);
        }}
      />
      <label style={{marginLeft:"10px"}}>Visible&nbsp;</label>
      <input
        className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
        type="checkbox"
        onChange={(value, viewUpdate) => {
          setUnitTestFieldN(num - 1, 'visible', event.target.checked);
        }}
      />
    </div>
  }

  const addSolution = () => {
    setSolutions(solutions => {
      const numSolutions = solutions.length + 1;
      return [...solutions, solutionHTMLByNum(numSolutions)];
    });
  };

  const addUnitTest = () => {
    setUnitTests(unitTests => {
      const numUnitTests = unitTests.length + 1;
      return [...unitTests, unitTestHTMLByNum(numUnitTests)];
    });
  };

  const [message] = useState("");
  const [code, setCode] = useState("");
  const [solutions, setSolutions] = useState([solutionHTMLByNum(1)]);
  const [solutionsData, setSolutionsData] = useState([]);
  const [unitTests, setUnitTests] = useState([unitTestHTMLByNum(1)]);
  const [unitTestsData, setUnitTestsData] = useState([]);
  const [successText, setSuccessText] = useState("");
  const [dangerText, setDangerText] = useState("");

  const clearTexts = () => {
    setSuccessText("");
    setDangerText("");
    dangerTxt = "";
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      code: ""
    },
    onSubmit: (values) => {
      handleCreateQuestion(
        values.name, 
        values.description, 
        code
      );
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Name is required"),
      description: Yup.string().trim().required("Description is required")    
    }),
  });

  const handleCreateQuestion = (name, description, code) => {
    clearTexts();
    console.log(unitTestsData);
    axiosService.post(`/api/teacher/question/`, { userId, name, description, code, solutions: solutionsData, unitTests: unitTestsData })
    .then((res) => {
      console.log(res);
      setSuccessText("Your question was created successfully!");
      Tabs.changeTabNumber(1);  
      navigate('/teacherdashboard');
    })
    .catch((err) => {
      if (code == "") {
        dangerTxt += "Function signature ";
      }
      if (solutionsData.length == 0) {
        dangerTxt += "At least one solution ";
      }
      if (unitTestsData.length == 0) {
        dangerTxt += "At least one unit test ";
      }
      setDangerText(dangerTxt+"REQUIRED to create a question");
      console.log("Received an error while creating question", err);
    });
  };
  
  return (
  <div>
    <NavHeader user="Teacher" title="" />
    <div className="pad">
    <div className="container">
    <div className="h-screen flex bg-gray-bg1">
      <div>
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Create a Question
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <h5>Name</h5>
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="name"
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* {codeBlank ? <div className="red-warning"><>&#9888;</>{formik.errors.code} </div> : null}  */}

            {formik.errors.name ? <div className="red-warning"><>&#9888;</>{formik.errors.name} </div> : null}
            <div className="space-y-4">
              <br/>
              <h5>Description</h5>
              <textarea
                className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows="4" cols="100"
              />
            {formik.errors.description ? <div className="red-warning"><>&#9888;</>{formik.errors.description} </div> : null}
            <br/>
            <br/>
             <hr />
            <h5>Function Signature</h5>
            <p><strong>Ex: </strong><code>def isEven(n):</code></p>
            <CodeMirror
              height="100px"
              value={code}
              extensions={[python({})]}
              onChange={(value, viewUpdate) => {
                setCode(value);
              }}
            />
            <br/>
            {solutions}
            <div><a href="#" onClick={removeSolution}>Remove Solution</a></div>
            <div><a href="#" onClick={addSolution}>Add Solution</a></div> <hr />
            {unitTests}
            <div><a href="#" onClick={removeUnitTest}>Remove Test Case</a></div>
            <div><a href="#" onClick={addUnitTest}>Add Test Case</a></div>
          </div>
          <div className="text-danger text-center my-2" hidden={false}>
            {message}
          </div>
        </div>
        <hr />
          <div className="flex justify-center items-center mt-6">
            <button type="submit" className="" >Create</button>
            <button type="button" className="cancelbutton" onClick={()=>{Tabs.changeTabNumber(1);  navigate("/teacherdashboard")}}>Cancel</button>
            <div className="text-success">{successText}</div>
            <div className="text-danger">{dangerText}</div>
          </div>
        </form>
      </div>
    </div>
    </div>
    </div>
  </div>
  )
};

export default CreateQuestion;