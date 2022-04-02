import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import Navbar from "../components/navbar/Navbar";

function Register() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useNavigate();

  const handleRegister = (email, password, username) => {
    axios.post(`/api/auth/register/`, { email, password, username })
    .then((res) => {
      dispatch(
        authSlice.actions.setAuthTokens({
          token: res.data.token,
          refreshToken: res.data.refresh,
        })
      );
      dispatch(authSlice.actions.setAccount(res.data.user));
      setLoading(false);
      history("/");
    })
    .catch((err) => {
      console.log("Received an error while registering", err);
      setLoading(false);
      setMessage(err.response.data.detail.toString());
    });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: ""
    },
    onSubmit: (values) => {
      setLoading(true);
      handleRegister(values.email, values.password, values.username);
    },
    validationSchema: Yup.object({
      email: Yup.string().trim().required("Email is required"),
      password: Yup.string().trim().required("Password is required"),
      username: Yup.string().trim().required("Username is required")
    }),
  });

  return (
    <div className="h-screen flex bg-gray-bg1"> <Navbar/>
    <div class="container">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Register an account
        </h1>
        <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
                    <label>First name</label>
                    <input type="text" className="form-control" placeholder="First name" />
                </div>
                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" className="form-control" placeholder="Last name" />
                </div>
          <div className="form-group">
                    <label>Email address</label>
                    <input
                         className="form-control"
                        id="email"
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        /></div>
            {formik.errors.email ? <div>{formik.errors.email} </div> : null}
            <div className="form-group">
                 <label>Username</label>
                    <input
                         className="form-control"
                         id="username"
                         type="username"
                         placeholder="Enter Username"
                         name="username"
                         value={formik.values.username}
                         onChange={formik.handleChange}
                         onBlur={formik.handleBlur}
            /></div>
            {formik.errors.username ? <div>{formik.errors.username} </div> : null}
            <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              id="password"
              type="password"
              placeholder="Enter Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            /></div>
            {formik.errors.password ? (
              <div>{formik.errors.password} </div>
            ) : null}
          <div className="form-group" hidden={false}>
            {message}
          </div>
          <div className="flex justify-center items-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
            >
              Register
            </button>
          </div>
          <p className="forgot-password text-right">
                    Already registered <a href="/login">sign in?</a>
                </p>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Register;