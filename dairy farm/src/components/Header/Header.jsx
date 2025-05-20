import React from 'react'
import './Header.css'
import { assets } from '../../assets/assets'

const Header = () => {
  return (
    <div className='header'>
      <img src={assets.header_img} alt="Header" className="header-image" />
      <div className="header-contents">
        <h2>Order your fresh products here</h2>
        <p>Choose from the diverse options. Only the best for you and your family!</p>
        <button>View Products</button>
      </div>
    </div>
  )
}

export default Header
