import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Vaccine.css';



function Vaccine({ vaccine, onDelete }) {
  const {_id,vaccine_id,vaccine_name,disease_name,target,description} = vaccine;

  

  const deleteHandler = async() => {
    try {
      await axios.delete(`http://localhost:5005/vaccines/${_id}`);
      onDelete(_id); // Remove the deleted user from the UI
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  
  
  return (
    <div className="vaccine-card">
      <h2 className="vaccine-title">Vaccine ID: {vaccine_id}</h2>
      <div className="vaccine-info">
        <p><strong>Vaccine Name:</strong> {vaccine_name}</p>
        <p><strong>Disease Name:</strong> {disease_name}</p>
        <p><strong>Target:</strong> {target}</p>
        <p><strong>Description:</strong> {description}</p>
      </div>
      <div className="vaccine-actions">
        <Link to={`/vaccinedetails/${_id}`} className="update-link">Update</Link>
        <button onClick={deleteHandler} className="delete-btn">Delete</button>
      </div>
    </div> 
  )
}

export default Vaccine
