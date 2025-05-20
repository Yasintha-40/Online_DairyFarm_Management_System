import React, { useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import Navbar from './components/Navbar/Navbar'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './LoginPopup/LoginPopup'
import User from './pages/User/User'
import Vet from './pages/vet/vet'
import Employee from './pages/employee/employee'
import VaccineDetails from './pages/vaccineDetails/vaccineDetails'
import AddVaccine from './components/AddVaccine/AddVaccine'
import Vaccines from './components/VaccineDetails/Vaccines'
import AddCow from './components/AddCow/AddCow'
import Cows from './components/CowDetails/Cows'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
   
  const [showLogin,setShowLogin] = useState(false)

  return (
    <>
      {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}

      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/user' element={
            <ProtectedRoute>
              <User/>
            </ProtectedRoute>
          }/>
          <Route path='/vet/*' element={
            <ProtectedRoute>
              <Vet/>
            </ProtectedRoute>
          }>
            <Route path="addvaccine" element={<AddVaccine/>} />
            <Route path="vaccinedetails" element={<Vaccines/>} />
            <Route path="addcow" element={<AddCow/>} />
            <Route path="cowdetails" element={<Cows/>} />
          </Route>
          <Route path='/employee' element={<Employee/>}/>
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
