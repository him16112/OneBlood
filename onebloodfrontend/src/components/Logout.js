// Logout.js
import React from 'react';
import './Logout.css';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // Include credentials (cookies)
      });

      if (response.ok) {
       navigate('/');
      } else {
        console.error('Logout failed');
        // Handle logout failure
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout error
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
