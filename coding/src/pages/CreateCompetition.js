import React, { useState, useEffect } from "react";
import {useSelector} from "react-redux";
import axiosService from "../utils/axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import NavHeader from "../components/navbar/NavHeader";
import { useNavigate } from "react-router-dom";
import Tabs from "./Tabs";
import Footer from "../components/Footer";

function CreateCompetition(type = "race") {
  const account = useSelector((state) => state.auth.account);
  const userId = account?.id;
  let navigate = useNavigate();

  const removeUIQuestion = () => {
    setUIQuestions(UIQuestions => {
      UIQuestions.pop();
      return [...UIQuestions];
    });
    setUIQuestionsData(uiQuestionsData => {
      uiQuestionsData.pop();
      return [...uiQuestionsData];
    })
  }


  const setUIQuestionFieldN = (num, field, value) => {
    setUIQuestionsData(uiQuestionsData => {
      if (uiQuestionsData[num] == undefined) {
        uiQuestionsData[num] = {};
      }
      uiQuestionsData[num][field] = value;
      return [...uiQuestionsData];
    })
  }

  const styleLeft = {
    float:"left"
  }
  const styleMargin = {
    marginRight: "30px"
  }
  const uiQuestionHTMLByNum = (num) => {
    return <div key={num.toString()}> 
      <br/>
      {num.toString() == 1 &&
        <div>
          <h5  style={{...styleLeft, ...styleMargin}}>Question #{num.toString()}</h5> 
          <h5>Weight</h5>
        </div>
      }
      {num.toString() != 1 &&
        <h5>Question #{num.toString()}</h5> 
      }
      <select
        className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
        type="select"
        onChange={(value, viewUpdate) => {
          setUIQuestionFieldN(num - 1, 'question', event.target.value);
        }}
        style = {{...styleMargin}} 
      >
        {questions}
        </select>
      <input
        className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
        type="number"
        min="1"
        max="10"
        defaultValue={1}
        onChange={(value, viewUpdate) => {
          setUIQuestionFieldN(num - 1, 'weight', event.target.value);
        }}
      />
      <div><a href="#" onClick={removeUIQuestion}>Remove Question</a></div>
    </div>
  }

  const addUIQuestion = () => {
    setUIQuestions(UIQuestions => {
      const numUIQuestions = UIQuestions.length + 1;
      setUIQuestionFieldN(UIQuestions.length, "question", questions[0].props.value);
      setUIQuestionFieldN(UIQuestions.length, "weight", 1);
      return [...UIQuestions, uiQuestionHTMLByNum(numUIQuestions)];
    });
  };

  const [message] = useState("");
  const [questions, updateQuestions] = useState([])
  const [classes, updateClasses] = useState([])
  const [UIQuestions, setUIQuestions] = useState([uiQuestionHTMLByNum(1)]);
  const [uiQuestionsData, setUIQuestionsData] = useState([]);
  const [successText, setSuccessText] = useState("");
  const [dangerText, setDangerText] = useState("");

  useEffect(() => {
    axiosService.get(`/api/class/?teacherId=` + userId, {})
    .then((res) => {
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
          <option key={questionFromApi.id} value={questionFromApi.id}>{questionFromApi.name} </option>
        );
      }
      updateQuestions(questionOptions);    
      removeUIQuestion();
    })
    .catch((err) => {
      console.log("Received an error while listing questions", err);
    });
  }, []);

  const clearTexts = () => {
    setSuccessText("");
    setDangerText("");
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      code: "",
      classes: classes,
      myclass: 0
    },
    onSubmit: (values) => {
      if (values.myclass == 0) {
        values.myclass = classes[0].props.value;
      }
      handleCreateQuestion(
        values.name, 
        values.myclass
      );
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Name is required")
      // creation w/out any questions is blocked later
    }),
  });

  const handleCreateQuestion = (name, myclass) => {
    clearTexts();
    axiosService.post(`/api/teacher/competition/`, { name: name, class: myclass, questions: uiQuestionsData, type: 'R' })
    .then((res) => {
      console.log(res);
      setSuccessText("Your competition was created successfully!");
      Tabs.changeTabNumber(3);  
      navigate('/teacherdashboard');
    })
    .catch((err) => {
      if (uiQuestionsData.length == 0) {
        setDangerText("At least one question is REQUIRED to create a competition");
      }
      console.log("Received an error while creating competition", err);
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
          {"Start a Competition"}
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
          <h4>Competition Type: { type.assignmentType }</h4>
          <br/>
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
            {formik.errors.name ? <div className="red-warning"><>&#9888;</>{formik.errors.name} </div> : null}
          <div className="space-y-4">
          <br/>
          <h5>Class</h5>
            <select
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="myclass"
              as="select"
              type="select"
              multiple={false}
              name="myclass"
              value={formik.values.myclass}
               onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {classes}
              </select>
            {formik.errors.class ? <div>{formik.errors.class} </div> : null}
            {UIQuestions}
            <div><a href="#" onClick={addUIQuestion}>Add Question</a></div>
          </div>
          <div className="text-danger text-center my-2" hidden={false}>
            {message}
          </div>
        </div>
          <div className="flex justify-center items-center mt-6">
            <button
              type="submit"
              value="submit"
              className=""
            >
              Create
            </button>
            <button type="button" className="cancelbutton" onClick={()=>{Tabs.changeTabNumber(3);  navigate("/teacherdashboard")}}>Cancel</button>
            <div className="text-success">{successText}</div>
            <div className="text-danger">{dangerText}</div>
          </div>
        </form>
      </div>
    </div>
    </div>
    </div>
    <Footer/>  
  </div>
  )
};

export default CreateCompetition;