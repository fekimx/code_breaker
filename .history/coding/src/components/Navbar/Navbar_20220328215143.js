import React, { Component } from 'react';
import { MenuItems } from "./MenuItems";
import './Navbar.css';



class Navbar extends Component {
    render() {
        return(
            <nav className="NavbarItems">
                <h1 className="navbar-logo">Code-Breaker<i className="fa-solid fa-bars"></i></h1>
                <div className="menu-icon">
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
            </nav>
        )
    }
}