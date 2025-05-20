import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../../utils/axios';
import './AnimalServices.css';

const AnimalServices = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const animalId = queryParams.get('animalId');
  
  const [animalServices, setAnimalServices] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    animalId: animalId || '',
    dob: '',
    age: '',
    serviceType: 'Veterinary Checkup',
    status: 'Pending',
    notes: ''
  });
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('animalId');

  useEffect(() => {
    fetchAnimalServices();
    fetchAnimals();
  }, [animalId]);

  const fetchAnimalServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/animal-services');
      let filteredServices = response.data;
      
      if (animalId) {
        filteredServices = filteredServices.filter(service => service.animalId === animalId);
      }
      
      setAnimalServices(filteredServices);
      setError(null);
    } catch (err) {
      setError('Failed to fetch animal services. Please try again later.');
      console.error('Error fetching animal services:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimals = async () => {
    try {
      const response = await api.get('/api/animals');
      setAnimals(response.data);
    } catch (err) {
      console.error('Error fetching animals:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchTerm('');
  };

  const filteredServices = animalServices.filter(service => {
    const searchValue = searchTerm.toLowerCase();
    switch (searchType) {
      case 'animalId':
        return service.animalId.toLowerCase().includes(searchValue);
      case 'serviceId':
        return service.serviceId.toString().includes(searchValue);
      case 'age':
        return service.age.toLowerCase().includes(searchValue);
      case 'serviceType':
        return service.serviceType.toLowerCase().includes(searchValue);
      case 'status':
        return (service.status || 'Pending').toLowerCase().includes(searchValue);
      default:
        return true;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.patch(`/api/animal-services/${editingService._id}`, formData);
        setEditingService(null);
      } else {
        await api.post('/api/animal-services', formData);
      }
      fetchAnimalServices();
      setFormData({
        animalId: animalId || '',
        dob: '',
        age: '',
        serviceType: 'Veterinary Checkup',
        status: 'Pending',
        notes: ''
      });
      setIsAddingService(false);
    } catch (err) {
      setError('Failed to save animal service. Please try again.');
      console.error('Error saving animal service:', err);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      animalId: service.animalId,
      dob: service.dob.split('T')[0],
      age: service.age,
      serviceType: service.serviceType,
      status: service.status || 'Pending',
      notes: service.notes || ''
    });
    setIsAddingService(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/api/animal-services/${id}`);
        fetchAnimalServices();
      } catch (err) {
        setError('Failed to delete animal service. Please try again.');
        console.error('Error deleting animal service:', err);
      }
    }
  };

  const cancelForm = () => {
    setFormData({
      animalId: animalId || '',
      dob: '',
      age: '',
      serviceType: 'Veterinary Checkup',
      status: 'Pending',
      notes: ''
    });
    setIsAddingService(false);
    setEditingService(null);
  };

  const getAnimalName = (animalId) => {
    const animal = animals.find(a => a.animalid === animalId);
    return animal ? `${animal.animalid} - ${animal.breed}` : animalId;
  };

  const handleCopyAndWhatsApp = (service) => {
    const animal = animals.find(a => a.animalid === service.animalId);
    const animalName = animal ? `${animal.animalid} - ${animal.breed}` : service.animalId;
    const serviceDate = new Date(service.dob).toLocaleDateString();
    
    const message = `Animal Service Details:\nAnimal: ${animalName}\nDate: ${serviceDate}\nAge: ${service.age}\nService Type: ${service.serviceType}\nStatus: ${service.status}\nNotes: ${service.notes || 'No notes'}`;
    
    navigator.clipboard.writeText(message)
      .then(() => {
        setSuccessMessage('Service details copied to clipboard');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        setError('Failed to copy service details. Please try again.');
      });
  };

  if (loading) {
    return <div className="loading">Loading animal services...</div>;
  }

  return (
    <div className="animal-services-container">
      <h1>Animal Service Management</h1>
      
      {animalId && (
        <div className="animal-info">
          <h2>Services for Animal: {getAnimalName(animalId)}</h2>
          <Link to="/admin/animals" className="back-button">Back to Animals</Link>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="animal-services-header">
        <h2>{editingService ? 'Edit Animal Service' : 'Animal Services List'}</h2>
        {!isAddingService && (
          <button 
            className="add-button"
            onClick={() => setIsAddingService(true)}
          >
            Add New Service
          </button>
        )}
      </div>

      {isAddingService && (
        <div className="animal-service-form-container">
          <h3>{editingService ? 'Edit Animal Service' : 'Add New Animal Service'}</h3>
          <form onSubmit={handleSubmit} className="animal-service-form">
            <div className="form-group">
              <label htmlFor="animalId">Animal</label>
              <select
                id="animalId"
                name="animalId"
                value={formData.animalId}
                onChange={handleInputChange}
                required
                disabled={!!animalId}
              >
                <option value="">Select Animal</option>
                {animals.map(animal => (
                  <option key={animal._id} value={animal.animalid}>
                    {animal.animalid} - {animal.breed}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="dob">Date of Service</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                placeholder="e.g., 2 years 3 months"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="serviceType">Service Type</label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                required
              >
                <option value="Veterinary Checkup">Veterinary Checkup</option>
                <option value="Hoof Check">Hoof Check</option>
                <option value="Breeding Check">Breeding Check</option>
                <option value="Tag Check">Tag Check</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
                placeholder="Additional notes about the service"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-button">
                {editingService ? 'Update' : 'Save'}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={cancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!isAddingService && (
        <div className="animal-services-list">
          <div className="search-section">
            <div className="search-container">
              <select 
                className="search-type-select"
                value={searchType} 
                onChange={handleSearchTypeChange}
              >
                <option value="animalId">Search by Animal ID</option>
                <option value="serviceId">Search by Service ID</option>
                <option value="age">Search by Age</option>
                <option value="serviceType">Search by Service Type</option>
                <option value="status">Search by Status</option>
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
          
          {filteredServices.length === 0 ? (
            <p>No animal services found. Add your first service!</p>
          ) : (
            <table className="animal-services-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Animal</th>
                  <th>Date</th>
                  <th>Age</th>
                  <th>Service Type</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service._id}>
                    <td>{service.serviceId}</td>
                    <td>{getAnimalName(service.animalId)}</td>
                    <td>{new Date(service.dob).toLocaleDateString()}</td>
                    <td>{service.age}</td>
                    <td>{service.serviceType}</td>
                    <td>
                      <span className={`status-badge ${service.status?.toLowerCase().replace(' ', '-') || 'pending'}`}>
                        {service.status || 'Pending'}
                      </span>
                    </td>
                    <td>{service.notes || '-'}</td>
                    <td className="action-buttons">
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(service)}
                        title="Edit Service"
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button 
                        className="whatsapp-button"
                        onClick={() => handleCopyAndWhatsApp(service)}
                        title="Copy & WhatsApp"
                      >
                        <i className="fab fa-whatsapp"></i> WhatsApp
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(service._id)}
                        title="Delete Service"
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimalServices; 