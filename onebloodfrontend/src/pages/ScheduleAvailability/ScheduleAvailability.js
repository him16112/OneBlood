import React, { useState } from 'react';
import './ScheduleAvailability.css';
import { useNavigate } from 'react-router-dom';

const ScheduleAvailability = () => {
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
            const response = await fetch('http://localhost:8000/scheduleAvailability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include', // Include credentials (cookies)
            });

            if (response.ok) {
                console.log('Availability schedule created successfully');
                const usersResponse = await fetch('http://localhost:8000/getUsers');
                const usersData = await usersResponse.json();
                console.log('Users array after registration:', usersData);
                // Optionally, you can redirect the user or show a success message
            } else {
                console.error('Error creating availability schedule');
                // Handle error and show an error message
            }
        } catch (error) {
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
        </div>
    );
};

export default ScheduleAvailability;
