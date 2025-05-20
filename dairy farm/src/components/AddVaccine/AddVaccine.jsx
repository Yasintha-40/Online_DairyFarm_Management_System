import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import './AddVaccine.css';

function AddVaccine() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        vaccine_id: "",
        vaccine_name: "",
        disease_name: "",
        target: "Any",
        description: ""
    });
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
        setError(""); // Clear any previous errors
    };

    const validateInputs = () => {
        if (!inputs.vaccine_id.trim()) {
            setError("Vaccine ID is required");
            return false;
        }
        if (!inputs.vaccine_name.trim()) {
            setError("Vaccine name is required");
            return false;
        }
        if (!inputs.disease_name.trim()) {
            setError("Disease name is required");
            return false;
        }
        if (!['Three_Month', 'Six_Month', 'Any'].includes(inputs.target)) {
            setError("Invalid target value");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateInputs()) {
            return;
        }

        try {
            const response = await api.post("/vaccines", {
                vaccine_id: inputs.vaccine_id.trim(),
                vaccine_name: inputs.vaccine_name.trim(),
                disease_name: inputs.disease_name.trim(),
                target: inputs.target,
                description: inputs.description.trim()
            });

            if (response.data) {
                setSubmitSuccess(true);
                // Reset form
                setInputs({
                    vaccine_id: "",
                    vaccine_name: "",
                    disease_name: "",
                    target: "Any",
                    description: ""
                });
                // Navigate to vaccine details page after successful submission
                navigate('/vet/vaccinedetails');
            }
        } catch (error) {
            console.error("Error adding vaccine:", error);
            if (error.response?.status === 409) {
                setError("A vaccine with this ID already exists. Please use a different ID.");
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to add vaccine. Please try again.");
            }
        }
    };

    return (
        <div className="add-vaccine-container">
            <h1 className="title">Add Vaccines</h1>
            {submitSuccess && (
                <div className="success-message">
                    Vaccine added successfully!
                </div>
            )}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <form className="add-vaccine-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Vaccine ID:</label>
                    <input
                        type="text"
                        name="vaccine_id"
                        onChange={handleChange}
                        value={inputs.vaccine_id}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Vaccine Name:</label>
                    <input
                        type="text"
                        name="vaccine_name"
                        onChange={handleChange}
                        value={inputs.vaccine_name}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Disease Name:</label>
                    <input
                        type="text"
                        name="disease_name"
                        onChange={handleChange}
                        value={inputs.disease_name}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Target:</label>
                    <select
                        name="target"
                        onChange={handleChange}
                        value={inputs.target}
                        required
                    >
                        <option value="Three_Month">Three Month</option>
                        <option value="Six_Month">Six Month</option>
                        <option value="Any">Any</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        onChange={handleChange}
                        value={inputs.description}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </div>
    );
}

export default AddVaccine; 