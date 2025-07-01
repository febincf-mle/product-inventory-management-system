import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppContext } from '../context/AuthContext';

import axios from 'axios'


function Login() {
    // State to manage the form data.
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const { isLoggedIn, addNotification } = useAppContext();
    const [isLoading, setLoading] = useState(false);
    const [ errors, setErrors ] = useState([]);

    // useNavigate hook to programmatically navigate.
    const navigate = useNavigate()

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
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', formData);

            setFormData({
                username: '',
                email: '',
                password: ''
            });

            addNotification({
                type: 'success',
                content: 'User Registration successfull'
            })

            setErrors([]);
            setLoading(false);
            navigate('/login'); 

        } catch (error) {
            // Handle errors during registration    
            
            setErrors(error.response.data)
            setLoading(false);
            setFormData({
                username: '',
                email: '',
                password: ''
            });
        }
    }

    return (
        <div className="login-container">
        <form className="login-box" onSubmit={handleLogin}>
            <h2>Register</h2>
            <input
            className="login-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            />
            {errors && errors.username && <p style={{color: "red"}}>{errors.username[0]}</p>}
            <input
            className="login-input"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email"
            required
            />
            {errors && errors.email && <p style={{color: "red"}}>{errors.email[0]}</p>}
            <input
            className="login-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            />
            {errors && errors.password && <p style={{color: "red"}}>{errors.password[0]}</p>}
            <span>Already have an account? <Link to="/login">Login</Link></span>
            <button className="login-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Registering user...' : 'Register'}
            </button>
        </form>
        </div>
    )
}

export default Login