import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink 
          to='/add' 
          className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
        >
          <img src={assets.add_icon} alt="" />
          <p>Add items</p>
        </NavLink>
        
        <NavLink 
          to='/list' 
          className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
        >
          <img src={assets.order_icon} alt="" />
          <p>List items</p>
        </NavLink>
        
        <NavLink 
          to='/orders' 
          className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
        >
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>

        <NavLink 
          to='/users' 
          className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
        >
          <img src={assets.add_icon} alt="" />
          <p>Users</p>
        </NavLink>

        <NavLink 
          to='/employees' 
          className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
        >
          <img src={assets.add_icon} alt="" />
          <p>Employees</p>
        </NavLink>

        <NavLink 
          to='/tasks' 
          className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
        >
          <img src={assets.order_icon} alt="" />
          <p>Tasks</p>
        </NavLink>

        <NavLink 
          to='/animals' 
          className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
        >
          <img src={assets.add_icon} alt="" />
          <p>Animals</p>
        </NavLink>

        <NavLink 
          to='/services' 
          className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
        >
          <img src={assets.order_icon} alt="" />
          <p>Services</p>
        </NavLink>

        <NavLink 
          to='/animal-services' 
          className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}
        >
          <img src={assets.order_icon} alt="" />
          <p>Animal Services</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar;
