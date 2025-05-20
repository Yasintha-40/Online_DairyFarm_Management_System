import React, {useState} from 'react';
import './InsertTask.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const InsertTask = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  
  const [taskData , setTaskData] = useState({
    date: "",
    department: "",
    task: "",
    description: "",
    employeeId: ""
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    
    if (name === 'date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        alert('Please select a future date');
        return;
      }
    }
    
    setTaskData({
        ...taskData,
        [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate employeeId format
    if (!/^[a-zA-Z0-9]{10}$/.test(taskData.employeeId)) {
      alert('Employee ID must be exactly 10 characters (letters and numbers)');
      return;
    }

    axios.post('http://localhost:3000/api/tasks', taskData)
      .then(() => {
        setPopupMessage('Task added successfully!');
        setPopupType('success');
        setShowPopup(true);
        setTaskData({
          date: "",
          department: "",
          task: "",
          description: "",
          employeeId: ""
        });
        setTimeout(() => {
          navigate('/tasks');
        }, 1500);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.msg) {
          setPopupMessage('Error: ' + err.response.data.msg);
        } else {
          setPopupMessage('Error: Failed to add task');
        }
        setPopupType('error');
        setShowPopup(true);
      });
  };

  return (
    <div className="inserttask">
      <h2>Add New Task</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
      <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
                type="date"
                id="date"
                name="date"
                onChange={handleChange}
                value={taskData.date}
                min={new Date().toISOString().split('T')[0]}
                required
            />
        </div>

        <div className="form-group">
            <label htmlFor="department">Department:</label>
            <select
            id="department"
            name="department"
            onChange={handleChange}
            value={taskData.department}
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
            <label htmlFor="task">Task:</label>
            <input 
            type="text"
            id="task"
            name="task"
            onChange={handleChange}
            value={taskData.task}
            required/>
        </div>

        <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input 
            type="text"
            id="description"
            name="description"
            onChange={handleChange}
            value={taskData.description}/>
        </div>

        <div className="form-group">
            <label htmlFor="employeeId">Employee ID:</label>
            <input 
            type="text"
            id="employeeId"
            name="employeeId"
            onChange={handleChange}
            value={taskData.employeeId}
            required/>
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

export default InsertTask
