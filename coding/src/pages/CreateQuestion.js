import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

function CreateQuestion() {
  const account = useSelector((state) => state.auth.account);
  const userId = account?.id;

  const [message] = useState("");
  const [code, setCode] = useState("");
  const [solution1, setSolution1] = useState("");
  const [solution2, setSolution2] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      code: "",
      solution1: "",
      solution2: "",
      unittest1input: "",
      unittest1output: "",
      unittest1visible: true,
      unittest2input: "",
      unittest2output: "",
      unittest2visible: true,
    },
    onSubmit: (values) => {
      handleCreateQuestion(
        values.name, 
        values.description, 
        code, 
        solution1, 
        solution2, 
        {input: values.unittest1input, output: values.unittest1output, visible: values.unittest1visible}, 
        {input: values.unittest2input, output: values.unittest2output, visible: values.unittest2visible}
      );
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Name is required"),
      description: Yup.string().trim().required("description is required")    
    }),
  });

  const handleCreateQuestion = (name, description, code, solution1, solution2, unitTest1, unitTest2) => {
    console.log(unitTest1);
    axios.post(`/api/question/`, { userId, name, description, code, solutions: [solution1, solution2], unitTests: [unitTest1, unitTest2] })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log("Received an error while creating question", err);
    });
  };
  
  return (
  <div>
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
            <h3>Solution #1</h3>
            <CodeMirror
              height="100px"
              value={solution1}
              extensions={[python({})]}
              onChange={(value, viewUpdate) => {
                setSolution1(value);
              }}
            />
            <h3>Solution #2</h3>
            <CodeMirror
              height="100px"
              value={solution2}
              extensions={[python({})]}
              onChange={(value, viewUpdate) => {
                setSolution2(value);
              }}
            />
            <h3>Unit Test #1</h3>
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="unittest1input"
              type="text"
              placeholder="Unit Test #1 Input"
              name="unittest1input"
              value={formik.values.unittest1input}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.unittest1input ? <div>{formik.errors.unittest1input} </div> : null}
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="unittest1output"
              type="text"
              placeholder="Unit Test #1 Output"
              name="unittest1output"
              value={formik.values.unittest1output}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.unittest1output ? <div>{formik.errors.unittest1output} </div> : null}
            Visible
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="unittest1visible"
              type="checkbox"
              placeholder="Unit Test #1 Visible"
              name="unittest1visible"
              checked={formik.values.unittest1visible}
              value={formik.values.unittest1visible}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <h3>Unit Test #2</h3>
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="unittest2input"
              type="text"
              placeholder="Unit Test #2 Input"
              name="unittest2input"
              value={formik.values.unittest2input}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.unittest2input ? <div>{formik.errors.unittest2input} </div> : null}
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="unittest2output"
              type="text"
              placeholder="Unit Test #2 Output"
              name="unittest2output"
              value={formik.values.unittest2output}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.unittest2output ? <div>{formik.errors.unittest2output} </div> : null}
            Visible
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="unittest2visible"
              type="checkbox"
              placeholder="Unit Test #2 Visible"
              name="unittest2visible"
              checked={formik.values.unittest2visible}
              value={formik.values.unittest2visible}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
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