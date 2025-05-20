import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Users from './pages/Users/Users'
import Employees from './pages/Employees/Employees'
import Tasks from './pages/Tasks/Tasks'
import Animals from './pages/Animals/Animals'
import Services from './pages/Services/Services'
import AnimalServices from './pages/AnimalServices/AnimalServices'
import Login from './pages/Login/Login'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const url = "http://localhost:4000"

  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <>
              <Navbar/>
              <hr/>
              <div className="app-content">
                <Sidebar/>
                <Routes>
                  <Route index element={<Navigate to="/list" replace />} />
                  <Route path="add" element={<Add url={url}/>}/>
                  <Route path="list" element={<List url={url}/>}/>
                  <Route path="orders" element={<Orders url={url}/>}/>
                  <Route path="users" element={<Users url={url}/>}/>
                  <Route path="employees" element={<Employees url={url}/>}/>
                  <Route path="tasks" element={<Tasks url={url}/>}/>
                  <Route path="animals" element={<Animals />}/>
                  <Route path="services" element={<Services />}/>
                  <Route path="animal-services" element={<AnimalServices />}/>
                </Routes>
              </div>
            </>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
