import React, { useEffect, useState, useRef } from 'react';
import Nav from '../Nav/Nav'; // Your Navbar component
import axios from "axios";
import Product from "../Product/Product";
import jsPDF from 'jspdf';
import "./Products.css";

const URL = "http://localhost:5000/products";

// Fetch products from API
const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchHandler().then((data) => setProducts(data.products));
  }, []);

  const componentRef = useRef();

  // Generate PDF function
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Products Report", 20, 20);

    let yPosition = 30;
    products.forEach((product, index) => {
      doc.text(`${index + 1}. ID: ${product._id}`, 20, yPosition);
      doc.text(`   ProductId: ${product.ProductId}`, 20, yPosition + 10);
      doc.text(`   ProductName: ${product.ProductName}`, 20, yPosition + 20);
      doc.text(`   ProductCategory: ${product.ProductCategory}`, 20, yPosition + 30);
      doc.text(`   ProductDescription: ${product.ProductDescription}`, 20, yPosition + 40);
      doc.text(`   ProductPrice: ${product.ProductPrice}`, 20, yPosition + 50);
      doc.text(`   ProductQuantity: ${product.ProductQuantity}`, 20, yPosition + 60);
      doc.text(`   ManufactureDate: ${new Date(product.ManufactureDate).toISOString()}`, 20, yPosition + 70);
      doc.text(`   ExpireDate: ${new Date(product.ExpireDate).toISOString()}`, 20, yPosition + 80);
      doc.text(`   ImageURL: ${product.ImageURL}`, 20, yPosition + 90);
      yPosition += 110;
    });

    doc.save("products_report.pdf");
    alert("Products Report Successfully Downloaded!");
  };

  // Search handler
  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredProducts = data.products.filter((product) =>
        Object.values(product).some((field) =>
          String(field).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setProducts(filteredProducts);
      setNoResults(filteredProducts.length === 0);
    });
  };

  // Send WhatsApp message with the report link
  const handleSendReport = () => {
    const phoneNumber = "+94740045428";
    const message = `Selected Products Report:`;
    const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    window.open(WhatsAppUrl, "_blank");
  };

  return (
    <div>
      <Nav />
    <div className="products-container">
      {/* Navbar */}
       {/* Navbar should be placed here, at the top of the page */}
      
      {/* Content Section */}
      <div className="content">
        <h1>Product Details Display Page</h1>

        {/* Search Section */}
        <div className="search-container">
          <input
            type="text"
            name="search"
            placeholder="Search Products"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* No Results Section */}
        {noResults ? (
          <div className="no-results">
            <p>No Products Found</p>
          </div>
        ) : (
          <div ref={componentRef} className="product-list">
            {products.map((product, i) => (
              <div key={i}>
                <Product products={product} />
              </div>
            ))}
          </div>
        )}

        {/* Buttons for Report Actions */}
        <button className="download-btn" onClick={generatePDF}>Download Report</button>
        <button className="send-report-btn" onClick={handleSendReport}>Send WhatsApp Message</button>
      </div>
    </div>
  </div>
  );
}

export default Products;
