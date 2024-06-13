import React, { useState } from 'react';
import '../../index.css';
import {Link} from "react-router-dom";
import {login} from "../../api/authentication";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ userName: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            const responseData = await login(formData)
            console.log('Login successful:', responseData);
            navigate("/dashboard")
            setIsLoading(false)
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
            <div className="container-login">
                <div className="wrap-login">
                    <span className="login-title">
                        Account Login
                    </span>
                    <form className="login-form" onSubmit={handleSubmit}>

                        <div className="input-wrap" data-validate="Enter username">
                            <input
                                type="text"
                                name="userName"
                                placeholder="User name"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                            />
                            <span className="focus" data-placeholder="&#xe82a;"></span>
                        </div>

                        <div className="input-wrap" data-validate="Enter password">
                            <input
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
                            <button type="submit">
                                {isLoading ? <div className='loading-spinner'></div> : 'Login'}
                            </button>
                        </div>
                        <div className="create-login">
                            Don't have an account? <br /><Link to="/signup">Create Account</Link>
                        </div>
                    </form>
                </div>
        </div>
    );
};

export default Login;
