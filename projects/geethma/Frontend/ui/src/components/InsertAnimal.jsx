import React, {useState} from 'react'
import "./InsertAnimal.css"
import axios from "axios";

const InsertAnimal = () => {
const [animalData, setAnimalData] = useState({
    breed: "",
    dob: "",
    weight: "",
    gender: "",
    health: "",
});
const [generatedId, setGeneratedId] = useState("");
const [error, setError] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);

const handleChange = (e) => {
    const { name, value } = e.target; 
    setAnimalData(prev => ({
        ...prev,
        [name]: value, 
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
        // Validate form data
        if (!animalData.breed || !animalData.dob || !animalData.weight || !animalData.gender || !animalData.health) {
            throw new Error("All fields are required");
        }

        // Format the data before sending
        const formattedData = {
            ...animalData,
            weight: animalData.weight.toString(), // Convert weight to string
            dob: new Date(animalData.dob).toISOString().split('T')[0] // Format date as YYYY-MM-DD
        };

        console.log('Submitting animal data:', formattedData); // Debug log
        
        const response = await axios.post("http://localhost:3000/api/animals", formattedData);
        console.log('Server response:', response.data); // Debug log
        
        setGeneratedId(response.data.animalid);
        setAnimalData({
            breed: "",
            dob: "",
            weight: "",
            gender: "",
            health: "",
        });
    } catch (error) {
        console.error('Error details:', error.response?.data || error.message); // Debug log
        if (error.response?.data?.details) {
            setError(error.response.data.details.join(', '));
        } else {
            setError(error.response?.data?.message || error.message || 'Error adding animal. Please try again.');
        }
    } finally {
        setIsSubmitting(false);
    }
};

return (
    <div>
        <h2>Animal Information Form</h2>
        {error && (
            <div className="error-message">
                {error}
            </div>
        )}
        {generatedId && (
            <div className="success-message">
                Animal added successfully! Animal ID: {generatedId}
            </div>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
            <label htmlFor="breed">Breed:</label>
            <input 
                type="text" 
                id="breed" 
                name="breed" 
                required 
                onChange={handleChange} 
                value={animalData.breed}
                placeholder="Enter breed"
                disabled={isSubmitting}
            />

            <label htmlFor="dob">Date of Birth:</label>
            <input 
                type="date" 
                id="dob" 
                name="dob" 
                required 
                onChange={handleChange} 
                value={animalData.dob}
                disabled={isSubmitting}
            />

            <label htmlFor="weight">Weight (kg):</label>
            <input 
                type="number" 
                id="weight" 
                name="weight" 
                step="0.1" 
                required 
                onChange={handleChange} 
                value={animalData.weight}
                placeholder="Enter weight"
                disabled={isSubmitting}
            />

            <label htmlFor="gender">Gender:</label>
            <select 
                id="gender" 
                name="gender" 
                required 
                onChange={handleChange} 
                value={animalData.gender}
                disabled={isSubmitting}
            >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>

            <label htmlFor="health">Health Status:</label>
            <select 
                id="health" 
                name="health" 
                required 
                onChange={handleChange} 
                value={animalData.health}
                disabled={isSubmitting}
            >
                <option value="">Select Health Status</option>
                <option value="Active">Active</option>
                <option value="Sick">Sick</option>
                <option value="Pregnant">Pregnant</option>
                <option value="Injured">Injured</option>
                <option value="Other">Other</option>
            </select>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    </div>
);
};

export default InsertAnimal;
