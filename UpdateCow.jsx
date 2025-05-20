import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './UpdateCow.css';



function UpdateCow() {

  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(()=>{
    const fetchHndler = async()=>{
      await axios
      .get(`http://localhost:5005/cows/${id}`)
      .then ((res)=> res.data)
      .then ((data)=> setInputs(data.cow));
    };
    fetchHndler();
    
  },[id]);

  const [vaccineOptions, setVaccineOptions] = useState([]);

    // Fetch vaccines from backend
    useEffect(() => {
      const fetchVaccines = async () => {
        try {
          const response = await axios.get("http://localhost:5005/vaccines");
          setVaccineOptions(response.data.vaccines); // expects { vaccines: [...] }
        } catch (error) {
          console.error("Error fetching vaccines:", error);
        }
      };
  
      fetchVaccines();
    }, []);

  const sendRequest = async () =>{
    await axios
    .put(`http://localhost:5005/cows/${id}`,{
      animal_id:String(inputs.animal_id),
      status:String(inputs.status),
      disease_name:String(inputs.disease_name),
      vaccine_name:String(inputs.vaccine_name),
      vaccination_date: String(inputs.vaccination_date),
    })
    .then((res) => res.data);
  };
  const handleChange = (e) =>{
    setInputs((prevState)=>({
        ...prevState,
        [e.target.name]: e.target.value,
    }));
};

  const handleSubmit = async (e)=> {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(()=>
    history('/cowdetails'));
  };

  

  return (
    
    <div className="update-container">
        <h1 className="title">Update Animal Health Information</h1>
        <form onSubmit={handleSubmit} className="update-form" autoComplete= "off">
        <div className="form-group">
          <label>Animal Id:</label>
          <input type="text" name="animal_id"  value={inputs.animal_id} readonly required></input>
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
          <input type="text" name="disease_name" onChange={handleChange} value={inputs.disease_name} required></input>
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
          <input type="Date" name="vaccination_date" onChange={handleChange} value={inputs.vaccination_date} required></input>
        </div>
        
          <button className="submit-btn">Update</button>
        
      </form>
      
    </div>
    
    
  )
}

export default UpdateCow;
