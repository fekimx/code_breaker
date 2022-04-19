import React, { useState, useEffect } from "react";
import {useSelector} from "react-redux";
import axiosService from "../utils/axios";
import { Field, Form, Formik } from "formik";
import NewNav from "../components/navbar/NewNav";
import Tabs from "./Tabs";
import { useNavigate } from "react-router";

function CreateCompetition(type = "race") {
  let navigate = useNavigate();
  const account = useSelector((state) => state.auth.account);
  const userId = account?.id;

  console.log("Starting competition type: " + type.competitionType);

  const [message] = useState("");
  const [questions, updateQuestions] = useState([])
  const [classes, updateClasses] = useState([])
  const [successText, setSuccessText] = useState("");
  const [dangerText, setDangerText] = useState("");

  const initialValues = {
    name: "",
    questions: questions,
    classes: classes,
    class: 1
  };

  useEffect(() => {
    axiosService.get(`/api/class/?teacherId=` + userId, {})
    .then((res) => {
      console.log("Got classes");
      console.log(res);
      const classOptions = []
      for (let classFromApi of res.data) {
        classOptions.push(
          <option key={classFromApi.id} value={classFromApi.id}>
            {classFromApi.name}
          </option>
        );
      }
      updateClasses(classOptions);
    })
    .catch((error) => {
      console.log(error);
    });

    axiosService.get(`/api/teacher/question/`, {})
    .then((res) => {
      const questionOptions = []
      for (let questionFromApi of res.data) {
        questionOptions.push(
          <option key={questionFromApi.id} value={questionFromApi.id}>
            {questionFromApi.name}
          </option>
        );
      }
      updateQuestions(questionOptions);
    })
    .catch((err) => {
      console.log("Received an error while listing questions", err);
    });
  }, []);

  const clearTexts = () => {
    setSuccessText("");
    setDangerText("");
  }
  
  const handleCreateCompetition = (values) => {
    console.log(values);
    clearTexts();
    axiosService.post(`/api/teacher/competition/`, { author: userId, name: values.name, questions: values.questions, class: values.class, type: 'R' })
    .then((res) => {
      console.log(res);
      setSuccessText("Your competition was created successfully!");
      Tabs.changeTabNumber(3);
      navigate('/teacherdashboard');
    })
    .catch((err) => {
      console.log("Received an error while creating competition.", err);
      setDangerText("There was an error while creating your competition!");
    });
  };

  return (
  <div>
    <NewNav/>
    <div className="pad">
    <div className="container">
    <div className="h-screen flex bg-gray-bg1">
      <div>
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          {type.competitionType == "RACE" ? "Start a Competition" : "Create a Competition"}
        </h1>
        <Formik 
          initialValues={initialValues}
          onSubmit={(values) => { handleCreateCompetition(values); }}>
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
                {questions}
              </Field>
              <h3>Class</h3>
              <Field
                  as="select"
                  name="class"
              >
                {classes}
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
            <button type="button" className="cancelbutton" onClick={()=>navigate("/TeacherDashboard")}>Cancel</button>
            <div className="text-success">{successText}</div>
            <div className="text-danger">{dangerText}</div>
          </div>
          </Form>
        </Formik>
      </div>
    </div>
    </div>
    </div>
  </div>
  )
};

export default CreateCompetition;