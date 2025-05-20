import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeList.css';
import { Link } from 'react-router-dom';
import PDFGenerator from './PDFGenerator';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setfilteredEmployees] = useState([]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(lowerCaseQuery)
    );
    setfilteredEmployees(filtered);
  }, [searchQuery, employees]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/employees')
      .then((res) => {
        setEmployees(res.data);
        setfilteredEmployees(res.data);
        console.log(res.data);
      })
      .catch(() => {
        console.log('error while getting data');
      });
  }, []);

  const onDeleteClick = (id) => {
    axios
      .delete(`http://localhost:3000/api/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter((employee) => employee._id !== id));
      })
      .catch((err) => {
        console.log('error while deleting', err);
      });
  };

  return (
    <div className="Show_EmplyeeList">
      <div className="container">
        <div className="searchpdf">
          <div className="Search-bar">
            <input
              type="text"
              placeholder="Search Employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="button">
            <PDFGenerator employees={filteredEmployees} />
          </div>
        </div>

        {filteredEmployees.length === 0 ? (
          <p>No employees found</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Employee ID</th>
                <th scope="col">Name</th>
                <th scope="col">NIC</th>
                <th scope="col">Mobile</th>
                <th scope="col">Address</th>
                <th scope="col">Department</th>
                <th scope="col">Position</th>
                <th scope="col">Gender</th>
                <th scope="col">Birth Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{employee.employeeId}</td>
                  <td>{employee.name}</td>
                  <td>{employee.nic}</td>
                  <td>{employee.mobile}</td>
                  <td>{employee.address}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.birthdate ? new Date(employee.birthdate).toLocaleDateString() : ''}</td>
                  <td>
                    <Link className="btn btn-outline-success" to={`/show/${employee._id}`}>
                      &nbsp;Details
                    </Link>
                    &nbsp;
                    <Link className="btn btn-outline-danger" to="#" onClick={() => onDeleteClick(employee._id)}>
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

export default EmployeeList;