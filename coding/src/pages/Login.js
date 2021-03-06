import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import axiosService from "../utils/axios";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import NavHeader from "../components/navbar/NavHeader";
import Footer from "../components/Footer";

function Login() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useNavigate();

  const register = () => {
    history("/register");
  }

  const handleLogin = (email, password) => {
    axiosService.post(`/api/auth/login/`, { email, password })
    .then((res) => {
      dispatch(
        authSlice.actions.setAuthTokens({
          token: res.data.access,
          refreshToken: res.data.refresh,
        })
      );
      dispatch(authSlice.actions.setAccount(res.data.user));
      setLoading(false);
      console.log("Login check");
      console.log(res.data.user);
      if (res.data.user.is_staff) {
        history("/teacherdashboard");
      } else {
        history("/studentdashboard");
      }
      
    })
    .catch((err) => {
      console.log("Received an error while logging in", err);
      setLoading(false);
      setMessage(err.response.data.detail.toString());
    });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      handleLogin(values.email, values.password);
    },
    validationSchema: Yup.object({
      email: Yup.string().trim().required("Email is required"),
      password: Yup.string().trim().required("Password is required"),
    }),
  });

  return (<div className="h-screen flex bg-gray-bg1">
    <NavHeader user="None" title="Login" />
  <div className ="termspad">
  <div className="logincontainer">
    <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
      Log in to your account
    </h1>
    <form onSubmit={formik.handleSubmit}>
    <div className="form-group">
                <label>Email address</label>
                <input type="email"  id="email" className="form-control" placeholder="Enter email"name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur} />
            </div>
      <div className="form_group">
        
        {formik.errors.email ? <div className="red-warning"><>&#9888;</>{formik.errors.email} </div> : null}
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
        />
        {formik.errors.password ? <div className="red-warning"><>&#9888;</>{formik.errors.password} </div> : null}
      </div>
      <div className="text-danger text-center my-2" hidden={false}>
        {message}
      </div>
      <div className="flex justify-center items-center mt-6">
      </div>
      <div className="flex justify-center items-center mt-6">
     <button type="submit" className="btn btn-primary btn-block">Submit</button>
      </div>
    </form>
  </div>
  </div><Footer/>  
  </div>
  );
}

export default Login;

/* removed remember me / password recovery options for now.
      <div className="form-group">
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="customCheck1" />
                    <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                </div>
            </div>
            -----------------------
            
<p className="forgot-password text-right">
Forgot your <a href="#">password?</a>
</p>
*/