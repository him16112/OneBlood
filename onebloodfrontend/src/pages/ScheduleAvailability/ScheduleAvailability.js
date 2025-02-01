import React, { useState } from 'react';
import './ScheduleAvailability.css';
import { useNavigate } from 'react-router-dom';

const ScheduleAvailability = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ date: '' });
    const [loading, setLoading] = useState(false); // Loader state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loader while sending request

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/scheduleAvailability`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await response.json();
            window.alert(data.message); // Show alert when response is received

            if (response.ok) {
                navigate('/home'); // Navigate only after request is successful
            }
        } catch (error) {
            window.alert("POST request error. Please try again later.");
            console.error('POST request error:', error);
        }

        setLoading(false); // Hide loader after request completes
        setFormData({ date: '' });
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
                        disabled={loading} // Disable input when loading
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"} {/* Button changes when loading */}
                </button>
            </form>
            {loading && <div className="loader"></div>} {/* Loader displayed when loading */}
        </div>
    );
};

export default ScheduleAvailability;
