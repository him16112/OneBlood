import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home.js';
import Login from './pages/Login/Login.js';
import PrivateRoute from './components/PrivateRoute.js';
import Register from './pages/Register/Register.js';
import ScheduleAvailability from './pages/ScheduleAvailability/ScheduleAvailability.js';
import PostRequest from './pages/PostRequest/PostRequest.js';
import ViewRequests from './pages/ViewRequests/ViewRequests.js';
import ViewAvailableDonors from './pages/ViewAvailableDonors/ViewAvailableDonors.js';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<PrivateRoute Component={Home}/>} />
                <Route path="/schedule-availability" element={<PrivateRoute Component={ScheduleAvailability}/>} />
                <Route path="/post-request" element={<PrivateRoute Component={PostRequest}/>} />
                <Route path="/view-requests" element={<PrivateRoute Component={ViewRequests}/>} />
                <Route path="/view-available-donors" element={<PrivateRoute Component={ViewAvailableDonors}/>} />
            </Routes>
        </Router>
    );
};

export default App;
