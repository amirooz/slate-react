import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const Navbar = (props) => {
    return(
        <div className="navbar-fixed">
            <nav className="nav-wrapper custom-color">
                <div className="container">
                    <Link to="/" className="brand-logo">Twisker</Link>
                    <ul className="right">
                        <li><NavLink to="/">Slate</NavLink></li>
                        <li><NavLink to="/list">List</NavLink></li>
                        <li><NavLink to="/editor">Editor</NavLink></li>
                        <li><NavLink to="/upload">Upload</NavLink></li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}


export default Navbar
