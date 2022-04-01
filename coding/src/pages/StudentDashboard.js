import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import useSWR from 'swr';
import {fetcher} from "../utils/axios";
import Tabs from './Tabs';
import ClassCodeForm from './ClassCodeForm';
import StudentClassDataDisplay from './ClassTable';
import Navbar from "../components/navbar/Navbar";

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
    return <Navigate to={"/TeacherDashboard"} />;
  }

  return (
    <div className="w-full h-screen">
      <div className="w-full p-6">
        <button onClick={handleLogout} className="">Logout</button>
      </div>
      <Navbar/>
      {
            user.data ?
                <div className="w-full h-full text-center items-center">
                    <p className="self-center my-auto">Welcome, {user.data?.username}</p>
                </div>
                :
                <p className="text-center items-center">Loading ...</p>
        }
    <h1>My Dashboard</h1>
    <ClassCodeForm data={data} />
    <Tabs>
      <div label="Classes">
        <StudentClassDataDisplay/>
      </div>
      <div label="Assignments">
        List of assignments here!
      </div>
    </Tabs>
    </div>
  );
};

export default StudentDashboard;