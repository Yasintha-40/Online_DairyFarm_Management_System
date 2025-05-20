import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Vaccines.css';

const URL = 'http://localhost:4000/vaccines';

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Vaccines() {
  const [vaccines, setVaccines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingVaccine, setEditingVaccine] = useState(null);
  const componentRef = useRef(null);

  useEffect(() => {
    fetchHandler().then((data) => setVaccines(data.vaccines));
  }, []);

  const handleDelete = (deletedVaccineId) => {
    setVaccines((prevVaccines) => prevVaccines.filter((vaccine) => vaccine._id !== deletedVaccineId));
  };

  const handleEdit = (vaccine) => {
    setEditingVaccine(vaccine);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${URL}/${editingVaccine._id}`, editingVaccine);
      setVaccines(vaccines.map(vaccine => 
        vaccine._id === editingVaccine._id ? response.data.vaccines : vaccine
      ));
      setEditingVaccine(null);
      toast.success("Vaccine details updated successfully!");
      
      // Refresh the page after successful edit
      window.location.reload();
    } catch (error) {
      console.error("Error updating vaccine:", error);
      toast.error("Failed to update vaccine details");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingVaccine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredVaccines = vaccines.filter((vaccine) => {
    if (!vaccine) return false;
    
    const searchValue = searchTerm.toLowerCase();
    return (
      (vaccine.vaccine_id && vaccine.vaccine_id.toLowerCase().includes(searchValue)) ||
      (vaccine.vaccine_name && vaccine.vaccine_name.toLowerCase().includes(searchValue)) ||
      (vaccine.disease_name && vaccine.disease_name.toLowerCase().includes(searchValue)) ||
      (vaccine.target && vaccine.target.toLowerCase().includes(searchValue))
    );
  });

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.text("Vaccine Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Vaccine ID", "Vaccine Name", "Disease Name", "Target", "Description"]],
      body: filteredVaccines.map((vaccine) => [
        vaccine.vaccine_id,
        vaccine.vaccine_name || "N/A",
        vaccine.disease_name || "N/A",
        vaccine.target,
        vaccine.description || "N/A"
      ]),
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("VaccineReport.pdf");
  };

  const handleSendReport = () => {
    const phonenumber = "+94764050673";
    const message = `Vaccine Report`;
    const WhatsAppUrl = `http://web.Whatsapp.com/send?phone=${phonenumber}&text=${encodeURIComponent(message)}`;

    window.open(WhatsAppUrl, "_blank");
  };

  return (
    <div className="vaccines-page">
      <div className="vaccines-container">
        <h1 className="vaccines-title">Vaccines Health Details</h1>
        <input
          type="text"
          placeholder="Search by ID, Disease, target or Vaccine"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <div ref={componentRef} className="vaccines-list">
          {filteredVaccines.map((vaccine) => (
            <div key={vaccine._id} className="vaccine-item">
              <div className="vaccine-card">
                <h2 className="vaccine-title">Vaccine ID: {vaccine.vaccine_id}</h2>
                <div className="vaccine-info">
                  <p><strong>Vaccine Name:</strong> {vaccine.vaccine_name}</p>
                  <p><strong>Disease Name:</strong> {vaccine.disease_name}</p>
                  <p><strong>Target:</strong> {vaccine.target}</p>
                  <p><strong>Description:</strong> {vaccine.description}</p>
                </div>
                <div className="vaccine-actions">
                  <button onClick={() => handleEdit(vaccine)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(vaccine._id)} className="delete-btn">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleDownloadReport} className="download-btn">Download Report</button>
        <button onClick={handleSendReport} className="download-btn">Send WhatsApp Message</button>
      </div>

      {/* Edit Modal */}
      {editingVaccine && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Vaccine Details</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Vaccine ID:</label>
                <input
                  type="text"
                  name="vaccine_id"
                  value={editingVaccine.vaccine_id}
                  disabled
                  className="disabled-input"
                  title="Vaccine ID cannot be edited"
                />
              </div>
              <div className="form-group">
                <label>Vaccine Name:</label>
                <input
                  type="text"
                  name="vaccine_name"
                  value={editingVaccine.vaccine_name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Disease Name:</label>
                <input
                  type="text"
                  name="disease_name"
                  value={editingVaccine.disease_name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Target:</label>
                <select
                  name="target"
                  value={editingVaccine.target}
                  onChange={handleEditChange}
                  required
                >
                  <option value="Three_Month">Three Month</option>
                  <option value="Six_Month">Six Month</option>
                  <option value="Any">Any</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={editingVaccine.description}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => setEditingVaccine(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Vaccines; 