import React from "react";
import { Route, Routes } from "react-router";
import Home from './Components/Home/Home';
import AddProduct from './Components/AddProduct/AddProduct';
import Products from './Components/ProductsDetails/Products';
import UpdateProduct from "./Components/UpdateProduct/UpdateProduct";
import Notifications from './Components/Notifications/Notifications';

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/mainhome" element={<Home />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/productsdetails" element={<Products />} />
          <Route path="/productsdetails/:id" element={<UpdateProduct />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
