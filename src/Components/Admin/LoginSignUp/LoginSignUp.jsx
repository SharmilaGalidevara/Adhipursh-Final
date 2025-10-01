import React, { useState } from 'react';
import './LoginSignUp.css';
import { useNavigate } from 'react-router-dom';

// Client-side admin credentials (as requested)
const ADMIN_CREDENTIALS = { username: 'admin', password: 'adminlogin' };

const LoginSignUp = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setLoginError(false);
  };

  const handleAdminLogin = () => {
    const { username, password } = credentials;
    const ok = username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
    if (ok) {
      setLoginError(false);
      navigate('/admin');
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className='container'>
      <div className='header'>
        <div className="left-content">
          <div className="logo" style={{flexDirection: 'row', alignItems: 'center', gap: '1rem'}}>
            <img src={process.env.PUBLIC_URL + '/Images/Logo Without Caption.png'} alt="Crowd Control Logo" style={{height: '60px', width: 'auto'}} />
            <span style={{fontSize: '3.2rem', fontWeight: 900, color: '#6173D8', letterSpacing: '2.5px', textTransform: 'uppercase'}}>CROWD CONTROL</span>
          </div>
          <div style={{width: '100%', display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem', marginBottom: '1.5rem', paddingLeft: '12%'}}>
            <h1 style={{fontSize: '1.3rem', color: 'rgb(97, 115, 216)', margin: 0, textAlign: 'left', fontWeight: 700, letterSpacing: '0.5px', maxWidth: '600px'}}>Don’t Crowd My Style — Let AI Guide the Aisle</h1>
          </div>
          <div className="button-group">
            {loginError && (
              <div className="error-message">Invalid admin credentials.</div>
            )}
            <input
              type="text"
              name="username"
              placeholder="Admin Username"
              value={credentials.username}
              onChange={handleInputChange}
              className="input-field"
            />
            <input
              type="password"
              name="password"
              placeholder="Admin Password"
              value={credentials.password}
              onChange={handleInputChange}
              className="input-field"
            />
            <button className="primary-btn" onClick={handleAdminLogin}>Admin Login</button>
          </div>
        </div>
        <div className="features-marquee-wrapper">
          <div className="features-marquee">
            <div className="marquee-row delay-1">
              <span className="marquee-line">Less Stress, More Success — AI Crowd Control</span>
            </div>
            <div className="marquee-row delay-2">
              <span className="marquee-line no-bg">🏃‍♂️  🏃‍♀️  🏃  🏃‍♂️  🏃‍♀️  🏃  🏃‍♂️</span>
            </div>
            <div className="marquee-row delay-3">
              <span className="marquee-line">From Chaos to Chill — AI’s Got Crowd Control Skills</span>
            </div>
            <div className="marquee-row delay-4">
              <span className="marquee-line no-bg">🏃‍♂️  🏃‍♀️  🏃  🏃‍♂️  🏃‍♀️  🏃  🏃‍♂️</span>
            </div>
            <div className="marquee-row delay-5">
              <span className="marquee-line">Smart Monitoring, Real-time Alerts and Safer Events</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
