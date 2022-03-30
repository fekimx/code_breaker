import React, { useState } from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

function CreateClass() {
  const account = useSelector((state) => state.auth.account);
  const userId = account?.id;
 
  const [message] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      active: true
    },
    onSubmit: (values) => {
      handleCreateClass(
        values.name, 
        values.active
      );
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Name is required")
    }),
  });

  const handleCreateClass = (name, active) => {
    axios.post(`/api/class/`, { userId, name, active, TAs: [], students: [] })
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
          Create a Class
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
            Active
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="active"
              type="checkbox"
              placeholder="Active"
              name="active"
              checked={formik.values.active}
              value={formik.values.active}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.active ? <div>{formik.errors.active} </div> : null}

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

export default CreateClass;