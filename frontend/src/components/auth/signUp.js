import React, { useState } from 'react';
import '../../index.css';
import {Link, redirect} from "react-router-dom";
import {signIn} from "../../api/authentication";

const Signup = () => {
    // State for form data and error
    const [formData, setFormData] = useState({ userName: '', name: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    // Handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            await signIn(formData)
            redirect('./login.js')
            setIsLoading(false)
        } catch (error) {
            setError('Error signing up');
            setIsLoading(false)
        }
    };

    return (
        <div className="limiter">
            <div className="container-login">
                <div className="wrap-login">
                    <span className="login-title">
                        Create Account
                    </span>
                    <form className="login-form" onSubmit={handleSubmit}>

                        <div className="input-wrap" data-validate="Enter username">
                            <input
                                className="input"
                                type="text"
                                name="userName"
                                placeholder="User name"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                            />
                            <span className="focus" data-placeholder="&#xe82a;"></span>
                        </div>

                        <div className="input-wrap" data-validate="Enter Name">
                            <input
                                className="input"
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <span className="focus" data-placeholder="&#xe82a;"></span>
                        </div>

                        <div className="input-wrap" data-validate="Enter password">
                            <input
                                className="input"
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span className="focus" data-placeholder="&#xe80f;"></span>
                        </div>

                        {error && <p className="error">{error}</p>}

                        <div className="container-form-btn">
                            <button className="form-btn" type="submit">
                                {isLoading ? <div className='loading-spinner'></div> : 'Create Account'}
                            </button>
                        </div>
                        <div className="create-login">
                            Already have an account? <br/><Link to="/login">Login Account</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;