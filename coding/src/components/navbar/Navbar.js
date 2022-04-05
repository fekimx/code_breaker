import React, { Component } from 'react';
import { MenuItems } from "./MenuItems";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import './Navbar.css';
import '../../App.css';

const NavbarContainer = styled.div`
  width: 100%;
  height: 80px;
  z-index: 20;
  background: linear-gradient(90deg, rgb(61, 83, 207) 0%, rgb(46, 81, 238) 100%);
`;

const NavbarWrap = styled.div`
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  z-index: 20;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
`;
class Navbar extends Component {
    state = { clicked: false}

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked })
    }

    render() {
        return(
            <NavbarContainer>
                <NavbarWrap>
                <h1 className="navbar-logo" data-testid="navbar-header">Code-Breaker</h1>
                <div className="menu-icon" onClick={this.handleClick}>
                </div>
               <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'} >
                    {MenuItems.map((item, index) => {
                        return (
                            <li key={index}>
                                <a className={item.cName} href={item.url}>
                                    {item.title}
                                </a>
                                </li> 
                        )
                    })}

                </ul>
                </NavbarWrap>
            </NavbarContainer>
        )
    };
};

export default Navbar