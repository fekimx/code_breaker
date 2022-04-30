import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import './NavHeader.css';
import { MenuNoUserOld, MenuNoUser, MenuStudent, MenuTeacher } from "./NavHeaderMenus";
import authSlice from "../../store/slices/auth";
import { useNavigate } from "react-router";

const NavHeader = (params) => {

    /*
        Call with user parameter:
        <NavHeader user="None" active="Students" />

        User options:
            None
            Student
            Teacher

        Active should match the title of the navbar link

    */

    const dispatch = useDispatch();
    const navigate = useNavigate();

    var currentMenu = MenuNoUser;
    
    switch (params.user) {
        case 'Student':
            currentMenu = MenuStudent;
            break;
        case 'Teacher':
            currentMenu = MenuTeacher;
            break;
        default:
            currentMenu = MenuNoUserOld;
    }

    const userLogout = () => {
        dispatch(authSlice.actions.logout());
        navigate("/login");
      }

    return (
        <div className="navbar-group">
            <div className="navbar-topline"></div>
            <div className="navbar-container">
                {currentMenu.map((item, index) => {
                    var tmpActive = (params.title == item.title) ? item.class+'-active' : item.class;
                    var tmpLink = '#'
                    var tmpClick = void(0)
                    if (item.url == '#LOGOUT#') {
                        tmpClick = userLogout
                    } else {
                        tmpLink = item.url
                    }
                    return (
                        <a key={index} className={tmpActive} href={tmpLink} onClick={tmpClick}>{item.title}</a>
                    )}
                )}
            </div>
            <div className="navbar-bottomline"></div>
        </div>
    );
  };
  
  export default NavHeader;


