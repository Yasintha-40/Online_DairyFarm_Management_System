import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './UpdateVaccine.css';



function UpdateVaccine() {

  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(()=>{
    const fetchHndler = async()=>{
      await axios
      .get(`http://localhost:5005/vaccines/${id}`)
      .then ((res)=> res.data)
      .then ((data)=> setInputs(data.vaccine));
    };
    fetchHndler();
  },[id]);
  const sendRequest = async () =>{
    await axios
    .put(`http://localhost:5005/vaccines/${id}`,{
      vaccine_id:String(inputs.vaccine_id),
      vaccine_name:String(inputs.vaccine_name),
      disease_name:String(inputs.disease_name),
      target:String(inputs.target),
      description:String(inputs.description),
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
    history('/vaccinedetails'));
  };

  

  return (
    
    <div className="update-container">
        <h1 className="title">Update Animal Health Information</h1>
        <form onSubmit={handleSubmit} className="update-form" autoComplete= "off">
        <div className="form-group">
          <label>Vaccine Id:</label>
          <input type="text" name="vaccine_id"  value={inputs.vaccine_id}  readonly required></input>
        </div>
        <div className="form-group">
          <label>Vaccine Name:</label>
          <input type="text" name="vaccine_name" onChange={handleChange} value={inputs.vaccine_name} required></input>
        </div>
        <div className="form-group">
          <label>Disease Name:</label>
          <input type="text" name="disease_name" onChange={handleChange} value={inputs.disease_name} required></input>
        </div>
        <div className="form-group">
          <label>Target:</label>
          <select name="target" onChange={handleChange} value={inputs.target} required>
            <option value="Three_Month">Three_Month</option>
            <option value="Six_Month">Six_Month</option>
            <option value="Any">Any</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input type="text" name="description" onChange={handleChange} value={inputs.description} required></input>
        </div>
        
          <button className="submit-btn">Update</button>
        
      </form>
      
    </div>
    
    
  )
}

export default UpdateVaccine;
