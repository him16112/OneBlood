import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();




  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const response = await fetch('http://localhost:8000/protected', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          navigate('/home');
        }
      } catch (error) {
        console.error('Protected resource error:', error);
      }

      setLoading(false);
    };

    checkTokenValidity();
  }, []);



  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });


      if (response.ok) {
        navigate('/home');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };


  const handleRegister = () => {
    navigate('/register');
  };

  

  return (
    <div className="login-container">
      <div className="login-form">
        {loading ? (
          <div></div>
        ) : (
          <div>
            <form onSubmit={handleLogin}>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <button type="submit">Login</button>
            </form>
            <button onClick={handleRegister}>Register</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
