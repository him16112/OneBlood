import React, { useState } from 'react';
import './ScheduleAvailability.css';
import { useNavigate } from 'react-router-dom';

const ScheduleAvailability = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: '',
    });

    const [message, setMessage] = useState(null); // State to store the success/error message

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
            const response = await fetch('https://one-blood.onrender.com/scheduleAvailability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include', // Include credentials (cookies)
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message); // Set the success message
                console.log('Availability schedule created successfully');
            } else {
                setMessage("Error creating availability schedule"); // Set error message if the request fails
                console.error('Error creating availability schedule');
            }
        } catch (error) {
            setMessage("POST request error. Please try again later."); // Set error message for fetch failure
            console.error('POST request error:', error);
        }

        setFormData(initialFormData);
        navigate('/home');
    };

    return (
        <div>
            <h2>Schedule Availability</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date of Availability:</label>
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

            {/* Show message based on state */}
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

export default ScheduleAvailability;
