import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('orderId');

  const fetchAllOrders = async () => {
    try {
      const apiUrl = url + "/api/order/list";
      console.log("Fetching from:", apiUrl);  // Check the API URL
      const response = await axios.get(apiUrl);
      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  const statusHandler = async (event,orderId) =>{
    const response = await axios.post(url+"/api/order/status",{
      orderId,
      status:event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await axios.delete(`${url}/api/order/${orderId}`);
        if (response.data.success) {
          toast.success("Order deleted successfully");
          await fetchAllOrders();
        } else {
          toast.error(response.data.message || "Failed to delete order");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error deleting order");
      }
    }
  };

  const handleDownloadPDF = () => {
    try {
      if (!orders.length) {
        toast.error("No orders available to download");
        return;
      }

      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text("Orders List", 14, 15);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
      
      // Prepare table data
      const tableData = orders.map(order => [
        order._id,
        order.items.map(item => `${item.name} x${item.quantity}`).join(', '),
        `Rs.${order.amount}`,
        order.status,
        new Date(order.createdAt).toLocaleDateString()
      ]);

      // Add table using autoTable
      autoTable(doc, {
        head: [['Order ID', 'Items', 'Amount', 'Status', 'Order Date']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [13, 119, 27],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold'
        }
      });

      // Save the PDF
      doc.save('orders-list.pdf');
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  // Filter orders based on search term and type
  const getFilteredOrders = () => {
    if (!searchTerm) return orders;
    
    const term = searchTerm.toLowerCase().trim();
    
    return orders.filter(order => {
      if (searchType === 'orderId') {
        return order._id.toLowerCase().includes(term);
      } else if (searchType === 'status') {
        return order.status.toLowerCase().includes(term);
      } else if (searchType === 'amount') {
        return order.amount.toString().includes(term);
      }
      return false;
    });
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      
      <div className="search-section">
        <div className="search-container">
          <select 
            className="search-type-select"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <option value="orderId">Search by Order ID</option>
            <option value="status">Search by Status</option>
            <option value="amount">Search by Amount</option>
          </select>
          <input
            type="text"
            className="search-input"
            placeholder={`Search by ${searchType}...`}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="order-list">
        {getFilteredOrders().length > 0 ? (
          getFilteredOrders().map((order, index) => (
            <div key={index} className='order-item'>
              <img src={assets.parcel_icon} alt="parcel" />
              <div>
                <p className='order-item-food'>
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} x{item.quantity}
                      {idx === order.items.length - 1 ? "" : ", "}
                    </span>
                  ))}
                </p>
                <p><b>Amount:</b> Rs.{order.amount}</p>
                <p><b>Ordered On:</b> {new Date(order.createdAt).toLocaleString()}</p>
                <p><b>Order ID:</b> {order._id}</p>
                <hr />
              </div>
              <div className="order-actions">
                <div className="action-buttons">
                  <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} >
                    <option value="Order Processing">Order Processing</option>
                    <option value="Ready to Pick up">Ready To Pick up</option>
                  </select>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(order._id)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No orders found for "{searchTerm}" in {searchType}</p>
            <button onClick={() => setSearchTerm('')} className="clear-search-btn">
              Clear Search
            </button>
          </div>
        )}
      </div>
      
      <div className="bottom-actions">
        <button onClick={handleDownloadPDF} className="download-btn">
          <i className="fas fa-download"></i> Download PDF
        </button>
      </div>
    </div>
  );
};

export default Orders;
