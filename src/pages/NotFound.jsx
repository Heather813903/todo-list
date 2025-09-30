import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <main style={{ padding: "1rem" }}>
            <h2>Page Not Found</h2>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link to="/">Go to Home Page</Link>
        </main>
    );
}

        