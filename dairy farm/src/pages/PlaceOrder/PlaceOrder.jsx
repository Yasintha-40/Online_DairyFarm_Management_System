import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id]
        });
      }
    });

    let orderData = {
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      address: `${data.firstName} ${data.lastName}, Phone: ${data.phone}`,
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        alert("Order placed successfully! 🎉");
        setCartItems({});
        navigate('/');
      } else {
        alert("Failed to place order. Please try again!");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again later!");
    }
  };

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Order Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone Number' />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rs.{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rs.{getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit'>PLACE ORDER</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
