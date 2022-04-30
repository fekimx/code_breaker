import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import useSWR from 'swr';
import {fetcher} from "../utils/axios";
import Tabs from './Tabs';
import NavHeader from "../components/navbar/NavHeader";
import StudentClassTable from "./StudentClassTable";
import StudentAssignmentTable from "./StudentAssignmentTable";
import StudentCompetitionsTable from "./StudentCompetitionsTable";
import Footer from "../components/Footer";

const StudentDashboard = () => {
  const account = useSelector((state) => state.auth.account);

  const userId = account?.id;

  const user = useSWR(`/api/user/${userId}/`, fetcher)

  return (
    <div className="w-full h-screen">
      <NavHeader user="Student" title="" />
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
      <div label="Competitions">
         <StudentCompetitionsTable/>
       </div>
    </Tabs>
    </div>
    </div>
    <Footer/>  
    </div>
  );
};

export default StudentDashboard;