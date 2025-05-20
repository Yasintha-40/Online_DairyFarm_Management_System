import React, {useState,useEffect} from "react";
import axios from "axios";
import {Link,useParams,useNavigate} from "react-router-dom"

function UpdateAnimal(){
    const[animal,setAnimals]=useState({
        animalid:"",
        breed:"",
        dob:"",
        weight:"",
        gender:"",
        health:"",
    });
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        axios
            .get(`http://localhost:3000/api/animals/${id}`)
            .then((res)=>{
                setAnimals({
                    animalid: res.data.animalid,
                    breed: res.data.breed,
                    dob: res.data.dob,
                    weight: res.data.weight,
                    gender: res.data.gender,
                    health: res.data.health,
                });
            })
            .catch((err)=>{
                console.log("error from update employee",err);
            });
    }, [id]);

    const onChange =(e)=>{
        console.log(e.target.value)
        setAnimals({...animal,[e.target.name]: e.target.value});
    };
    const onSubmit = (e)=>{
        e.preventDefault();

        const data={
            animalid:animal.animalid,
            breed:animal.breed,
            dob:animal.dob,
            weight:animal.weight,
            gender:animal.gender,
            health:animal.health,
        };
        axios
            .put(`http://localhost:3000/api/animals/${id}`,data)
            .then((res)=>{
                navigate(`/showdetails/${id}`)
            })
            .catch((err)=>{
                console.log("Error in update");
            });
    };
    return(
        <div>
            <div className="Updateemployee">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <br/>
                            <Link to="/" className="btn btn-outline-warning float-left">
                            Show Animal List
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-8 m-auto">
                        <form noValidate onSubmit={onSubmit}>

                            <div className="form-group">
                                <label htmlFor="title">Animal ID</label>
                                <input
                                    type="text"
                                    placeholder="Animal ID"
                                    name="animalid"
                                    className="form-control"
                                    value={animal.animalid}
                                    readOnly
                                    disabled
                                    style={{ backgroundColor: '#e9ecef' }} />

                            </div>
                            <br/>

                            <div className="form-group">
                                <label htmlFor="author">Breed</label>
                                <input
                                    type = "text"
                                    placeholder="breed"
                                    name="breed"
                                    className="from-control"
                                    value={animal.breed}
                                    onChange={onChange} />
                                    
                            </div>
                            <br/>

                            <div className="form-group">
                                <label htmlFor="author">Date of birth</label>
                                <input
                                    type = "text"
                                    placeholder="dob"
                                    name="dob"
                                    className="form-control"
                                    value={animal.dob}
                                    onChange={onChange} />
                                    
                            </div>
                            <br/>

                            <div className="form-group">
                                <label htmlFor="author">Weight</label>
                                <input
                                    type = "text"
                                    placeholder="weight"
                                    name="weight"
                                    className="from-control"
                                    value={animal.weight}
                                    onChange={onChange} />
                                    
                            </div>
                            <br/>

                            <div className="form-group">
                                <label htmlFor="author">Gender</label>
                                <select
                                    name="gender"
                                    className="form-control"
                                    value={animal.gender}
                                    onChange={onChange}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <br/>

                            <div className="form-group">
                                <label htmlFor="author">Health</label>
                                <input
                                    type = "text"
                                    placeholder="health"
                                    name="health"
                                    className="from-control"
                                    value={animal.health}
                                    onChange={onChange} />
                                    
                            </div>
                            <br/>

                            <button
                                type="submit"
                                className="btn btn-outline-info btn-lg btn-block">
                                    Update animal
                                </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateAnimal;