
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router";
import authSlice from "../store/slices/auth";
import useSWR from 'swr';
import {fetcher} from "../utils/axios";

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
  return (
    <div className="w-full h-screen">
      <div className="w-full p-6">
        <button
          onClick={handleLogout}
          className=""
        >
          Logout
        </button>
      </div>
      {
            user.data ?
                <div className="w-full h-full text-center items-center">
                    <p className="self-center my-auto">Welcome, {user.data?.username}</p>
                </div>
                :
                <p className="text-center items-center">Loading ...</p>
        }
    </div>
  );
};

export default Dashboard;