import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Cow.css';



function Cow({ cow, onDelete, dayCount }) {
  const {_id,animal_id,status,disease_name,vaccine_name,vaccination_date} = cow;

  

  const deleteHandler = async() => {
    try {
      await axios.delete(`http://localhost:5005/cows/${_id}`);
      onDelete(_id); // Remove the deleted user from the UI
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  
  
  return (
    <div className="cow-card">
      <h2 className="cow-title">Animal ID: {animal_id}</h2>
      <div className="cow-info">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Disease Name:</strong> {disease_name}</p>
        <p><strong>Vaccine Name:</strong> {vaccine_name}</p>
        <p><strong>Vaccination Date:</strong> {vaccination_date}</p>
        {dayCount !== undefined && (
          <p><strong>Days Since Vaccination:</strong> {dayCount} day(s)</p>
        )}
        
      </div>
      <div className="cow-actions">
        <Link to={`/cowdetails/${_id}`} className="update-link">Update</Link>
        <button onClick={deleteHandler} className="delete-btn">Delete</button>
      </div>
    </div> 
  )
}

export default Cow
