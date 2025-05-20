import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskList.css';
import { Link } from 'react-router-dom';
import PDFGenerator1 from './PDFGenerator1';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setfilteredTasks] = useState([]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = tasks.filter((task) =>
      task.department.toLowerCase().includes(lowerCaseQuery)
    );
    setfilteredTasks(filtered);
  }, [searchQuery, tasks]);

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

  const onDeleteClick = (id) => {
    axios
      .delete(`http://localhost:3000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => {
        console.log('error while deleting', err);
      });
  };

  return (
    <div className="Show_TaskList">
      <div className="container">
        <Link className="btn btn-outline-success" to={`/tasks/insert`}>
                              &nbsp;Add Task
                            </Link>
        <div className="searchpdf">
          <div className="Search-bar">
            <input
              type="text"
              placeholder="Search by department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="button">
            <PDFGenerator1 tasks={filteredTasks} />
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Department</th>
                <th scope="col">Task</th>
                <th scope="col">Description</th>
                <th scope="col">Employee ID</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{task.date}</td>
                  <td>{task.department}</td>
                  <td>{task.task}</td>
                  <td>{task.description}</td>
                  <td>{task.employeeId}</td>
                  <td>
                    <Link className="btn btn-outline-success" to={`/tasks/update/${task._id}`}>
                      &nbsp;Update
                    </Link>
                    &nbsp;
                    <Link className="btn btn-outline-danger" to="#" onClick={() => onDeleteClick(task._id)}>
                      &nbsp;Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TaskList;
