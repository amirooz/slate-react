import React from 'react';
import { Link, NavLink} from 'react-router-dom';

const Navbar = (props) => {
    return(
        <div className="navbar-fixed">
            <nav className="nav-wrapper blue">
                <div className="container">
                    <Link to="/" className="brand-logo">Slate</Link>
                    <ul className="right">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/list">List</NavLink></li>
                        <li><NavLink to="/pdf">PDF</NavLink></li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}


export default Navbar
