import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home';
import AddVaccine from './Components/AddVaccine/AddVaccine';
import UpdateVaccines from './Components/UpdateVaccine/UpdateVaccine';
import Vaccines from './Components/VaccineDetails/Vaccines';
import AddCow from './Components/AddCow/AddCow';
import UpdateCows from './Components/UpdateCow/UpdateCow';
import Cows from './Components/CowDetails/Cows';


function App() {
  return (
    <div>
      
      <React.Fragment>
        <Routes>

          <Route path='/' element = {<Home/>}/>
          <Route path='/mainhome' element = {<Home/>}/>
          <Route path='/addvaccine' element = {<AddVaccine/>}/>
          <Route path='/vaccinedetails' element = {<Vaccines/>}/>
          <Route path='/vaccinedetails/:id' element = {<UpdateVaccines/>}/>
          <Route path='/addcow' element = {<AddCow/>}/>
          <Route path='/cowdetails' element = {<Cows/>}/>
          <Route path='/cowdetails/:id' element = {<UpdateCows/>}/>

        </Routes>
      </React.Fragment>   
    </div>
  );
}

export default App;
