import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import GrievanceForm from './components/Grievance/GrievanceForm';
import SubmissionSuccess from "./components/Submission/SubmissionSuccess";
import DepartmentCheck from './components/Department/DepartmentCheck';
import './App.css';

const App = () => {
  const location = useLocation();

  const getBackgroundImage = () => {
    switch (location.pathname) {
      case '/submission-success':
        return "url('/src/assets/denis-chick-mHqIs22M2Kw-unsplash.jpg')";
      case '/department-check':
        return "url('/src/assets/sugden-guy-sugden-JcimvPDC3as-unsplash.jpg')";
      default:
        return "url('/src/assets/pexels-pixabay-72594.jpg')";
    }
    
  };
  
  
  
  

  return (
    <div className="App" style={{ backgroundImage: getBackgroundImage() }}>
      <Routes>
        <Route path="/" element={<GrievanceForm />} />
        <Route path="/submission-success" element={<SubmissionSuccess />} />
        <Route path="/department-check" element={<DepartmentCheck />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;