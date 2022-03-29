
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import useSWR from 'swr';
import {fetcher} from "../utils/axios";
import Tabs from './Tabs';
import ClassCodeForm from './ClassCodeForm';
import JsonClassDataDisplay from './ClassTable';

const Dashboard = () => {
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

  return (
    <div className="w-full h-screen">
      <div className="w-full p-6">
        <button
          onClick={handleLogout}
          className=""
        >
          Logout
        </button>
        <button onClick={()=>history("/")}>Return to Dashboard</button>
        <button onClick={()=>history("/about")}>About</button>
        <button onClick={()=>history("/admin")}>Admin</button>
        <button onClick={()=>history("/class")}>Class</button>
        <button onClick={()=>history("/solution")}>Solution</button>
        <button onClick={()=>history("/unittest")}>UnitTest</button>
        <button onClick={()=>history("/about")}>About</button>
        <button onClick={()=>history("/question")}>Peep some questions!</button>
      </div>
      {
            user.data ?
                <div className="w-full h-full text-center items-center">
                    <p className="self-center my-auto">Welconme, {user.data?.username}</p>
                </div>
                :
                <p className="text-center items-center">Loading ...</p>
        }
    <h1>My Dashboard</h1>
    <ClassCodeForm data={data} />
    <Tabs>
      <div label="Classes">
        <JsonClassDataDisplay/>
      </div>
      <div label="Assignments">
        List of assignments here!
      </div>
    </Tabs>
    </div>
  );
};

export default Dashboard;