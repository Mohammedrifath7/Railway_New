import React from 'react';
import './SubmissionSuccess.css';
import { useNavigate } from 'react-router-dom';

const SubmissionSuccess = () => {
  const navigate = useNavigate();

  const handleNewSubmission = () => {
    navigate('/');
  };

  return (
    <div className="success-container">
      <div className="success-box">
        <h2>Submission Successful</h2>
        <button onClick={handleNewSubmission}>Submit Another Response</button>
      </div>
    </div>
  );
};

export default SubmissionSuccess;