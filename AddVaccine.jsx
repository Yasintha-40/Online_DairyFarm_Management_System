import React, {useState} from 'react'
import Nav from "../Nav/Nav";
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import'./AddVaccine.css';

function AddVaccine() {
    const history = useNavigate();
    const [inputs, setInputs] = useState({
        vaccine_id: "",
        vaccine_name: "",
        disease_name: "",
        target: "Any",
        description:"",
    });


    const handleChange = (e) =>{
        setInputs((prevState)=>({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e)=> {
        e.preventDefault();
        console.log(inputs);
        await sendRequest().then(()=>
        history('/vaccinedetails'));
    };

    const sendRequest = async()=>{
        await axios.post("http://localhost:5005/vaccines", {
          vaccine_id:String(inputs.vaccine_id),
          vaccine_name:String(inputs.vaccine_name),
          disease_name:String(inputs.disease_name),
          target:String(inputs.target),
          description:String(inputs.description),

        }).then(res => res.data);
    }

  return (
    <div>
      <Nav/>
    <div className="vaccines-container">
    <div className="add-vaccine-container">
      <h1 className="title">Add Vaccines</h1>
      <form className="add-vaccine-form" onSubmit={handleSubmit} autoComplete= "off">
      <div className="form-group">
          <label>Vaccine Id:</label>
          <input type="text" name="vaccine_id" onChange={handleChange} value={inputs.vaccine_id} required></input>
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
        
        <button className="submit-btn">Submit</button>
        
      </form>
    </div> 
    
    </div>
    <Footer/>
    </div>
  );
}

export default AddVaccine;
