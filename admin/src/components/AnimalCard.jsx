import React from 'react';
import { Link } from 'react-router-dom';
import './AnimalCard.css';

const AnimalCard = ({ animal, onEdit, onDelete }) => {
  // Default image for animals
  const defaultImage = "https://img.freepik.com/free-photo/cows-standing-green-field-front-fuji-mountain-japan_335224-197.jpg?uid=R190339105&ga=GA1.1.569604014.1741108132&semt=ais_hybrid";
  
  // Get image based on animal breed (you can customize this logic)
  const getAnimalImage = () => {
    if (animal.breed.toLowerCase().includes('cow')) {
      return "https://img.freepik.com/free-photo/cows-standing-green-field-front-fuji-mountain-japan_335224-197.jpg?uid=R190339105&ga=GA1.1.569604014.1741108132&semt=ais_hybrid";
    } else if (animal.breed.toLowerCase().includes('buffalo')) {
      return "https://img.freepik.com/free-photo/water-buffalo-standing-grass-field_181624-24525.jpg?w=740&t=st=1745300257~exp=1745303857~hmac=526f3d59db2c940a76075b56c10edcf0f05e66e71815684ef41c20b1fcb9d5d0";
    } else if (animal.breed.toLowerCase().includes('goat')) {
      return "https://img.freepik.com/free-photo/goat-standing-grass-field_181624-24526.jpg?w=740&t=st=1745300257~exp=1745303857~hmac=526f3d59db2c940a76075b56c10edcf0f05e66e71815684ef41c20b1fcb9d5d0";
    } else {
      return defaultImage;
    }
  };

  return (
    <div className="animal-card">
      <div className="animal-card-image">
        <img src={getAnimalImage()} alt={animal.breed} />
        <div className="animal-card-id">{animal.animalid}</div>
      </div>
      <div className="animal-card-content">
        <h3 className="animal-card-title">{animal.breed}</h3>
        <div className="animal-card-details">
          <div className="animal-card-detail">
            <span className="detail-label">Date of Birth:</span>
            <span className="detail-value">{animal.dob}</span>
          </div>
          <div className="animal-card-detail">
            <span className="detail-label">Weight:</span>
            <span className="detail-value">{animal.weight} kg</span>
          </div>
          <div className="animal-card-detail">
            <span className="detail-label">Gender:</span>
            <span className="detail-value">{animal.gender}</span>
          </div>
          <div className="animal-card-detail">
            <span className="detail-label">Health:</span>
            <span className={`detail-value health-status ${animal.health.toLowerCase()}`}>
              {animal.health}
            </span>
          </div>
        </div>
        <div className="animal-card-actions">
          <button 
            className="edit-button"
            onClick={() => onEdit(animal)}
          >
            Edit
          </button>
          <button 
            className="delete-button"
            onClick={() => onDelete(animal._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard; 