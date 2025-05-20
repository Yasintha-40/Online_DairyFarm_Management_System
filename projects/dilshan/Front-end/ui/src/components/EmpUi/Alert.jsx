import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alert.css';
import PDFGenerator1 from '../task/PDFGenerator1';

const Alert = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setfilteredTasks] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = tasks.filter((task) => {
      const matchesSearch = task.department.toLowerCase().includes(lowerCaseQuery);
      const matchesDepartment = selectedDepartment === '' || task.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
    setfilteredTasks(filtered);
  }, [searchQuery, tasks, selectedDepartment]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/tasks')
      .then((res) => {
        setTasks(res.data);
        setfilteredTasks(res.data);
        console.log(res.data);
      })
      .catch(() => {
        console.log('error while getting data');
      });
  }, []);

  // Get unique departments for the filter dropdown
  const departments = [...new Set(tasks.map(task => task.department))];

  return (
    <div className="Show_Alert">
      <div className="container">
        <div className="searchpdf">
          <div className="Search-bar">
            <input
              type="text"
              placeholder="Search by department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="department-filter"
            >
              <option value="">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="button">
            <PDFGenerator1 tasks={filteredTasks} />
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks found</p>
        ) : (
          <div className="task-grid">
            {filteredTasks.map((task, index) => (
              <div key={index} className="task-card">
                <div className="task-header">
                  <span className="task-number">#{index + 1}</span>
                  <span className="task-date">{task.date}</span>
                </div>
                <div className="task-department">{task.department}</div>
                <h3 className="task-title">{task.task}</h3>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <span className="employee-id">Employee ID: {task.employeeId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
