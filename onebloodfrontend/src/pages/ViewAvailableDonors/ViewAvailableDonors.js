import React, { useState, useEffect } from 'react';
import './ViewAvailableDonors.css';

const ViewAvailableDonors = () => {
  const [usersWithMatchingRequests, setUsersWithMatchingRequests] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/availableDonors', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        // Format the dates to display only the date portion
        data.forEach((user) => {
          user.availability.forEach((request) => {
            request.date = new Date(request.date).toLocaleDateString();
          });
        });
        setUsersWithMatchingRequests(data);
      })
      .catch((error) => {
        console.error('Error fetching users with matching requests:', error);
      });
  }, []);
  

  return (
    <div className="view-available-donors-container">
      <div className="view-available-donors-card">
        <h2 className="view-available-donors-header">Available Donors for Blood Group</h2>
        <ul className="view-available-donors-list">
          {usersWithMatchingRequests.map((user, index) => (
            <li key={index} className="view-available-donors-user">
              <h3 className="view-available-donors-username">{user.username}</h3>
              <p className="view-available-donors-address">{user.address}</p>
              <ul className="view-available-donors-request-list">
                {user.availability.map((request, subIndex) => (
                  <li key={subIndex} className="view-available-donors-request">
                    Requested Date: <span className="view-available-donors-request-date">{request.date}</span>
                    {/* Include other request details as needed */}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewAvailableDonors;
