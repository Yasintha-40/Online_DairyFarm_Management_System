import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id,name,price,description,image,manufactureDate,expireDate}) => {
    const {cartItems,addToCart,removeFromCart,url,error} = useContext(StoreContext);
    const [imageError, setImageError] = useState(false);

    // Add null check for cartItems
    const itemCount = cartItems?.[id] || 0;

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className='food-item'>
            {error && <div className="error-message">{error}</div>}
            <div className="food-item-img-container">
                <img 
                    className='food-item-image' 
                    src={imageError ? assets.placeholder_image : `${url}/images/${image}`} 
                    alt={name}
                    onError={handleImageError}
                />
            
                {!itemCount
                    ? <img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="add"/>
                    : <div className='food-item-counter'>
                        <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="remove"/>
                        <p>{itemCount}</p>
                        <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="add"/>
                    </div>
                }
            </div>

            <div className="food-item-info">
                <div className='food-item-name-rating'>
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="rating"/>
                </div>
            </div>
          
            <p className="food-item-desc">{description}</p>
            <p className="food-item-price">Rs.{price}</p>
            <div className="food-item-dates">
                <p>Manufactured: {manufactureDate ? new Date(manufactureDate).toLocaleDateString() : 'N/A'}</p>
                <p>Expires: {expireDate ? new Date(expireDate).toLocaleDateString() : 'N/A'}</p>
            </div>
        </div>
    )
}

export default FoodItem
