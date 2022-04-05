import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import useSWR from 'swr';
import {fetcher} from "../utils/axios";
import Tabs from './Tabs';
import StudentClassDataDisplay from './ClassTable';
import Navbar from "../components/navbar/Navbar";
import { Navigate } from "react-router";
import StudentClasses from "./StudentClasses";
import StudentClassTable from "./StudentClassTable";
import StudentAssignmentTable from "./StudentAssignmentTable";


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
      <Navbar/>
      <div className="pad">
      <div class="container">
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
    </div>
  );
};

export default StudentDashboard;