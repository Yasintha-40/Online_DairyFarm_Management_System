import React, { useEffect, useState } from 'react';
import './Users.css';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Users = ({ url }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/user/all");
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching users");
    }
  };

  const updateUserHandler = async (index, field, value) => {
    const updatedUsers = [...users];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
  };

  const saveUserHandler = async (user) => {
    try {
      const response = await api.put("/api/user/admin/update", {
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      });
      if (response.data.success) {
        toast.success("User updated successfully");
        fetchUsers();
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating user");
    }
  };

  const deleteUserHandler = async (userId) => {
    try {
      const response = await api.post("/api/user/admin/delete", { userId });
      if (response.data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting user");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const searchValue = searchTerm.toLowerCase();
    switch (searchType) {
      case 'name':
        return user.name.toLowerCase().includes(searchValue);
      case 'email':
        return user.email.toLowerCase().includes(searchValue);
      case 'phone':
        return user.phone.toLowerCase().includes(searchValue);
      case 'role':
        return user.role.toLowerCase().includes(searchValue);
      default:
        return true;
    }
  });

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('Users List', 14, 15);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
      
      // Create table
      const tableColumn = ["Name", "Email", "Phone", "Role"];
      const tableRows = filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone,
        user.role
      ]);
      
      // Use autoTable as a standalone function
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] },
        margin: { top: 35 }
      });
      
      // Save the PDF
      doc.save('users-list.pdf');
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users">
      <h3>Users Management</h3>
      
      <div className="search-section">
        <div className="search-container">
          <select 
            className="search-type-select"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <option value="name">Search by Name</option>
            <option value="email">Search by Email</option>
            <option value="phone">Search by Phone</option>
            <option value="role">Search by Role</option>
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
      
      <div className="user-list">
        {filteredUsers.map((user, index) => (
          <div key={user._id} className="user-item">
            <input value={user.name} onChange={(e) => updateUserHandler(index, "name", e.target.value)} />
            <input value={user.email} onChange={(e) => updateUserHandler(index, "email", e.target.value)} />
            <input value={user.phone} onChange={(e) => updateUserHandler(index, "phone", e.target.value)} />
            <select value={user.role} onChange={(e) => updateUserHandler(index, "role", e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="vet">Veterinery</option>
            </select>
            <button onClick={() => saveUserHandler(user)}>Save</button>
            <button onClick={() => deleteUserHandler(user._id)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="download-section">
        <button className="download-btn" onClick={downloadPDF}>
          Download Users List (PDF)
        </button>
      </div>
    </div>
  );
};

export default Users;
