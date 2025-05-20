import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = ({url}) => {
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        productId: "",
        name: "",
        description: "",
        price: "",
        category: "Cheese",
        manufactureDate: "",
        expireDate: ""
    });
    
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({...data, [name]: value}));
    }

    const validateForm = () => {
        if (!data.productId.trim()) {
            toast.error("Product ID is required");
            return false;
        }
        if (!data.name.trim()) {
            toast.error("Product name is required");
            return false;
        }
        if (!data.description.trim()) {
            toast.error("Product description is required");
            return false;
        }
        if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
            toast.error("Please enter a valid price");
            return false;
        }
        if (!data.manufactureDate) {
            toast.error("Manufacture date is required");
            return false;
        }
        if (!data.expireDate) {
            toast.error("Expire date is required");
            return false;
        }
        if (!image) {
            toast.error("Please upload an image");
            return false;
        }
        return true;
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("productId", data.productId);
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", Number(data.price));
            formData.append("category", data.category);
            formData.append("manufactureDate", data.manufactureDate);
            formData.append("expireDate", data.expireDate);
            formData.append("image", image);

            console.log("Sending request to:", `${url}/api/food/add`);
            const response = await axios.post(`${url}/api/food/add`, formData);

            if (response.data.success) {
                setData({
                    productId: "",
                    name: "",
                    description: "",
                    price: "",
                    category: "Cheese",
                    manufactureDate: "",
                    expireDate: ""
                });
                setImage(false);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message || "Failed to add product");
            }
        } catch (error) {
            console.error("Add product error:", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(`Server error: ${error.response.data?.message || error.response.statusText}`);
            } else if (error.request) {
                // The request was made but no response was received
                toast.error("No response from server. Please check if the server is running.");
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor='image'>
                        <img 
                            src={image ? URL.createObjectURL(image) : assets.upload_area} 
                            alt="Upload area" 
                        />
                    </label>
                    <input 
                        onChange={(e) => setImage(e.target.files[0])} 
                        type="file" 
                        id="image" 
                        hidden 
                        accept="image/*"
                        required
                    />
                </div>
                <div className="add-product-id flex-col">
                    <p>Product ID</p>
                    <input 
                        onChange={onChangeHandler} 
                        value={data.productId} 
                        type="text" 
                        name="productId" 
                        placeholder='Enter product ID'
                        required 
                    />
                </div>
                <div className="add-product-name flex-col">
                    <p>Product name</p>
                    <input 
                        onChange={onChangeHandler} 
                        value={data.name} 
                        type="text" 
                        name="name" 
                        placeholder='Type here'
                        required 
                    />
                </div>
                <div className="add-product-description flex-col">
                    <p>Product description</p>
                    <textarea 
                        onChange={onChangeHandler} 
                        value={data.description} 
                        name='description' 
                        rows="6" 
                        placeholder='Write content here' 
                        required
                    />
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select onChange={onChangeHandler} name="category" required>
                            <option value="Cheese">Cheese</option>
                            <option value="Fresh Milk">Fresh Milk</option>
                            <option value="Yogurt & Curd">Yogurt & Curd</option>
                            <option value="Butter & Ghee">Butter & Ghee</option>
                            <option value="Cream & Whipping Cream">Cream & Whipping Cream</option>
                            <option value="Powdered milk & Condensed milk">Powdered milk & Condensed milk</option>
                            <option value="Ice cream">Ice cream</option>
                            <option value="Flavoured milk">Flavoured milk</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product price</p>
                        <input 
                            onChange={onChangeHandler} 
                            value={data.price} 
                            type="Number" 
                            name='price' 
                            placeholder='Rs.'
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>
                <div className="add-dates">
                    <div className="add-manufacture-date flex-col">
                        <p>Manufacture Date</p>
                        <input 
                            onChange={onChangeHandler} 
                            value={data.manufactureDate} 
                            type="date" 
                            name="manufactureDate" 
                            required
                        />
                    </div>
                    <div className="add-expire-date flex-col">
                        <p>Expire Date</p>
                        <input 
                            onChange={onChangeHandler} 
                            value={data.expireDate} 
                            type="date" 
                            name="expireDate" 
                            required
                        />
                    </div>
                </div>
                <button 
                    type='submit' 
                    className='add-btn'
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Items'}
                </button>
            </form>
        </div>
    )
}

export default Add
