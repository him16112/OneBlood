import React, { useState, useEffect } from 'react';
import './ViewRequests.css';

const ViewRequests = () => {
  const [usersWithMatchingRequests, setUsersWithMatchingRequests] = useState([]);

  useEffect(() => {
    // Fetch users with matching requests based on the user's blood group

    fetch('http://localhost:8000/usersRequests', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        // Format the dates to display only the date portion
        data.forEach((user) => {
          user.requests.forEach((request) => {
            request.date = new Date(request.date).toLocaleDateString();
          });
        });
        setUsersWithMatchingRequests(data);
        
      })
      .catch((error) => {
        console.error('Error fetching users with matching requests:', error);
      });

  }, []); // Run this effect whenever userBloodGroup changes


  return (
    <div className="view-requests-container">
      <div className="view-requests-card">
        <h2 className="view-requests-header">Users with Matching Requests for Blood Group</h2>
        <ul className="view-requests-list">
          {usersWithMatchingRequests.map((user, index) => (
            <li key={index} className="view-requests-user">
              <h3 className="view-requests-username">{user.username}</h3>
              <p className="view-requests-address">{user.address}</p>
              <ul className="view-requests-request-list">
                {user.requests.map((request, subIndex) => (
                  <li key={subIndex} className="view-requests-request">
                    Requested Date: <span className="view-requests-request-date">{request.date}</span>
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

export default ViewRequests;







