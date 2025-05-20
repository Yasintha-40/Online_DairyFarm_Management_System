import React from "react";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import AnimalList from "./components/AnimalList";
import InsertAnimal from "./components/InsertAnimal";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import UpdateAnimal from "./components/UpdateAnimal"; 
import ShowAnimalDetails from "./components/ShowAnimalDetails"; 
import AnimalServices from './components/AnimalServices';
import Services from './components/Services';


function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
        <Router>
         <Navigation /><br/>
         
            <Routes>
              <Route path="/" element={<AnimalList />} />
              <Route path="/insert" element={<InsertAnimal />} />
              <Route path="/showdetails/:id" element={<ShowAnimalDetails />} />
              <Route path="/updatedetails/:id" element={<UpdateAnimal />} />
              <Route path="/Animalservices" element={<AnimalServices />} />
              <Route path="/services" element={<Services />} />
            </Routes>
            <Footer/>
        </Router>
      
    </div>
  );
}

export default App;