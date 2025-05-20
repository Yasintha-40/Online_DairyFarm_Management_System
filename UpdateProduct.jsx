import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import Nav from '../Nav/Nav';
import "./UpdateProduct.css";

function UpdateProduct() {
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

    const history = useNavigate();
    const id = useParams().id;

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/products/${id}`);
                const productData = response.data?.products;
                if (productData) {
                    setInputs(productData);
                } else {
                    console.error("Invalid product data received");
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        try {
            const response = await axios.put(
                `http://localhost:5000/products/${id}`, {
                    ProductName: String(inputs.ProductName),
                    ProductCategory: String(inputs.ProductCategory),
                    ProductDescription: String(inputs.ProductDescription),
                    ProductPrice: Number(inputs.ProductPrice),
                    ProductQuantity: Number(inputs.ProductQuantity),
                    ManufactureDate: new Date(inputs.ManufactureDate).toISOString(),
                    ExpireDate: new Date(inputs.ExpireDate).toISOString(),
                    ImageURL: String(inputs.ImageURL),
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if ProductPrice or ProductQuantity are negative
        if (inputs.ProductPrice < 0 || inputs.ProductQuantity < 0) {
            window.alert("Product Price and Quantity cannot be negative!");
            return;
        }

        console.log(inputs);
        window.alert("Product details Updated Successfully!");
        sendRequest().then(() => history('/productsdetails'));
    };

    return (
        <div>
            <Nav />
            <div className="UpdateProduct-container">
                <h1>Update Product</h1>

                <form onSubmit={handleSubmit}>
                    {/* Product ID (Read-only) */}
                    <label>Product ID</label>
                    <input
                        type="number"
                        name="ProductId"
                        onChange={handleChange}
                        value={inputs.ProductId || ""}
                        required
                        readOnly  // Prevent modification of ProductId
                    /><br />

                    <label>Product Name</label>
                    <input
                        type="text"
                        name="ProductName"
                        onChange={handleChange}
                        value={inputs.ProductName || ""}
                        required
                    /><br />

                    <label>Product Category</label>
                    <input
                        type="text"
                        name="ProductCategory"
                        onChange={handleChange}
                        value={inputs.ProductCategory || ""}
                        required
                    /><br />

                    <label>Product Description</label>
                    <input
                        type="text"
                        name="ProductDescription"
                        onChange={handleChange}
                        value={inputs.ProductDescription || ""}
                        required
                    /><br />

                    <label>Product Price</label>
                    <input
                        type="number"
                        name="ProductPrice"
                        onChange={handleChange}
                        value={inputs.ProductPrice || ""}
                        required
                        min="0"  // Prevent negative values
                    /><br />

                    <label>Product Quantity</label>
                    <input
                        type="number"
                        name="ProductQuantity"
                        onChange={handleChange}
                        value={inputs.ProductQuantity || ""}
                        required
                        min="0"  // Prevent negative values
                    /><br />

                    {/* Manufacture Date (Read-only) */}
                    <label>Manufacture Date</label>
                    <input
                        type="date"
                        name="ManufactureDate"
                        onChange={handleChange}
                        value={inputs.ManufactureDate || ""}
                        required
                        readOnly  // Prevent modification of Manufacture Date
                    /><br />

                    <label>Expire Date</label>
                    <input
                        type="date"
                        name="ExpireDate"
                        onChange={handleChange}
                        value={inputs.ExpireDate || ""}
                        required
                    /><br />

                    <label>Image URL</label>
                    <input
                        type="text"
                        name="ImageURL"
                        onChange={handleChange}
                        value={inputs.ImageURL || ""}
                        required
                    /><br />

                    <button type="submit">Update Product</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProduct;
