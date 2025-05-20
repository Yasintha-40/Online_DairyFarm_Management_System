import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddCow.css';

function AddCow() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        animal_id: "",
        status: "Healthy",
        disease_name: "",
        vaccine_name: "",
        vaccination_date:"",
    });

    const [vaccineOptions, setVaccineOptions] = useState([]);
    const [idOption, setIdOption] = useState("Select");
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Fetch vaccines from backend
    useEffect(() => {
      const fetchVaccines = async () => {
        try {
          const response = await axios.get("http://localhost:4000/vaccines");
          setVaccineOptions(response.data.vaccines);
        } catch (error) {
          console.error("Error fetching vaccines:", error);
        }
      };
  
      fetchVaccines();
    }, []);

    // Handle changes in ID dropdown
    const handleIdOptionChange = (e) => {
      const value = e.target.value;
      setIdOption(value);

      // Nested if-else to set animal_id
      if (value === "3 Months") {
        setInputs((prev) => ({ ...prev, animal_id: "3 Months" }));
      } else if (value === "6 Months") {
        setInputs((prev) => ({ ...prev, animal_id: "6 Months" }));
      } else if (value === "Heard") {
        setInputs((prev) => ({ ...prev, animal_id: "Heard" }));
      } else {
        setInputs((prev) => ({ ...prev, animal_id: "" }));
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "animal_id" && idOption !== "Select") return;
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post("http://localhost:4000/cows", {
          animal_id: String(inputs.animal_id),
          status: String(inputs.status),
          disease_name: String(inputs.disease_name),
          vaccine_name: String(inputs.vaccine_name),
          vaccination_date: String(inputs.vaccination_date),
        });
        setSubmitSuccess(true);
        // Reset form
        setInputs({
          animal_id: "",
          status: "Healthy",
          disease_name: "",
          vaccine_name: "",
          vaccination_date: "",
        });
        setIdOption("Select");
        // Navigate to cow details page after successful submission
        navigate('/vet/cowdetails');
      } catch (error) {
        console.error("Error adding cow:", error);
        alert("Failed to add cow. Please try again.");
      }
    };

    return (
      <div className="add-cow-container">
        <h1 className="title">Add Sick Animals</h1>
        {submitSuccess && (
          <div className="success-message">
            Animal added successfully!
          </div>
        )}
        <form className="add-cow-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Animal ID Option:</label>
            <select value={idOption} onChange={handleIdOptionChange}>
              <option value="Select">Select</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="Heard">Heard</option>
            </select>
          </div>
          <div className="form-group">
            <label>Animal ID:</label>
            <input
              type="text"
              name="animal_id"
              onChange={handleChange}
              value={inputs.animal_id}
              required
              disabled={idOption !== "Select"}
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select name="status" onChange={handleChange} value={inputs.status} required>
              <option value="Healthy">Healthy</option>
              <option value="Sick">Sick</option>
              <option value="Recovered">Recovered</option>
              <option value="Vaccinated">Vaccinated</option>
            </select>
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
            <label>Vaccine Name:</label>
            <select name="vaccine_name" onChange={handleChange} value={inputs.vaccine_name} required>
              <option value="">Select Vaccine</option>
              {vaccineOptions.map((vaccine, index) => (
                <option key={index} value={vaccine.vaccine_name}>
                  {vaccine.vaccine_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Vaccination Date:</label>
            <input
              type="date"
              name="vaccination_date"
              onChange={handleChange}
              value={inputs.vaccination_date}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    );
}

export default AddCow; 