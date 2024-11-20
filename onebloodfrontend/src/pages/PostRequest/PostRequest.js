import React, { useState } from 'react';
import './PostRequest.css';
import { useNavigate } from 'react-router-dom';

const PostRequest = () => {
    const [message, setMessage] =useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: '',
    });

    const initialFormData = {
        date: '',
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://one-blood.onrender.com/postRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include', // Include credentials (cookies)
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
            } else {
                setMessage("Error creating Post Request");
                console.error('Error creating Post Request');
                // Handle error and show an error message
            }
        } catch (error) {
            setMessage("POST request error. Please try again later."); 
            console.error('POST request error:', error);
        }

        setFormData(initialFormData);
        navigate('/home');
    };

    return (
        <div>
            <h2>Post Request</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date to Get:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && (
                <div className="message-container">
                    <div className={message.includes("Error") ? "error-message" : "success-message"}>
                        <p>{message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostRequest;
