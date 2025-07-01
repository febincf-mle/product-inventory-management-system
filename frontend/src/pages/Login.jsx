import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppContext } from '../context/AuthContext'
import axios from 'axios'

import '../assets/login.css'


function Login() {
    // State to manage the form data.
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { addNotification, login } = useAppContext();

    // useNavigate hook to programmatically navigate.
    const navigate = useNavigate();

    // State to manage the loading.
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to handle form input changes.
    const handleChange = (e) => {
        // extract the name of the input 
        // field and its value.
        const { name, value } = e.target;

        // update the formData state
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }))
    }

    // Function to handle form submission
    // for user creation.
    const handleLogin = async (e) => {
        e.preventDefault()
        
        try {
            // Make a POST request to the backend API.
            setLoading(true); // Set loading to true while the request is being processed.
            const response = await axios.post('http://127.0.0.1:8000/api/v1/login/', formData);

            // Save the tokens in the Browser's local storage.
            login(response.data.access, response.data.refresh)
            setError('')
            addNotification({
                type: 'success',
                content: 'Login successful'
            })

            setFormData({
                username: '',
                password: ''
            });

            setLoading(false);
            navigate('/products'); 

        } catch (error) {
            // Handle errors during registration   
            addNotification({
                type: 'warning',
                content: 'Login attempt failed.'
            }) 
                        
            setError(error.response.data.error);

            setLoading(false);
            setFormData({
                username: '',
                password: ''
            });
        }
    }

    return (
        <div className="login-container">
        <form className="login-box" onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
            className="login-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            />
            <input
            className="login-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            />
            { error && <p style={{color: "red"}}>{error}</p>}
            <span>Don't have an account? <Link to="/register">Register</Link></span>
            <button className="login-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
            </button>
        </form>
        </div>
    )
}

export default Login