import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/auth/login";
import Signup from "./components/auth/signUp";
import Dashboard from "./components/currencies/dashboard";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard/>}/>
            </Routes>
        </Router>
    );
};

export default App;