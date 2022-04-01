import React, { useState } from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import Navbar from "../components/navbar/Navbar";

function CreateQuestion() {
  const account = useSelector((state) => state.auth.account);
  const userId = account?.id;

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
      <h3>Solution #{num.toString()}</h3>
      <CodeMirror
        height="100px"
        extensions={[python({})]}
        onChange={(value, viewUpdate) => {
          setSolutionN(num - 1, value);
        }}
      />      
    </div>;
  }

  const unitTestHTMLByNum = (num) => {
    return <div key={num.toString()}> 
      <h3>Unit Test #{num.toString()}</h3>
      <input
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
      Visible
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
      description: Yup.string().trim().required("description is required")    
    }),
  });

  const handleCreateQuestion = (name, description, code) => {
    console.log(unitTestsData);
    axios.post(`/api/question/`, { userId, name, description, code, solutions: solutionsData, unitTests: unitTestsData })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log("Received an error while creating question", err);
    });
  };
  
  return (
  <div>
    <Navbar/>
    <div className="h-screen flex bg-gray-bg1">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Create a Question
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="name"
              type="text"
              placeholder="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.name ? <div>{formik.errors.name} </div> : null}
            <div className="space-y-4">
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="description"
              type="description"
              placeholder="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.description ? <div>{formik.errors.description} </div> : null}
            <h3>Code</h3>
            <CodeMirror
              height="100px"
              value={code}
              extensions={[python({})]}
              onChange={(value, viewUpdate) => {
                setCode(value);
              }}
            />
            {formik.errors.code ? (
              <div>{formik.errors.code} </div>
            ) : null}
            {solutions}
            <div><a href="#" onClick={removeSolution}>Remove Solution</a></div>
            <div><a href="#" onClick={addSolution}>Add Solution</a></div>
            {unitTests}
            <div><a href="#" onClick={removeUnitTest}>Remove Unit Test</a></div>
            <div><a href="#" onClick={addUnitTest}>Add Unit Test</a></div>
          </div>
          <div className="text-danger text-center my-2" hidden={false}>
            {message}
          </div>
        </div>
          <div className="flex justify-center items-center mt-6">
            <button
              type="submit"
              className=""
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
};

export default CreateQuestion;