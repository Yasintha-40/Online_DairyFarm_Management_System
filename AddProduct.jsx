import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import { useNavigate } from "react-router";
import axios from 'axios';
import "./AddProduct.css";

function AddProduct() {
    const history = useNavigate();
    const [inputs, setInputs] = useState({
        ProductId: "",
        ProductName: "",
        ProductCategory: "",
        ProductDescription: "",
        ProductPrice: "",
        ProductQuantity: "",
        ManufactureDate: "",
        ExpireDate: "",
        ImageURL: "",
    });

    // Handle change for all inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Prevent negative values for ProductId, ProductPrice, and ProductQuantity
        if ((name === "ProductId" || name === "ProductPrice" || name === "ProductQuantity") && value < 0) {
            return;  // Don't update state if value is negative
        }

        setInputs((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs);
        await sendRequest();
        window.alert("Product Added Successfully!");
        history('/productsdetails');
    };

    // Send the POST request to backend
    const sendRequest = async () => {
        await axios.post("http://localhost:5000/products", {
            ProductId: Number(inputs.ProductId),
            ProductName: String(inputs.ProductName),
            ProductCategory: String(inputs.ProductCategory),
            ProductDescription: String(inputs.ProductDescription),
            ProductPrice: Number(inputs.ProductPrice),
            ProductQuantity: Number(inputs.ProductQuantity),
            ManufactureDate: new Date(inputs.ManufactureDate),
            ExpireDate: new Date(inputs.ExpireDate),
            ImageURL: String(inputs.ImageURL),
        }).then(res => res.data);
    };

    return (
        <div className="Addproduct-container">
            <h1>Add Product</h1>

            <form onSubmit={handleSubmit}>
                <label>Product ID</label>
                <input type="number" name="ProductId" onChange={handleChange} value={inputs.ProductId} required /><br /><br />

                <label>Product Name</label>
                <input type="text" name="ProductName" onChange={handleChange} value={inputs.ProductName} required /><br /><br />

                <label>Product Category</label>
                <input type="text" name="ProductCategory" onChange={handleChange} value={inputs.ProductCategory} required /><br /><br />

                <label>Product Description</label>
                <input type="text" name="ProductDescription" onChange={handleChange} value={inputs.ProductDescription} required /><br /><br />

                <label>Product Price</label>
                <input type="number" name="ProductPrice" onChange={handleChange} value={inputs.ProductPrice} required /><br /><br />

                <label>Product Quantity</label>
                <input type="number" name="ProductQuantity" onChange={handleChange} value={inputs.ProductQuantity} required /><br /><br />

                <label>Manufacture Date</label>
                <input type="date" name="ManufactureDate" onChange={handleChange} value={inputs.ManufactureDate} required /><br /><br />

                <label>Expire Date</label>
                <input type="date" name="ExpireDate" onChange={handleChange} value={inputs.ExpireDate} required /><br /><br />

                <label>Image URL</label>
                <input type="text" name="ImageURL" onChange={handleChange} value={inputs.ImageURL} required /><br /><br />

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;
