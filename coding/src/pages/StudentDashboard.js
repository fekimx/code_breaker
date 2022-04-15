import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import useSWR from 'swr';
import {fetcher} from "../utils/axios";
import Tabs from './Tabs';
import NewNav from "../components/navbar/NewNav";
import StudentClassTable from "./StudentClassTable";
import StudentAssignmentTable from "./StudentAssignmentTable";
import Footer from "../components/Footer";

const StudentDashboard = () => {
  const account = useSelector((state) => state.auth.account);
  const dispatch = useDispatch();
  const history = useNavigate();

  const userId = account?.id;

  const user = useSWR(`/api/user/${userId}/`, fetcher)

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
    history("/login");
  };

  const data = {
    classCode: "",
    userId: userId
  };

  if (user.data?.is_staff == true) {
    history("/TeacherDashboard");
  };
  

  return (
    <div className="w-full h-screen">
      <NewNav/>
      <div className="col-sm-12" align="right">
        <button onClick={handleLogout} className="">Logout</button>
      </div>
      <div className="pad">
      <div className="container">
    <h1>Welcome, {user.data?.username}</h1>
    <Tabs>
      <div label="Classes">
        <StudentClassTable/>
      </div>
      <div label="Assignments">
        <StudentAssignmentTable/>
      </div>
    </Tabs>
    </div>
    </div>
    <Footer/>  
    </div>
  );
};

export default StudentDashboard;