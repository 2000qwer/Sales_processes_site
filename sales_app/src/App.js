// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Charts from './components/Charts';
import AddSale from './components/AddSale'; // Import the AddSale component

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={<LoginForm setUser={setUser} />}
          />
          <Route path="/charts" element={<Charts setUser={setUser} />} />
          <Route path="/profile" element={<Profile setUser={setUser} />} />
          <Route
            path="/register"
            element={<RegistrationForm setUser={setUser} />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard user={user} />}
          />
          <Route path="/add-sale" element={<AddSale setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;