import React, { useState, useEffect } from 'react';
import './Tasks.css';
import api from '../../utils/axios';
import { toast } from 'react-toastify';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        date: '',
        department: 'Farm',
        task: '',
        description: '',
        employeeId: ''
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/api/task/list');
            if (response.data.success) {
                setTasks(response.data.data);
            } else {
                setError('Failed to fetch tasks: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            if (error.response) {
                setError(`Error ${error.response.status}: ${error.response.data.message || 'Failed to fetch tasks'}`);
            } else if (error.request) {
                setError('No response from server. Please check your connection.');
            } else {
                setError('Error: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/task/add', formData);
            if (response.data.success) {
                toast.success('Task added successfully');
                setShowAddForm(false);
                fetchTasks();
                resetForm();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to add task');
            console.error('Error:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/api/task/${selectedTask._id}`, formData);
            if (response.data.success) {
                toast.success('Task updated successfully');
                setShowUpdateForm(false);
                fetchTasks();
                resetForm();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to update task');
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await api.delete(`/api/task/${id}`);
                if (response.data.success) {
                    toast.success('Task deleted successfully');
                    fetchTasks();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error('Failed to delete task');
                console.error('Error:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            date: '',
            department: 'Farm',
            task: '',
            description: '',
            employeeId: ''
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="tasks-container">
            <h2>Task Management</h2>
            
            <button className="add-task-btn" onClick={() => setShowAddForm(true)}>
                Add New Task
            </button>

            {showAddForm && (
                <div className="form-overlay">
                    <div className="form-container">
                        <h3>Add New Task</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Date:</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Department:</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    required
                                >
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
                                <label>Task:</label>
                                <input
                                    type="text"
                                    name="task"
                                    value={formData.task}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                />
                            </div>
                            <div className="form-group">
                                <label>Employee ID:</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="submit">Add Task</button>
                                <button type="button" onClick={() => {
                                    setShowAddForm(false);
                                    resetForm();
                                }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showUpdateForm && selectedTask && (
                <div className="form-overlay">
                    <div className="form-container">
                        <h3>Update Task</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Date:</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Department:</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    required
                                >
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
                                <label>Task:</label>
                                <input
                                    type="text"
                                    name="task"
                                    value={formData.task}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                />
                            </div>
                            <div className="form-group">
                                <label>Employee ID:</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="submit">Update Task</button>
                                <button type="button" onClick={() => {
                                    setShowUpdateForm(false);
                                    resetForm();
                                }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="tasks-list">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Department</th>
                            <th>Task</th>
                            <th>Employee ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task._id}>
                                <td>{new Date(task.date).toLocaleDateString()}</td>
                                <td>{task.department}</td>
                                <td>{task.task}</td>
                                <td>{task.employeeId}</td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => {
                                            setSelectedTask(task);
                                            setFormData(task);
                                            setShowUpdateForm(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(task._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tasks; 