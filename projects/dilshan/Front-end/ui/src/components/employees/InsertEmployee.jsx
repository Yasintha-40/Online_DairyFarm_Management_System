import React, {useState} from 'react';
import './InsertEmployee.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const InsertEmployee = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  
  const [employeeData , setEmployeeData] = useState({
    employeeId: "",
    name: "",
    nic: "",
    mobile: "",
    address: "",
    department: "",
    position: "",
    gender: "",
    birthdate: ""
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    
    if (name === 'birthdate') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate >= today) {
        setPopupMessage('Birthdate must be in the past');
        setPopupType('error');
        setShowPopup(true);
        setEmployeeData(prev => ({
          ...prev,
          birthdate: ""
        }));
        return;
      }
    }
    
    setEmployeeData({
        ...employeeData,
        [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate birthdate
    if (employeeData.birthdate) {
      const selectedDate = new Date(employeeData.birthdate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate >= today) {
        setPopupMessage('Birthdate must be in the past');
        setPopupType('error');
        setShowPopup(true);
        return;
      }
    }
    
    // Validate employeeId format
    if (!/^[a-zA-Z0-9]{10}$/.test(employeeData.employeeId)) {
      setPopupMessage('Employee ID must be exactly 10 characters (letters and numbers)');
      setPopupType('error');
      setShowPopup(true);
      return;
    }

    // Validate NIC format
    if (!/^(?:\d{10}|\d{9}[vV])$/.test(employeeData.nic)) {
      setPopupMessage('NIC must be either 10 digits or 11 digits followed by V/v');
      setPopupType('error');
      setShowPopup(true);
      return;
    }

    // Validate mobile format
    if (!/^\d{10}$/.test(employeeData.mobile)) {
      setPopupMessage('Mobile number must be exactly 10 digits');
      setPopupType('error');
      setShowPopup(true);
      return;
    }

    axios.post('http://localhost:3000/api/employees', employeeData)
      .then(() => {
        setPopupMessage('Employee added successfully!');
        setPopupType('success');
        setShowPopup(true);
        setEmployeeData({
          employeeId: "",
          name: "",
          nic: "",
          mobile: "",
          address: "",
          department: "",
          position: "",
          gender: "",
          birthdate: ""
        });
        setTimeout(() => {
          navigate('/employees');
        }, 1500);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.msg) {
          setPopupMessage('Error: ' + err.response.data.msg);
        } else {
          setPopupMessage('Error: Failed to add employee');
        }
        setPopupType('error');
        setShowPopup(true);
      });
  };

  return (
    <div className="inseremp">
      <h2>Employee Form</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="employeeId">Employee ID:</label>
            <input 
            type="text"
            id="employeeId"
            name="employeeId"
            onChange={handleChange}
            value={employeeData.employeeId}
            required/>
        </div>
        
        <div className="form-group">
            <label htmlFor="name">Employee Name:</label>
            <input
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            value={employeeData.name}
            required/>
        </div>
        
        <div className="form-group">
            <label htmlFor="nic">NIC:</label>
            <input
            type="text"
            id="nic"
            name="nic"
            onChange={handleChange}
            value={employeeData.nic}
            required/>
        </div>
        
        <div className="form-group">
            <label htmlFor="mobile">Mobile No:</label>
            <input
            type="tel"
            id="mobile"
            name="mobile"
            onChange={handleChange}
            value={employeeData.mobile}
            required/>
        </div>
        
        <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
            type="text"
            id="address"
            name="address"
            onChange={handleChange}
            value={employeeData.address}
            required/>
        </div>
        
        <div className="form-group">
            <label htmlFor="department">Department:</label>
            <select
            id="department"
            name="department"
            onChange={handleChange}
            value={employeeData.department}
            required>
                <option value="" disabled >Select Department</option>
                <option value="Farm">Farm</option>
                <option value="Factory">Factory</option>
                <option value="Outsiders">Outsiders</option>
                <option value="Delivery">Delivery</option>
                <option value="Vetinary">Vetinary</option>
                <option value="Lab">Lab</option>
                <option value="other primary providers">Other Primary Providers</option>
                <option value="Support services">Support Services</option>
            </select>
        </div>
        
        <div className="form-group">
            <label htmlFor="position">Position:</label>
            <input
            type="text"
            id="position"
            name="position"
            onChange={handleChange}
            value={employeeData.position}
            required/>
        </div>

        <div className="form-group">
            <label>Gender:</label>
            <div className="radio-group">
                <label>
                    <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={employeeData.gender === "Male"}
                        onChange={handleChange}
                        required
                    />
                    Male
                </label>
                <label>
                    <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={employeeData.gender === "Female"}
                        onChange={handleChange}
                    />
                    Female
                </label>
                <label>
                    <input
                        type="radio"
                        name="gender"
                        value="Other"
                        checked={employeeData.gender === "Other"}
                        onChange={handleChange}
                    />
                    Other
                </label>
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="birthdate">Birthdate:</label>
            <input
                type="date"
                id="birthdate"
                name="birthdate"
                onChange={handleChange}
                value={employeeData.birthdate}
                max={new Date().toISOString().split('T')[0]}
                required
            />
        </div>
        
        <button
        type="submit">
            Submit
            </button>
    </form>

    {showPopup && (
      <div className="popup-overlay">
        <div className={`popup ${popupType}`}>
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button className="close-btn" onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}

export default InsertEmployee
