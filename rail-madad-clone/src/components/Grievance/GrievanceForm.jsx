import React, { useState } from 'react';
import './GrievanceForm.css';
import { useNavigate } from 'react-router-dom';

const GrievanceForm = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    trainNumber: '',
    pnrNumber: '',
    problemDescription: '',
    type: '',
    incidentDate: '',
    incidentTime: '',
    file: null
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phoneNumber.match(/^[6-9]\d{9}$/)) {
      newErrors.phoneNumber = 'Enter a valid 10-digit phone number';
    }
    if (!formData.trainNumber.match(/^\d{5}$/)) {
      newErrors.trainNumber = 'Enter a valid 5-digit train number';
    }
    if (!formData.pnrNumber.match(/^PNR[0-9]{3,}$/)) {
      newErrors.pnrNumber = 'PNR must start with "PNR" followed by numbers.';
    }
    if (!formData.incidentDate) {
      newErrors.incidentDate = 'Incident Date is required';
    }
    if (!formData.incidentTime) {
      newErrors.incidentTime = 'Incident Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await fetch('https://railway-new.onrender.com/api/grievances', {
        method: 'POST',
        body: formDataObj,
      });
      const result = await response.json();
      console.log(result);
      navigate('/submission-success');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="form-container">
      <button className="nav-button_new"  onClick={() => navigate('/department-check')}>
        Go to Department Check
      </button>
      <form className="grievance-form" onSubmit={handleSubmit}>
        <h2>Grievance Detail</h2>

        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </label>

        <div className="form-row">
          <label>
            Train Number:
            <input
              type="text"
              name="trainNumber"
              value={formData.trainNumber}
              onChange={handleChange}
              placeholder="Enter the train number"
              required
            />
            {errors.trainNumber && <span className="error">{errors.trainNumber}</span>}
          </label>
          <label>
            PNR Number:
            <input
              type="text"
              name="pnrNumber"
              value={formData.pnrNumber}
              onChange={handleChange}
              placeholder="Enter your PNR number"
              required
            />
            {errors.pnrNumber && <span className="error">{errors.pnrNumber}</span>}
          </label>
        </div>

        <label>
          Type:
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="">--Select--</option>
            <option value="Medical Assistance">Medical Assistance</option>
            <option value="Security">Security</option>
            <option value="Divyangjan Facilities">Divyangjan Facilities</option>
            <option value="Facilities for Women with Special needs">Facilities for Women with Special needs</option>
            <option value="Electrical Equipment">Electrical Equipment</option>
            <option value="Coach-Cleanliness">Coach-Cleanliness</option>
            <option value="Punctuality">Punctuality</option>
            <option value="Water Availability">Water Availability</option>
            <option value="Coach-Maintenance">Coach-Maintenance</option>
            <option value="Catering & Vending Service">Catering & Vending Service</option>
            <option value="Staff Behaviour">Staff Behaviour</option>
            <option value="Corruption/Bribery">Corruption/Bribery</option>
            <option value="Bed Roll">Bed Roll</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </label>

        <div className="form-row">
          <label>
            Problem Description:
            <textarea
              name="problemDescription"
              value={formData.problemDescription}
              onChange={handleChange}
              placeholder="Describe your problem"
            />
          </label>
        </div>

        <label>
          Upload Image:
          <input type="file" name="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <div className="form-row">
          <label>
            Incident Date:
            <input type="date" name="incidentDate" value={formData.incidentDate} onChange={handleChange} required />
            {errors.incidentDate && <span className="error">{errors.incidentDate}</span>}
          </label>
          <label>
            Incident Time:
            <input type="time" name="incidentTime" value={formData.incidentTime} onChange={handleChange} required />
            {errors.incidentTime && <span className="error">{errors.incidentTime}</span>}
          </label>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default GrievanceForm;