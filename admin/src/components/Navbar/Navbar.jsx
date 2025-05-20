import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { USER_FRONTEND_URL } from '../../constants/urls.js'

const Navbar = () => {
  return (
    <div className='navbar'>
      <a href={USER_FRONTEND_URL}>  
        <img src={assets.logo} alt="" className='logo' />
      </a>
      <img className='profile' src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar
