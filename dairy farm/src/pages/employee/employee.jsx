import React, { useEffect, useState } from 'react';
import './employee.css';
import { NavLink, useNavigate } from 'react-router-dom';

const Employee = () => {
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");

        if (!email || !token) {
          alert("Please log in first");
          navigate("/");
          return;
        }

        // Fetch employee data using email
        const res = await fetch(`http://localhost:4000/api/employee/email/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (result.success) {
          setEmployee(result.data);
          setForm({
            name: result.data.name,
            mobile: result.data.mobile,
            address: result.data.address
          });
          // Fetch tasks after getting employeeId
          fetchTasks(result.data.employeeId);
        } else {
          console.log(result.message);
          alert("Failed to fetch employee data. Please try again.");
        }
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
        alert("Failed to fetch employee data. Please try again.");
      }
    };

    const fetchTasks = async (employeeId) => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching tasks for employeeId:", employeeId);

        const res = await fetch(`http://localhost:4000/api/task/employee/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        console.log("Tasks for employee:", result.data);

        if (result.success) {
          setTasks(result.data);
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchEmployeeData();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!employee?.email) {
      alert("Employee email not found. Please try logging in again.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:4000/api/employee/email/${employee.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (result.success) {
        alert("Profile updated successfully!");
        setEmployee({ ...employee, ...form });
        setIsEditing(false);
      } else {
        alert(result.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong!");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:4000/api/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (result.success) {
        // Update the status locally without refetching all tasks
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else {
        alert(result.message || "Failed to update task status.");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Something went wrong while updating status!");
    }
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="employee-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-options">
          <NavLink
            to="#"
            className="sidebar-option"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowTasks(false);
            }}
          >
            <p>Profile Details</p>
          </NavLink>
          <NavLink
            to="#"
            className="sidebar-option"
            onClick={() => {
              setShowTasks(!showTasks);
              setShowProfile(false);
            }}
          >
            <p>My Tasks</p>
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="employee-content">
        {showProfile && (
          <div className="profile-details">
            <h1>Welcome {employee.name}!</h1>
            <h2>Employee Details</h2>

            {isEditing ? (
              <form className="update-form" onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mobile:</label>
                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address:</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="button-group">
                  <button type="submit">Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="employee-info">
                  <p><strong>Employee ID:</strong> {employee.employeeId}</p>
                  <p><strong>Name:</strong> {employee.name}</p>
                  <p><strong>Email:</strong> {employee.email}</p>
                  <p><strong>Mobile:</strong> {employee.mobile}</p>
                  <p><strong>Department:</strong> {employee.department}</p>
                  <p><strong>Position:</strong> {employee.position}</p>
                  <p><strong>Address:</strong> {employee.address}</p>
                  <p><strong>Gender:</strong> {employee.gender}</p>
                  <div className="button-group">
                    <button type="button" onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {showTasks && (
          <div className="tasks-section">
            <h2>My Tasks</h2>
            {tasks.length === 0 ? (
              <p>No tasks assigned yet.</p>
            ) : (
              <div className="tasks-list">
                {tasks.map((task) => (
                  <div key={task._id} className="task-item">
                    <div>
                      <strong>Task:</strong> <div>{task.task}</div>
                    </div>
                    <div>
                      <strong>Department:</strong> <div>{task.department}</div>
                    </div>
                    <div>
                      <strong>Date:</strong> <div>{new Date(task.date).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <strong>Description:</strong> <div>{task.description || 'No description'}</div>
                    </div>
                    <select
                      value={task.status || 'Pending'}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;
