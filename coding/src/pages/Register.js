import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import axiosService from "../utils/axios";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import NavHeader from "../components/navbar/NavHeader";
import Footer from "../components/Footer";

function Register() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useNavigate();

  const handleRegister = (email, password, username) => {
    axiosService.post(`/api/auth/register/`, { email, password, username })
    .then((res) => {
      dispatch(
        authSlice.actions.setAuthTokens({
          token: res.data.token,
          refreshToken: res.data.refresh,
        })
      );
      dispatch(authSlice.actions.setAccount(res.data.user));
      setLoading(false);
      if (res.data.user.is_staff) {
        history("/teacherdashboard");
      } else {
        history("/studentdashboard");
      }
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
      fname: Yup.string().trim().required("First name is required"),
      lname: Yup.string().trim().required("Last name is required"),
      email: Yup.string().trim().required("Email is required"),
      password: Yup.string().trim().required("Password is required"),
      username: Yup.string().trim().required("Username is required")
    }),
  })
  const [agree, setAgree] = useState(false);

  const checkboxHandler = () => {
    // if agree === true, it will be set to false
    // if agree === false, it will be set to true
    setAgree(!agree);
    // Don't miss the exclamation mark
  }
  ;

  return (
    <div className="h-screen flex bg-gray-bg1">
      <NavHeader user="None" title="Register" />
    <div className="pad">
    <div className="container">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Register an account
        </h1>
        <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
                    <label>First name</label>
                    <input 
                      id="fname"
                      type="text" 
                      name="fname"
                      className="form-control" 
                      value={formik.values.fname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur} 
                    /></div>
                {formik.errors.fname ? <div className="red-warning"><>&#9888;</>{formik.errors.fname} </div> : null}
                <div className="form-group">
                    <label>Last name</label>
                    <input 
                    id="lname"
                    type="text" 
                    name="lname"
                    className="form-control" 
                    value={formik.values.lname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} 
                  />
                </div>
                {formik.errors.lname ? <div className="red-warning"><>&#9888;</>{formik.errors.lname} </div> : null}

          <div className="form-group">
                    <label>Email address</label>
                    <input
                        className="form-control"
                        id="email"
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        /></div>
            {formik.errors.email ? <div className="red-warning"><>&#9888;</>{formik.errors.email} </div> : null}
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
            {formik.errors.username ? <div className="red-warning"><>&#9888;</>{formik.errors.username} </div> : null}
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
            {formik.errors.password ? <div className="red-warning"><>&#9888;</>{formik.errors.password} </div>: null}
          <div className="form-group" hidden={false}>
            {message}
          </div>
      <div className="form-group">
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="agree" onChange={checkboxHandler}/>
                    <label className="custom-control-label" htmlFor="agree">By registering, I accept all</label><a href="/terms"> terms and conditions</a>
                    <p>as well as meet the minimum age requirement of 13 years old.</p>
                </div>
            </div>
          <div className="flex justify-center items-center mt-6">
            <button 
              type="submit"
              disabled={!agree}
              className="btn btn-primary btn-block"
            >
              Register
            </button>
          </div>
          <p className="forgot-password text-right">
                    Already registered? <a href="/login">Sign In</a>
                </p>
        </form>
      </div>
    </div><Footer/>  
    </div>
  );
}

export default Register;