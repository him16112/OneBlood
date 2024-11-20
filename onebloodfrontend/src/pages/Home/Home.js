// Home.js
import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Logout from "../../components/Logout.js";
import Cookies from "js-cookie";
import Slider from "react-slick"; // Import Slider
import "slick-carousel/slick/slick.css"; // Import Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import Slick Theme CSS

const Home = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const username = Cookies.get("username"); // Read the username from cookies
    if (username) {
      setUser(username);
    }
  }, [setUser]);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <h1>
            <span className="highlight">Blood</span> Donation Portal
          </h1>
          <p>Be the reason someone smiles today. Your donation saves lives!</p>
            <p>Welcome, <span className="username">{user}</span>!</p>
        </div>
        <Logout className="logout-button" />
      </header>



      <div className="options">
        <div className="option">
          <h3>Donate Blood</h3>
          <span>
            <Link to="/schedule-availability">Schedule Availability</Link>
          </span>
          <span>
            <Link to="/view-requests">View Requests</Link>
          </span>
        </div>

        <div className="option">
          <h3>Need Blood</h3>
          <span>
            <Link to="/view-available-donors">Available Donors</Link>
          </span>
          <span>
            <Link to="/post-request">Post Request</Link>
          </span>
        </div>

        <div className="option">
          <h3>Contribute</h3>
          <span>Contribute to Organizations</span>
        </div>
      </div>

      {/* Slider Section */}
      <div className="slider-container">
        <Slider {...sliderSettings}>
          <div>
            <img
              src="https://as1.ftcdn.net/v2/jpg/02/76/71/88/1000_F_276718846_1mDkxI8gb6FrfuwAiPb6OuB4M7BbeuoV.jpg"
              alt="Blood Donation 1"
              className="slider-image"
            />
          </div>
          <div>
            <img
              src="https://as2.ftcdn.net/v2/jpg/06/01/50/73/1000_F_601507388_AWJ1MiRTqRQ40RxVfo9q4abN9A71l2r2.jpg"
              alt="Blood Donation 2"
              className="slider-image"
            />
          </div>
          <div>
            <img
              src="https://as2.ftcdn.net/v2/jpg/08/19/80/61/1000_F_819806180_9DgyF5Mh4y1bz8sE0ez9LtgT7ROjkmtG.jpg"
              alt="Blood Donation 3"
              className="slider-image"
            />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Home;
