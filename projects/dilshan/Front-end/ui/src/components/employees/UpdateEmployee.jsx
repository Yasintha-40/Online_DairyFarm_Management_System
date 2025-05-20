import React, {useState,useEffect} from 'react';
import axios from "axios";
import { Link, useParams, useNavigate } from 'react-router-dom';
import './UpdateEmployee.css';

function UpdateEmployee() {
    const [employee, setEmployees] = useState({
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
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('success');
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/employees/${id}`)
         .then((res) => {
            setEmployees({
                employeeId: res.data.employeeId,
                name: res.data.name,
                nic: res.data.nic,
                mobile: res.data.mobile,
                address: res.data.address,
                department: res.data.department,
                position: res.data.position,
                gender: res.data.gender,
                birthdate: res.data.birthdate ? new Date(res.data.birthdate).toISOString().split('T')[0] : ""
            });
          })
         .catch((error) => {
            alert('Error: Failed to load employee data');
          });
    }, [id]);

    const onChange = (e) => {
        const {name, value} = e.target;
        
        if (name === 'birthdate') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate >= today) {
                setError('Birthdate must be in the past');
                setEmployees(prev => ({
                    ...prev,
                    birthdate: "" // Clear the invalid date
                }));
                return;
            }
        }
        
        setEmployees({...employee, [name]: value });
        setError(''); // Clear any previous errors
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        // Validate birthdate
        if (employee.birthdate) {
            const selectedDate = new Date(employee.birthdate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate >= today) {
                setError('Birthdate must be in the past');
                return;
            }
        }

        const data = {
            employeeId: employee.employeeId,
            name: employee.name,
            nic: employee.nic,
            mobile: employee.mobile,
            address: employee.address,
            department: employee.department,
            position: employee.position,
            gender: employee.gender,
            birthdate: employee.birthdate
        };
        axios.put(`http://localhost:3000/api/employees/${id}`, data)
        .then(() => {
            setPopupMessage('Employee updated successfully!');
            setPopupType('success');
            setShowPopup(true);
            setTimeout(() => {
                navigate('/employees');
            }, 1500);
        })
        .catch((err) => {
            if (err.response && err.response.data && err.response.data.msg) {
                setPopupMessage('Error: ' + err.response.data.msg);
            } else {
                setPopupMessage('Error: Failed to update employee');
            }
            setPopupType('error');
            setShowPopup(true);
        });
    };

    const handleDelete = () => {
        setShowDeletePopup(true);
    };

    const confirmDelete = () => {
        axios.delete(`http://localhost:3000/api/employees/${id}`)
            .then(() => {
                setPopupMessage('Employee deleted successfully!');
                setPopupType('success');
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/employees');
                }, 1500);
            })
            .catch((err) => {
                setPopupMessage('Error: Failed to delete employee');
                setPopupType('error');
                setShowPopup(true);
            });
        setShowDeletePopup(false);
    };

    return (
        <div className="UpdateEmployee">
            <div className="containerupdateemp">
                <div className="row">
                    <div className="col-md-8 m-auto">
                        <br />
                        <Link to={"/employees"} className='btn btn-outline-warning float-left'>Back to Employees
                        </Link>
                    </div>
                </div>
                <div className="col-md-8 m-auto">
                    <form noValidate onSubmit={onSubmit}>
                        <div className="form-group">
                            <label htmlFor="employeeId">Employee ID:</label>
                            <input 
                            type="text"
                            id="employeeId"
                            name="employeeId"
                            onChange={onChange}
                            value={employee.employeeId}
                            readOnly
                            className="readonly-input"
                            required/>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="name">Employee Name:</label>
                            <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={onChange}
                            value={employee.name}
                            required/>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="nic">NIC:</label>
                            <input
                            type="text"
                            id="nic"
                            name="nic"
                            onChange={onChange}
                            value={employee.nic}
                            required/>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="mobile">Mobile No:</label>
                            <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            onChange={onChange}
                            value={employee.mobile}
                            required/>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="address">Address:</label>
                            <input
                            type="text"
                            id="address"
                            name="address"
                            onChange={onChange}
                            value={employee.address}
                            required/>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="department">Department:</label>
                            <select
                            id="department"
                            name="department"
                            onChange={onChange}
                            value={employee.department}
                            required>
                                <option value="" disabled >Select Department</option>
                                <option value="Farm">Farm</option>
                                <option value="Factory">Factory</option>
                                <option value="Delivery">Delivery</option>
                                <option value="Veterinary">Veterinary</option>
                                <option value="Lab">Lab</option>
                                <option value="Other Primary Workers">Other Primary Workers</option>
                                <option value="Support Services">Support Services</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="position">Position:</label>
                            <input
                            type="text"
                            id="position"
                            name="position"
                            onChange={onChange}
                            value={employee.position}
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
                                        checked={employee.gender === "Male"}
                                        onChange={onChange}
                                        required
                                    />
                                    Male
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Female"
                                        checked={employee.gender === "Female"}
                                        onChange={onChange}
                                    />
                                    Female
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Other"
                                        checked={employee.gender === "Other"}
                                        onChange={onChange}
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
                                onChange={onChange}
                                value={employee.birthdate}
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        
                        <button
                        type="submit">
                            Update Employee
                            </button>
                    </form>
                    <button className="delete-btn" onClick={handleDelete}>Delete Employee</button>
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
                            <p>Are you sure you want to delete this employee?</p>
                            <div className="popup-buttons">
                                <button className="confirm-btn" onClick={confirmDelete}>Yes</button>
                                <button className="cancel-btn" onClick={() => setShowDeletePopup(false)}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UpdateEmployee
