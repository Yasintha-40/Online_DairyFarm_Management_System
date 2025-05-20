import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { jsPDF } from 'jspdf';
import './Services.css';

const Services = () => {
  const [animalServices, setAnimalServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('animalId');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchAnimalServices();
  }, []);

  const fetchAnimalServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/animal-services');
      // Sort services by serviceId in ascending order
      const sortedServices = response.data.sort((a, b) => a.serviceId - b.serviceId);
      setAnimalServices(sortedServices);
      setError(null);
    } catch (err) {
      setError('Failed to fetch animal services. Please try again later.');
      console.error('Error fetching animal services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/api/animal-services/${selectedService._id}`, {
        animalId: selectedService.animalId,
        age: selectedService.age,
        serviceType: selectedService.serviceType,
        notes: selectedService.notes,
        status: selectedService.status
      });
      setShowEditModal(false);
      fetchAnimalServices();
    } catch (error) {
      console.error('Error updating service:', error);
      setError('Error updating service. Please try again.');
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/api/animal-services/${serviceId}`);
        fetchAnimalServices();
      } catch (err) {
        setError('Failed to delete service. Please try again.');
        console.error('Error deleting service:', err);
      }
    }
  };

  const handleAnimalServiceNotificationToggle = async (service) => {
    try {
      await api.patch(`/api/animal-services/${service._id}`, {
        isNotified: !service.isNotified
      });
      fetchAnimalServices();
    } catch (error) {
      console.error('Error updating animal service notification status:', error);
      setError('Error updating notification status. Please try again.');
    }
  };

  const handleCopyAndWhatsApp = (service) => {
    const message = `Animal Service Details:\nService ID: ${service.serviceId}\nAnimal ID: ${service.animalId}\nAge: ${service.age}\nService Type: ${service.serviceType}\nStatus: ${service.status || 'Pending'}\nNotes: ${service.notes || 'N/A'}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(message).then(() => {
      setShowToast(true);
      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
      
      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy to clipboard');
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchTerm(''); // Clear search term when changing search type
  };

  const filteredServices = animalServices.filter(service => {
    const searchValue = searchTerm.toLowerCase();
    switch (searchType) {
      case 'animalId':
        return service.animalId.toLowerCase().includes(searchValue);
      case 'serviceId':
        return service.serviceId.toString().includes(searchValue);
      case 'age':
        return service.age.toLowerCase().includes(searchValue);
      case 'status':
        return (service.status || 'Pending').toLowerCase().includes(searchValue);
      default:
        return true;
    }
  });

  const handleDownloadPDF = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('Animal Services Report', 14, 15);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

      // Define table columns
      const columns = [
        { header: 'Service ID', dataKey: 'serviceId' },
        { header: 'Animal ID', dataKey: 'animalId' },
        { header: 'Age', dataKey: 'age' },
        { header: 'Service Type', dataKey: 'serviceType' },
        { header: 'Notes', dataKey: 'notes' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Notification', dataKey: 'isNotified' }
      ];

      // Prepare table data
      const tableData = filteredServices.map(service => ({
        serviceId: service.serviceId,
        animalId: service.animalId,
        age: service.age,
        serviceType: service.serviceType,
        notes: service.notes || 'N/A',
        status: service.status || 'Pending',
        isNotified: service.isNotified ? 'Notified' : 'Pending'
      }));

      // Add table manually
      let yPos = 35;
      const lineHeight = 7;
      const margin = 14;
      const colWidths = [20, 30, 20, 40, 40, 25, 25];
      
      // Add headers
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      let xPos = margin;
      columns.forEach((col, i) => {
        doc.text(col.header, xPos, yPos);
        xPos += colWidths[i];
      });
      
      // Add data rows
      doc.setFont(undefined, 'normal');
      tableData.forEach(row => {
        yPos += lineHeight;
        xPos = margin;
        
        // Check if we need a new page
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        
        columns.forEach((col, i) => {
          const text = String(row[col.dataKey] || '');
          doc.text(text, xPos, yPos);
          xPos += colWidths[i];
        });
      });

      // Save the PDF
      doc.save('animal-services-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Error generating PDF. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <div className="services-container">
      <h1>Animal Services Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="services-header">
        <h2>Animal Services List</h2>
        <div className="header-actions">
          <button 
            className="download-button"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="search-section">
        <div className="search-container">
          <select 
            className="search-type-select"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <option value="animalId">Search by Animal ID</option>
            <option value="serviceId">Search by Service ID</option>
            <option value="age">Search by Age</option>
            <option value="status">Search by Status</option>
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

      <div className="services-list">
        {filteredServices.length === 0 ? (
          <p>No services found.</p>
        ) : (
          <table className="services-table">
            <thead>
              <tr>
                <th>Service ID</th>
                <th>Animal ID</th>
                <th>Age</th>
                <th>Service Type</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Notification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service._id}>
                  <td>{service.serviceId}</td>
                  <td>{service.animalId}</td>
                  <td>{service.age}</td>
                  <td>{service.serviceType}</td>
                  <td>{service.notes || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${service.status?.toLowerCase() || 'pending'}`}>
                      {service.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`notification-badge ${service.isNotified ? 'notified' : 'pending'}`}>
                      {service.isNotified ? 'Notified' : 'Pending'}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(service)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(service._id)}
                    >
                      Delete
                    </button>
                    <button 
                      className={`notification-button ${service.isNotified ? 'notified' : 'pending'}`}
                      onClick={() => handleAnimalServiceNotificationToggle(service)}
                    >
                      {service.isNotified ? 'Mark as Pending' : 'Mark as Notified'}
                    </button>
                    <button 
                      className="whatsapp-button"
                      onClick={() => handleCopyAndWhatsApp(service)}
                    >
                      Copy & WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-content">
            <span>Service details copied to clipboard!</span>
            <button onClick={() => setShowToast(false)}>×</button>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Animal Service</h3>
              <button onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {selectedService && (
                <form onSubmit={handleEditSubmit}>
                  <div className="form-group">
                    <label htmlFor="animalId">Animal ID</label>
                    <input
                      type="text"
                      id="animalId"
                      value={selectedService.animalId}
                      onChange={(e) => setSelectedService({...selectedService, animalId: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                      type="text"
                      id="age"
                      value={selectedService.age}
                      onChange={(e) => setSelectedService({...selectedService, age: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="serviceType">Service Type</label>
                    <select
                      id="serviceType"
                      value={selectedService.serviceType}
                      onChange={(e) => setSelectedService({...selectedService, serviceType: e.target.value})}
                      required
                    >
                      <option value="">Select Service</option>
                      <option value="Veterinary Checkup">Veterinary Checkup</option>
                      <option value="Hoof Check">Hoof Check</option>
                      <option value="Breeding Check">Breeding Check</option>
                      <option value="Tag Check">Tag Check</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      value={selectedService.status || 'Pending'}
                      onChange={(e) => setSelectedService({...selectedService, status: e.target.value})}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                    <input
                      type="text"
                      id="notes"
                      value={selectedService.notes || ''}
                      onChange={(e) => setSelectedService({...selectedService, notes: e.target.value})}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-button">
                      Update Service
                    </button>
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services; 