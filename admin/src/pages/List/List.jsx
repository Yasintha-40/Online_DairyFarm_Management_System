import React, { useEffect, useState } from 'react'
import './List.css'
import api from '../../utils/axios'
import {toast} from 'react-toastify'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const List = ({url}) => {
   
  
   const[list,setList] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [searchType, setSearchType] = useState('name');
   const [editingItem, setEditingItem] = useState(null);
   const [showEditModal, setShowEditModal] = useState(false);
   const [editForm, setEditForm] = useState({
     id: '',
     productId: '',
     name: '',
     description: '',
     price: '',
     category: '',
     image: null,
     manufactureDate: '',
     expireDate: ''
   });

   const fetchList = async () => {
    const response = await api.get(`/api/food/list`);
    
    if(response.data.success){
      setList(response.data.data);
    }
    else{
      toast.error("Error");
    }
   }

   const removeFood = async(foodId) =>{
      
    const response = await api.post(`/api/food/remove`,{id:foodId})
    
    await fetchList();
    if (response.data.success) {
      
      toast.success(response.data.message)
    }
     else{
      toast.error("Error");
     }
   }

   const handleEdit = (item) => {
     setEditingItem(item);
     // Format dates to YYYY-MM-DD for the date input
     const formatDate = (dateString) => {
       if (!dateString) return '';
       const date = new Date(dateString);
       return date.toISOString().split('T')[0];
     };

     setEditForm({
       id: item._id,
       productId: item.productId,
       name: item.name,
       description: item.description,
       price: item.price,
       category: item.category,
       image: null,
       manufactureDate: formatDate(item.manufactureDate),
       expireDate: formatDate(item.expireDate)
     });
     setShowEditModal(true);
   };

   const handleEditChange = (e) => {
     const { name, value } = e.target;
     setEditForm(prev => ({
       ...prev,
       [name]: value
     }));
   };

   const handleImageChange = (e) => {
     if (e.target.files && e.target.files[0]) {
       setEditForm(prev => ({
         ...prev,
         image: e.target.files[0]
       }));
     }
   };

   const handleEditSubmit = async (e) => {
     e.preventDefault();
     
     try {
       const formData = new FormData();
       formData.append('id', editForm.id);
       formData.append('productId', editForm.productId);
       formData.append('name', editForm.name);
       formData.append('description', editForm.description);
       formData.append('price', editForm.price);
       formData.append('category', editForm.category);
       formData.append('manufactureDate', editForm.manufactureDate);
       formData.append('expireDate', editForm.expireDate);
       
       if (editForm.image) {
         formData.append('image', editForm.image);
       }
       
       const response = await api.post('/api/food/update', formData, {
         headers: {
           'Content-Type': 'multipart/form-data'
         }
       });
       
       if (response.data.success) {
         toast.success(response.data.message);
         setShowEditModal(false);
         fetchList();
       } else {
         toast.error(response.data.message || "Failed to update food item");
       }
     } catch (error) {
       console.error("Update error:", error);
       toast.error("Failed to update food item");
     }
   };

   const handleSearch = (e) => {
     setSearchTerm(e.target.value);
   };

   const handleSearchTypeChange = (e) => {
     setSearchType(e.target.value);
   };

   // Simple search function
   const getFilteredList = () => {
     if (!searchTerm) return list;
     
     const term = searchTerm.toLowerCase().trim();
     
     return list.filter(item => {
       if (searchType === 'name' && item.name) {
         return item.name.toLowerCase().includes(term);
       } else if (searchType === 'category' && item.category) {
         return item.category.toLowerCase().includes(term);
       } else if (searchType === 'productId' && item.productId) {
         return item.productId.toString().toLowerCase().includes(term);
       }
       return false;
     });
   };

   const handleDownloadPDF = () => {
     try {
       if (!list.length) {
         toast.error("No data available to download");
         return;
       }

       const doc = new jsPDF();
       
       // Add title
       doc.setFontSize(16);
       doc.text("Food Items List", 14, 15);
       
       // Add date
       doc.setFontSize(10);
       doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
       
       // Prepare table data
       const tableData = list.map(item => [
         item.productId,
         item.name,
         item.category,
         `Rs.${item.price}`,
         new Date(item.manufactureDate).toLocaleDateString(),
         new Date(item.expireDate).toLocaleDateString()
       ]);

       // Add table using autoTable
       autoTable(doc, {
         head: [['Product ID', 'Name', 'Category', 'Price', 'Manufacture Date', 'Expire Date']],
         body: tableData,
         startY: 35,
         theme: 'grid',
         styles: {
           fontSize: 8,
           cellPadding: 2
         },
         headStyles: {
           fillColor: [76, 175, 80],
           textColor: 255,
           fontSize: 9,
           fontStyle: 'bold'
         }
       });

       // Save the PDF
       doc.save('food-items-list.pdf');
       toast.success("PDF downloaded successfully");
     } catch (error) {
       console.error("PDF generation error:", error);
       toast.error("Failed to generate PDF");
     }
   };

   const handleWhatsAppShare = (item) => {
     try {
       const message = `*Food Item Details*\n\n` +
         `Product ID: ${item.productId}\n` +
         `Name: ${item.name}\n` +
         `Category: ${item.category}\n` +
         `Price: Rs.${item.price}\n` +
         `Manufacture Date: ${new Date(item.manufactureDate).toLocaleDateString()}\n` +
         `Expire Date: ${new Date(item.expireDate).toLocaleDateString()}\n` +
         `Description: ${item.description}`;

       const encodedMessage = encodeURIComponent(message);
       const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
       window.open(whatsappUrl, '_blank');
     } catch (error) {
       console.error("WhatsApp share error:", error);
       toast.error("Failed to share on WhatsApp");
     }
   };

   useEffect(()=>{
    fetchList();
   },[])

  return (
    <div className='list add flex-col'>
      <p>All Food List</p>
      
      <div className="search-section">
        <div className="search-container">
          <select 
            className="search-type-select"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <option value="name">Search by Name</option>
            <option value="category">Search by Category</option>
            <option value="productId">Search by Product ID</option>
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
      
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Product ID</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Manufacture Date</b>
          <b>Expire Date</b>
          <b>Action</b>
        </div>
        {getFilteredList().length > 0 ? (
          getFilteredList().map((item,index)=>{
            return (
              <div key={index} className='list-table-format'>
                  <img src={`${url}/images/`+item.image} alt="" />
                  <p>{item.productId}</p>
                  <p>{item.name}</p>
                  <p>{item.category}</p>
                  <p>Rs.{item.price}</p>
                  <p>{item.manufactureDate ? new Date(item.manufactureDate).toLocaleDateString('en-GB') : 'N/A'}</p>
                  <p>{item.expireDate ? new Date(item.expireDate).toLocaleDateString('en-GB') : 'N/A'}</p>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(item)} className="edit-btn">Edit</button>
                    <button onClick={() => removeFood(item._id)} className="delete-btn">Delete</button>
                  </div>
              </div>
            )
          })
        ) : (
          <div className="no-results">
            <p>No results found for "{searchTerm}" in {searchType}</p>
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
        <button 
          onClick={() => list.length > 0 ? handleWhatsAppShare(list[0]) : toast.error("No items to share")} 
          className="whatsapp-btn"
        >
          <i className="fab fa-whatsapp"></i> Share on WhatsApp
        </button>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Food Item</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Product ID</label>
                <input 
                  type="text" 
                  name="productId" 
                  value={editForm.productId} 
                  disabled 
                  className="disabled-input"
                />
                <small className="field-note">Product ID cannot be edited</small>
              </div>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={editForm.name} 
                  onChange={handleEditChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description" 
                  value={editForm.description} 
                  onChange={handleEditChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input 
                  type="number" 
                  name="price" 
                  value={editForm.price} 
                  onChange={handleEditChange} 
                  required 
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  name="category" 
                  value={editForm.category} 
                  onChange={handleEditChange} 
                  required
                >
                  <option value="Cheese">Cheese</option>
                  <option value="Fresh Milk">Fresh Milk</option>
                  <option value="Yogurt & Curd">Yogurt & Curd</option>
                  <option value="Butter & Ghee">Butter & Ghee</option>
                  <option value="Cream & Whipping Cream">Cream & Whipping Cream</option>
                  <option value="Powdered milk & Condensed milk">Powdered milk & Condensed milk</option>
                  <option value="Ice cream">Ice cream</option>
                  <option value="Flavoured milk">Flavoured milk</option>
                </select>
              </div>
              <div className="form-group">
                <label>Manufacture Date</label>
                <input 
                  type="date" 
                  name="manufactureDate" 
                  value={editForm.manufactureDate} 
                  disabled 
                  className="disabled-input"
                />
                <small className="field-note">Manufacture date cannot be edited</small>
              </div>
              <div className="form-group">
                <label>Expire Date</label>
                <input 
                  type="date" 
                  name="expireDate" 
                  value={editForm.expireDate} 
                  onChange={handleEditChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Image (optional)</label>
                <input 
                  type="file" 
                  onChange={handleImageChange} 
                  accept="image/*"
                />
                {editingItem && (
                  <div className="current-image">
                    <p>Current image:</p>
                    <img src={`${url}/images/${editingItem.image}`} alt="Current" />
                  </div>
                )}
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default List
