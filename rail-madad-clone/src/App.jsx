import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import GrievanceForm from './components/Grievance/GrievanceForm';
import SubmissionSuccess from "./components/Submission/SubmissionSuccess";
import DepartmentCheck from './components/Department/DepartmentCheck';
import './App.css';

// Import images
import defaultImage from './assets/pexels-pixabay-72594.jpg';
import successImage from './assets/denis-chick-mHqIs22M2Kw-unsplash.jpg';
import departmentImage from './assets/sugden-guy-sugden-JcimvPDC3as-unsplash.jpg';

const App = () => {
  const location = useLocation();

  const getBackgroundImage = () => {
    switch (location.pathname) {
      case '/submission-success':
        return `url(${successImage})`;
      case '/department-check':
        return `url(${departmentImage})`;
      default:
        return `url(${defaultImage})`;
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
