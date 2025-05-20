import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateTask.css';

const UpdateTask = () => {
  const [task, setTasks] = useState({
    date: "",
    department: "",
    task: "",
    description: "",
    employeeId: ""
  });
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/tasks/${id}`)
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => {
        console.log('Error from UpdateTask');
      });
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setTasks(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const data = {
      date: task.date,
      department: task.department,
      task: task.task,
      description: task.description,
      employeeId: task.employeeId
    };

    axios.put(`http://localhost:3000/api/tasks/${id}`, data)
      .then(() => {
        setPopupMessage('Task updated successfully!');
        setPopupType('success');
        setShowPopup(true);
        setTimeout(() => {
          navigate('/tasks');
        }, 1500);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.msg) {
          setPopupMessage('Error: ' + err.response.data.msg);
        } else {
          setPopupMessage('Error: Failed to update task');
        }
        setPopupType('error');
        setShowPopup(true);
      });
  };

  const handleDelete = () => {
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:3000/api/tasks/${id}`)
      .then(() => {
        setPopupMessage('Task deleted successfully!');
        setPopupType('success');
        setShowPopup(true);
        setTimeout(() => {
          navigate('/tasks');
        }, 1500);
      })
      .catch((err) => {
        setPopupMessage('Error: Failed to delete task');
        setPopupType('error');
        setShowPopup(true);
      });
    setShowDeletePopup(false);
  };

  return (
    <div className="updatetask">
      <h2>Update Task</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="row">
        <div className="col-md-8 m-auto">
          <form noValidate onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                name="date"
                value={task.date}
                onChange={onChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department:</label>
              <select
                name="department"
                value={task.department}
                onChange={onChange}
                className="form-control"
              >
                <option value="">Select Department</option>
                <option value="Farm">Farm</option>
                <option value="Factory">Factory</option>
                <option value="Outsiders">Outsiders</option>
                <option value="Delivery">Delivery</option>
                <option value="Vetinary">Vetinary</option>
                <option value="Lab">Lab</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="task">Task:</label>
              <input
                type="text"
                name="task"
                value={task.task}
                onChange={onChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                name="description"
                value={task.description}
                onChange={onChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="employeeId">Employee ID:</label>
              <input
                type="text"
                name="employeeId"
                value={task.employeeId}
                onChange={onChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update Task
            </button>
          </form>
          <button className="delete-btn" onClick={handleDelete}>Delete Task</button>
        </div>
      </div>

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

      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup warning">
            <div className="popup-content">
              <p>Are you sure you want to delete this task?</p>
              <div className="popup-buttons">
                <button className="confirm-btn" onClick={confirmDelete}>Yes</button>
                <button className="cancel-btn" onClick={() => setShowDeletePopup(false)}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateTask;

