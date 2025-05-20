import React, { useEffect, useState } from 'react'
import {Link,useParams} from 'react-router-dom'
import axios from "axios";

function ShowAnimalDetails(){
    const[animals,setAnimals]=useState([]);
    const {id}=useParams();

    useEffect(() =>{
        axios
            .get(`http://localhost:3000/api/animals/${id}`)
            .then((res)=>{
                setAnimals(res.data);
            })
            .catch(()=>{
                console.log("Error from ShowBookDetails");
            });
    }, [id]);

    const TableItem = (
        <div>
            <table className="table table-hover table-dark">
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>ID</td>
                    <td>{animals.animalid}</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>BREED</td>
                    <td>{animals.breed}</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>D.O.B</td>
                    <td>{animals.dob}</td>
                </tr>
                <tr>
                    <th scope="row">4</th>
                    <td>WEIGHT</td>
                    <td>{animals.weight}</td>
                </tr>
                <tr>
                    <th scope="row">5</th>
                    <td>GENDER</td>
                    <td>{animals.gender}</td>
                </tr>
                <tr>
                    <th scope="row">6</th>
                    <td>HEALTH</td>
                    <td>{animals.health}</td>
                </tr>

            </tbody>
            </table>
        </div>
    );

    return (
        <div className="ShowAnimalDetails">
            <div className="col-md-10 m-auto"><br/>
            <Link to ={"/"} className='btn btn-outline-danger float-right'>
            Back to main</Link>
            </div>

            <br/>
            <div className="col-md-8 m-auto">
                <h1 className='display-6-bold text-center'>Animal details</h1>
                <p className='text-center'>This is full detail of animal</p>
                <hr />
                <br />
            </div>

            <div>
                <div className="col-md-10 m-auto">{TableItem}</div>
            </div>
            <div className="col-md-6 m-auto">
                <Link
                    to={`/updatedetails/${animals._id}`}
                    className="btn btn-outline-info btn-lg btn-block d-flex justify-content-center-center">
                        Edit Animal
                    </Link><br/>
            </div>
        </div>
    )
}

export default ShowAnimalDetails;

