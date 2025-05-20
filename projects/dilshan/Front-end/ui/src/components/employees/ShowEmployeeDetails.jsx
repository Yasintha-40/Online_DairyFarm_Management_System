import React,{useState,useEffect} from 'react';
import axios from "axios";
import {Link,useParams} from 'react-router-dom';
import './ShowEmployeeDetails.css';

function ShowEmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const {id} = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3000/api/employees/${id}`).then((res) => {
      setEmployees(res.data);
    }).catch(() => {
      console.log("Error from ShowBookDetails");
    });
    }, [id]);

    const TableItem = (
      <div>
        <table className="table table-hover table-dark">
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Employee ID- </td>
              <td>{employees.employeeId}</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Name- </td>
              <td>{employees.name}</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>NIC- </td>
              <td>{employees.nic}</td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>Mobile- </td>
              <td>{employees.mobile}</td>
            </tr>
            <tr>
              <th scope="row">5</th>
              <td>Address- </td>
              <td>{employees.address}</td>
            </tr>
            <tr>
              <th scope="row">6</th>
              <td>Department- </td>
              <td>{employees.department}</td>
            </tr>
            <tr>
              <th scope="row">7</th>
              <td>Position- </td>
              <td>{employees.position}</td>
            </tr>
            <tr>
              <th scope="row">8</th>
              <td>Gender- </td>
              <td>{employees.gender}</td>
            </tr>
            <tr>
              <th scope="row">9</th>
              <td>Birth Date- </td>
              <td>{employees.birthdate ? new Date(employees.birthdate).toLocaleDateString() : ''}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );

  return (
    <div className="showEmployeeDetails">
      <div className="col-md-10 m-auto">
        <br />
        <Link to={"/employees"} className='btn btn-outline-danger float-right'>Back to Employees</Link>
      </div>

      <div className="col-md-8 m-auto">
        <h1 className='display-6-bold text-center'>Employee Details</h1>
        <p className='text-center'>This is full details of Employee</p>
        <br />
        <br />
      </div>
      <div className='col-md-10 m-auto'>{TableItem}

      </div>

      <div className='col-md-6 m-auto'>
        <Link to={`/update/${employees._id}`}
        className="btn btn-outline-info btn-lg btn-block d-flex justify-content-center">Edit Employee</Link>
      </div>
    </div>
  )
}

export default ShowEmployeeDetails