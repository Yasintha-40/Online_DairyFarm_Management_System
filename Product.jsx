import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import"./Product.css";


function Product(props) {
  const{_id,ProductId,ProductName,ProductCategory,ProductDescription,ProductPrice,ProductQuantity,ManufactureDate,ExpireDate,ImageURL} =  props.products;

  const history = useNavigate();

  const deleteHandler = async()=>{
    const userConfirmed = window.confirm(
      "Are you sure you want to delete This Product?"
    );
    
    if(userConfirmed){
    try{
     await axios.delete(`http://localhost:5000/products/${_id}`)
     window.alert("Product details Deleted Succefully!");
     history("/productdetails");
     window.location.reload();
    }catch(error){
     console.error("Error deleting Products details:",error);
    }

    }
  };
  return (
    <div className= "product-container">
      <h1>Product Display</h1>
      <br></br>
      <h1>ID:{_id}</h1>
      <h1>ProductId:{ProductId}</h1>
      <h1>ProductName:{ProductName}</h1>
      <h1>ProductCategory:{ProductCategory}</h1>
      <h1>ProductDescription:{ProductDescription}</h1>
      <h1>ProductPrice:{ProductPrice}</h1>
      <h1>ProductQuantity:{ProductQuantity}</h1>
      <h1>ManufactureDate:{ManufactureDate}</h1>
      <h1>ExpireDate:{ExpireDate}</h1>
      <h1>ImageURL:{ImageURL}</h1>
      <Link to={`/productsdetails/${_id}`}><button>Update</button></Link>
      <button onClick={deleteHandler}>Delete</button>
      <br></br><br></br><br></br>
    </div>
  )
}

export default Product
