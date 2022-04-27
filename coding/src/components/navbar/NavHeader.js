import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavHeader.css';
import { MenuNoUserOld, MenuNoUser, MenuStudent, MenuTeacher } from "./NavHeaderMenus";

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


    return (
        <div className="navbar-group">
            <div className="navbar-topline"></div>
            <div className="navbar-container">
                {currentMenu.map((item, index) => {
                    var tmpActive = (params.title == item.title) ? item.class+'-active' : item.class;
                    console.warn(" --> "+params.title+" vs "+item.title);
                    return (
                        <a className={tmpActive} href={item.url}>{item.title}</a>
                    )}
                )}
            </div>
            <div className="navbar-bottomline"></div>
        </div>
    );
  };
  
  export default NavHeader;


