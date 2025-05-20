import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import UpdateEmployee from "./components/employees/UpdateEmployee";
import EmployeeList from "./components/employees/EmployeeList";
import InsertEmployee from "./components/employees/InsertEmployee";
import ShowEmployeeDetails from "./components/employees/ShowEmployeeDetails";
import TaskList from "./components/task/TaskList";
import InsertTask from "./components/task/InsertTask";
import UpdateTask from "./components/task/UpdateTask";
import Alert from "./components/EmpUi/Alert";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/insert" element={<InsertEmployee />} />
            <Route path="/show/:id" element={<ShowEmployeeDetails />} />
            <Route path="/update/:id" element={<UpdateEmployee />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/insert" element={<InsertTask />} />
            <Route path="/tasks/update/:id" element={<UpdateTask />} />
            <Route path="/alert" element={<Alert />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
