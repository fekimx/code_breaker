import React, { useState } from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import { Field, Form, Formik, useFormik } from "formik";
import * as Yup from "yup";

function CreateAssignment() {
  const account = useSelector((state) => state.auth.account);
  const userId = account?.id;

  const [message] = useState("");

  const handleCreateAssignment = (values) => {
    axios.post(`/api/assignment/`, { author: userId, name: values.name, questions: values.questions, class: values.class })
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
          Create an Assignment
        </h1>
        <Formik 
          initialValues={{ name: '', class: 1, questions: []}}
          onSubmit={(values) => { handleCreateAssignment(values); }}>
          <Form>
            <div className="space-y-4">
              <Field
                className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
                id="name"
                type="text"
                placeholder="Name"
                name="name"
              />
              <h3>Questions</h3>
              <Field 
                  as="select"
                  name="questions"
                  multiple
              >
                <option value="1">Question 1</option>
                <option value="2">Question 2</option>
                <option value="3">Question 3</option>
                <option value="4">Question 4</option>
              </Field>
              <h3>Class</h3>
              <Field
                  as="select"
                  name="class"
              >
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
              </Field>
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
          </Form>
        </Formik>
      </div>
    </div>
  </div>
  )
};

export default CreateAssignment;