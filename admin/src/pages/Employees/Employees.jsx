import React, { useState, useEffect } from 'react';
import './Employees.css';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name');

    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        email: '',
        password: '',
        nic: '',
        mobile: '',
        address: '',
        department: 'Farm',
        position: '',
        gender: 'Male',
        birthdate: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/api/employee/list');
            if (response.data.success) {
                setEmployees(response.data.data);
            } else {
                setError('Failed to fetch employees: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            if (error.response) {
                setError(`Error ${error.response.status}: ${error.response.data.message || 'Failed to fetch employees'}`);
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
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }
        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        try {
            const response = await api.post('/api/employee/add', formData);
            if (response.data.success) {
                toast.success('Employee added successfully');
                setShowAddForm(false);
                fetchEmployees();
                resetForm();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to add employee. Please check all fields and try again.');
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Format the date to yyyy-MM-dd before sending
            const formattedData = { ...formData };
            if (formattedData.birthdate) {
                // Convert ISO date string to yyyy-MM-dd format
                const date = new Date(formattedData.birthdate);
                formattedData.birthdate = date.toISOString().split('T')[0];
            }
            
            // Log the request for debugging
            console.log('Updating employee with ID:', selectedEmployee._id);
            console.log('Update data:', formattedData);
            
            // Use the correct API endpoint based on the backend routes
            const response = await api.put(`/api/employee/id/${selectedEmployee._id}`, formattedData);
            
            if (response.data.success) {
                toast.success('Employee updated successfully');
                setShowUpdateForm(false);
                fetchEmployees();
                resetForm();
            } else {
                toast.error(response.data.message || 'Failed to update employee');
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            if (error.response) {
                toast.error(`Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
            } else if (error.request) {
                toast.error('No response from server. Please check your connection.');
            } else {
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const response = await api.delete(`/api/employee/${id}`);
                if (response.data.success) {
                    toast.success('Employee deleted successfully');
                    fetchEmployees();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error('Failed to delete employee');
                console.error('Error:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            employeeId: '',
            name: '',
            email: '',
            password: '',
            nic: '',
            mobile: '',
            address: '',
            department: 'Farm',
            position: '',
            gender: 'Male',
            birthdate: ''
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
    };

    const filteredEmployees = employees.filter(employee => {
        const searchValue = searchTerm.toLowerCase();
        switch (searchType) {
            case 'name':
                return employee.name.toLowerCase().includes(searchValue);
            case 'email':
                return employee.email.toLowerCase().includes(searchValue);
            case 'department':
                return employee.department.toLowerCase().includes(searchValue);
            case 'position':
                return employee.position.toLowerCase().includes(searchValue);
            case 'employeeId':
                return employee.employeeId.toLowerCase().includes(searchValue);
            default:
                return true;
        }
    });

    const handleDownloadPDF = () => {
        try {
            if (!filteredEmployees || filteredEmployees.length === 0) {
                toast.error('No employee data available to generate PDF');
                return;
            }

            // Create new PDF document
            const doc = new jsPDF();
            
            // Set font
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            
            // Add title
            doc.text('Employee List', 14, 15);
            
            // Add date
            const today = new Date();
            doc.setFontSize(10);
            doc.text(`Generated on: ${today.toLocaleDateString()}`, 14, 25);
            
            // Set font for content
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            
            // Create table headers
            const headers = ['ID', 'Name', 'Email', 'Department', 'Position'];
            const columnWidths = [20, 40, 50, 30, 30];
            
            // Draw table headers
            let x = 10;
            headers.forEach((header, index) => {
                doc.text(header, x, 35);
                x += columnWidths[index];
            });
            
            // Draw horizontal line
            doc.line(10, 37, 170, 37);
            
            // Add employee data
            let y = 45;
            filteredEmployees.forEach((employee, index) => {
                // Check if we need a new page
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                
                // Draw employee data
                x = 10;
                doc.text(employee.employeeId || 'N/A', x, y);
                x += columnWidths[0];
                
                doc.text(employee.name || 'N/A', x, y);
                x += columnWidths[1];
                
                doc.text(employee.email || 'N/A', x, y);
                x += columnWidths[2];
                
                doc.text(employee.department || 'N/A', x, y);
                x += columnWidths[3];
                
                doc.text(employee.position || 'N/A', x, y);
                
                // Draw horizontal line
                doc.line(10, y + 2, 170, y + 2);
                
                y += 10;
            });
            
            // Save the PDF
            doc.save('employee_list.pdf');
            toast.success('PDF downloaded successfully');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF');
        }
    };

    const handleEdit = (employee) => {
        // Format the date to yyyy-MM-dd for the input field
        const formattedEmployee = { ...employee };
        if (formattedEmployee.birthdate) {
            // Convert ISO date string to yyyy-MM-dd format
            const date = new Date(formattedEmployee.birthdate);
            formattedEmployee.birthdate = date.toISOString().split('T')[0];
        }
        
        setSelectedEmployee(employee);
        setFormData(formattedEmployee);
        setShowUpdateForm(true);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="employees-container">
            <div className="employees-header">
                <h1>Employee Management</h1>
                <div className="header-buttons">
                    <button className="download-button" onClick={handleDownloadPDF}>
                        Download PDF
                    </button>
                    <button className="add-button" onClick={() => setShowAddForm(true)}>
                        Add New Employee
                    </button>
                </div>
            </div>

            <div className="search-section">
                <div className="search-container">
                    <select 
                        className="search-type-select"
                        value={searchType}
                        onChange={handleSearchTypeChange}
                    >
                        <option value="name">Search by Name</option>
                        <option value="email">Search by Email</option>
                        <option value="department">Search by Department</option>
                        <option value="position">Search by Position</option>
                        <option value="employeeId">Search by Employee ID</option>
                    </select>
                    <input
                        type="text"
                        className="search-input"
                        placeholder={`Search by ${searchType}...`}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {(showAddForm || (showUpdateForm && selectedEmployee)) && (
                <div className="form-overlay">
                    <div className="form-container">
                        <h3>{showAddForm ? "Add New Employee" : "Update Employee"}</h3>
                        <form onSubmit={showAddForm ? handleSubmit : handleUpdate}>
                            <div className="form-group">
                                <label>Employee ID:</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!showAddForm}
                                />
                            </div>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>NIC:</label>
                                <input
                                    type="text"
                                    name="nic"
                                    value={formData.nic}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Mobile:</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Address:</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
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
                                <label>Position:</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Gender:</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Birthdate:</label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    value={formData.birthdate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-buttons">
                                <button type="submit">{showAddForm ? "Add Employee" : "Update Employee"}</button>
                                <button type="button" onClick={() => {
                                    setShowAddForm(false);
                                    setShowUpdateForm(false);
                                    resetForm();
                                }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="employees-table-container">
                <table className="employees-table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee) => (
                            <tr key={employee._id}>
                                <td>{employee.employeeId}</td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.department}</td>
                                <td>{employee.position}</td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(employee)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(employee._id)}
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

export default Employees;
