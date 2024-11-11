import React, { useState } from 'react';
import axios from 'axios';
import './DepartmentCheck.css';
import { useNavigate } from 'react-router-dom';

const DepartmentCheck = () => {
  const [input, setInput] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleCheck = async () => {
    try {
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/categories`, {
        params: { pnrNumber: input, phoneNumber: input },
      });

      setDepartment(response.data.department || 'Not Found');
    } catch (err) {
      console.error('Error fetching department:', err.message || err);
      setDepartment('Error');
      setError(err.response?.data?.message || 'Failed to fetch department');
    }
  };

  return (
    <div className="page-department-check">
      <button className="nav-button" onClick={() => navigate('/')}>
        HOME PAGE
      </button>
      <div className="department-container">
        <div className="checker-card">
          <h2>Check Department</h2>
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Enter PNR Number or Phone Number"
          />
          <button onClick={handleCheck}>Check</button>
          {department && <p>Department: {department}</p>}
          {department && <p className="progress-message">Complaint is filed and in progress.</p>}
          {error && <p className="error-message">Error: {error}</p>}
        </div>
      </div>
    </div>
  );
};

export default DepartmentCheck;