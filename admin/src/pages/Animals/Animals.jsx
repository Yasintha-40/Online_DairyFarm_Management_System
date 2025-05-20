import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import AnimalCard from '../../components/AnimalCard';
import './Animals.css';

const Animals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    breed: '',
    dob: '',
    weight: '',
    gender: 'Male',
    health: ''
  });
  const [isAddingAnimal, setIsAddingAnimal] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('breed');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/animals');
      setAnimals(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch animals. Please try again later.');
      console.error('Error fetching animals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAnimal) {
        await api.put(`/api/animals/${editingAnimal._id}`, formData);
        setEditingAnimal(null);
      } else {
        await api.post('/api/animals', formData);
      }
      fetchAnimals();
      setFormData({
        breed: '',
        dob: '',
        weight: '',
        gender: 'Male',
        health: ''
      });
      setIsAddingAnimal(false);
    } catch (err) {
      setError('Failed to save animal. Please try again.');
      console.error('Error saving animal:', err);
    }
  };

  const handleEdit = (animal) => {
    setEditingAnimal(animal);
    setFormData({
      breed: animal.breed,
      dob: animal.dob,
      weight: animal.weight,
      gender: animal.gender,
      health: animal.health
    });
    setIsAddingAnimal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      try {
        await api.delete(`/api/animals/${id}`);
        fetchAnimals();
      } catch (err) {
        setError('Failed to delete animal. Please try again.');
        console.error('Error deleting animal:', err);
      }
    }
  };

  const cancelForm = () => {
    setFormData({
      breed: '',
      dob: '',
      weight: '',
      gender: 'Male',
      health: ''
    });
    setIsAddingAnimal(false);
    setEditingAnimal(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const filteredAnimals = animals.filter(animal => {
    const searchValue = searchTerm.toLowerCase();
    switch (searchType) {
      case 'breed':
        return animal.breed.toLowerCase().includes(searchValue);
      case 'gender':
        return animal.gender.toLowerCase().includes(searchValue);
      case 'healthStatus':
        return animal.healthStatus.toLowerCase().includes(searchValue);
      case 'animalid':
        return animal.animalid.toLowerCase().includes(searchValue);
      default:
        return true;
    }
  });

  if (loading) {
    return <div className="loading">Loading animals...</div>;
  }

  return (
    <div className="animals-container">
      <h1>Animal Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="animals-header">
        <h2>{editingAnimal ? 'Edit Animal' : 'Animals List'}</h2>
        {!isAddingAnimal && (
          <button 
            className="add-button"
            onClick={() => setIsAddingAnimal(true)}
          >
            Add New Animal
          </button>
        )}
      </div>

      <div className="search-section">
        <div className="search-container">
          <select 
            className="search-type-select"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <option value="breed">Search by Breed</option>
            <option value="gender">Search by Gender</option>
            <option value="healthStatus">Search by Health Status</option>
            <option value="animalid">Search by ID</option>
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

      {isAddingAnimal && (
        <div className="animal-form-container">
          <h3>{editingAnimal ? 'Edit Animal' : 'Add New Animal'}</h3>
          <form onSubmit={handleSubmit} className="animal-form">
            <div className="form-group">
              <label htmlFor="breed">Breed</label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
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
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="text"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="health">Health Status</label>
              <select
                id="health"
                name="health"
                value={formData.health}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Health Status</option>
                <option value="Active">Active</option>
                <option value="Sick">Sick</option>
                <option value="Pregnant">Pregnant</option>
                <option value="Injured">Injured</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-button">
                {editingAnimal ? 'Update' : 'Save'}
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

      {!isAddingAnimal && (
        <div className="animals-list">
          {filteredAnimals.length === 0 ? (
            <p>No animals found. Add your first animal!</p>
          ) : (
            <div className="animals-grid">
              {filteredAnimals.map((animal) => (
                <AnimalCard 
                  key={animal._id} 
                  animal={animal} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Animals; 