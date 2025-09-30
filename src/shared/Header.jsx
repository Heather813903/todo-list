import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './Header.module.css';


function Header({ title }) {
    const location = useLocation();

    return (
        <header>
            <h1>{title}</h1>
            <nav>
                <NavLink
                     to="/"
                        className={({ isActive }) => (isActive ? styles.active : styles.inactive)}
                     >
                        Home
                    </NavLink>
                    |{" "}
                    <NavLink
                        to="/about"
                        className={({ isActive }) => (isActive ? styles.active : styles.inactive)}
                    >
                        About
                    </NavLink>
            </nav>
        </header>
    );
}
export default Header;
