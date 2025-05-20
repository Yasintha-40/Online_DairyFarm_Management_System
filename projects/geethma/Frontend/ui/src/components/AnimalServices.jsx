import React, { useState } from 'react';
import axios from 'axios';

const AnimalServices = () => {
  const [formData, setFormData] = useState({
    animalId: '',
    dob: '',  // Date of Birth field
    age: '',  // Age field
    serviceType: '',
    notes: '',
    status: 'Pending'  // Default status
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to calculate age based on DOB
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    const day = today.getDate() - birthDate.getDate();
  
    // If birth month/day hasn't passed yet this year
    if (month < 0 || (month === 0 && day < 0)) {
      age--;
    }

    // Calculate months for animals under 1 year
    if (age < 1) {
      let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                  (today.getMonth() - birthDate.getMonth());
      
      // Adjust for days
      if (day < 0) {
        months--;
      }
      
      // Ensure months is positive
      months = Math.abs(months);
      
      return `${months} months`;
    }
  
    return age;
  };

  // Handle change for DOB field and automatically update the age field
  const handleDobChange = (e) => {
    const dob = e.target.value;
    const age = calculateAge(dob);
    setFormData({ ...formData, dob, age });  // Update both dob and calculated age
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Basic validation
      if (!formData.animalId) {
        alert('Please enter an Animal ID');
        return;
      }

      if (!formData.dob) {
        alert('Please select a Date of Birth');
        return;
      }

      if (!formData.serviceType) {
        alert('Please select a Service Type');
        return;
      }

      // Format the date properly
      const formattedData = {
        ...formData,
        dob: new Date(formData.dob).toISOString(),
        age: formData.age.toString(), // Ensure age is sent as a string
        status: formData.status // Include status in the request
      };

      const response = await axios.post('http://localhost:3000/api/animal-services', formattedData);
      alert(`Animal service added successfully! Service ID: ${response.data.serviceId}`);
      setFormData({ animalId: '', dob: '', age: '', serviceType: '', notes: '', status: 'Pending' });
    } catch (error) {
      console.error('Error adding animal service:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else if (error.response && error.response.data && error.response.data.details) {
        alert(`Validation Error: ${error.response.data.details.join(', ')}`);
      } else {
        alert('Error adding animal service. Please check all fields and try again.');
      }
    }
  };

  return (
    <div 
      style={{
        backgroundImage: `url('https://img.freepik.com/free-photo/herd-black-white-cows-grassland_53876-146257.jpg?t=st=1745300257~exp=1745303857~hmac=526f3d59db2c940a76075b56c10edcf0f05e66e71815684ef41c20b1fcb9d5d0&w=740')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <form 
        onSubmit={handleSubmit}
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '30px',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          boxShadow: '0 0 15px rgba(0,0,0,0.2)'
        }}
        autoComplete="off"
      >
        <h1 style={{ textAlign: 'center' }}>Animal Services</h1>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="animalId" style={{ minWidth: '130px', marginRight: '10px' }}>Animal ID:</label>
          <input 
            type="text" 
            className="form-control"
            id="animalId"
            name="animalId" 
            value={formData.animalId} 
            onChange={handleChange} 
            required 
            autoComplete="off"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="dob" style={{ minWidth: '130px', marginRight: '10px' }}>DOB:</label>
          <input 
            type="date" 
            className="form-control" 
            id="dob"
            name="dob" 
            value={formData.dob} 
            onChange={handleDobChange}  // Handle change for DOB and calculate age
            required 
            autoComplete="off"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="age" style={{ minWidth: '130px', marginRight: '10px' }}>Age:</label>
          <input 
            type="text" 
            className="form-control" 
            id="age"
            name="age"
            value={formData.age} 
            readOnly  // Prevent user from manually changing age
            autoComplete="off"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="serviceType" style={{ minWidth: '130px', marginRight: '10px' }}>Service Type:</label>
          <select 
            className="form-select" 
            name="serviceType" 
            id="serviceType"
            value={formData.serviceType} 
            onChange={handleChange} 
            required
            autoComplete="off"
          >
            <option value="">Select Service</option>
            <option value="Veterinary Checkup">Veterinary Checkup</option>
            <option value="Hoof Check">Hoof Check</option>
            <option value="Breeding Check">Breeding Check</option>
            <option value="Tag Check">Tag Check</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="status" style={{ minWidth: '130px', marginRight: '10px' }}>Status:</label>
          <select 
            className="form-select" 
            name="status" 
            id="status"
            value={formData.status} 
            onChange={handleChange} 
            required
            autoComplete="off"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="notes" style={{ minWidth: '130px', marginRight: '10px' }}>Notes:</label>
          <input 
            type="text" 
            className="form-control" 
            id="notes" 
            name="notes" 
            value={formData.notes} 
            onChange={handleChange} 
            placeholder="Extra details (optional)"
            autoComplete="off"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Add Service</button>
      </form>
    </div>
  );
};

export default AnimalServices;
