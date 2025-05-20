import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/axios';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Cows.css';

const fetchHandler = async () => {
  return await api.get("/cows").then((res) => res.data);
};

function Cows() {
  const [cows, setCows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dayCounts, setDayCounts] = useState({});
  const [error, setError] = useState("");
  const [editingCow, setEditingCow] = useState(null);
  const [vaccineOptions, setVaccineOptions] = useState([]);
  const componentRef = useRef(null);

  // To prevent duplicate toasts
  const shownToastsRef = useRef(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHandler();
        setCows(data.cows);
        updateDayCounts(data.cows);
      } catch (error) {
        console.error("Error fetching cows:", error);
        setError(error.response?.data?.message || "Failed to fetch cows data");
      }
    };
    fetchData();
  }, []);

  // Fetch vaccines for the edit form
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await api.get("/vaccines");
        setVaccineOptions(response.data.vaccines);
      } catch (error) {
        console.error("Error fetching vaccines:", error);
      }
    };
    fetchVaccines();
  }, []);

  const updateDayCounts = (cowsData) => {
    const counts = {};
    cowsData.forEach(cow => {
      const days = calculateDays(cow.vaccination_date);
      counts[cow._id] = days;

      const toastKey = `${cow._id}-${days}`;
      if (!shownToastsRef.current.has(toastKey)) {
        if (days === -1) {
          toast.info(`🩺 Today you have to vaccinate: ${cow.animal_id} with ${cow.vaccine_name}`, {
            autoClose: false
          });
          shownToastsRef.current.add(toastKey);
        } else if (days === 0) {
          toast.warn(`⏳ Tomorrow you have to vaccinate: ${cow.animal_id} with ${cow.vaccine_name}`, {
            autoClose: false
          });
          shownToastsRef.current.add(toastKey);
        }
      }
    });
    setDayCounts(counts);
  };

  const calculateDays = (date) => {
    if (!date) return "N/A";
    const today = new Date();
    const vaccineDate = new Date(date);
    const timeDiff = vaccineDate.getTime() - today.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const counts = {};
      cows.forEach(cow => {
        counts[cow._id] = calculateDays(cow.vaccination_date);
      });
      setDayCounts(counts);
    }, 60000); // every 1 minute

    return () => clearInterval(interval);
  }, [cows]);

  const handleDelete = async (deletedCowId) => {
    try {
      await api.delete(`/cows/${deletedCowId}`);
      setCows((prevCows) => prevCows.filter((cow) => cow._id !== deletedCowId));
    } catch (error) {
      console.error("Error deleting cow:", error);
      setError(error.response?.data?.message || "Failed to delete cow");
    }
  };

  const handleEdit = (cow) => {
    setEditingCow(cow);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/cows/${editingCow._id}`, editingCow);
      setCows(cows.map(cow => 
        cow._id === editingCow._id ? response.data.cow : cow
      ));
      setEditingCow(null);
      toast.success("Animal details updated successfully!");
      
      // Refresh the page after successful edit
      window.location.reload();
    } catch (error) {
      console.error("Error updating cow:", error);
      setError(error.response?.data?.message || "Failed to update cow");
      toast.error("Failed to update animal details");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCow(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCows = cows.filter((cow) => {
    if (!cow) return false;
    
    const searchValue = searchTerm.toLowerCase();
    return (
      (cow.animal_id && cow.animal_id.toLowerCase().includes(searchValue)) ||
      (cow.status && cow.status.toLowerCase().includes(searchValue)) ||
      (cow.disease_name && cow.disease_name.toLowerCase().includes(searchValue)) ||
      (cow.vaccine_name && cow.vaccine_name.toLowerCase().includes(searchValue))
    );
  });

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.text("Animal Health Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Animal ID", "Status", "Disease", "Vaccine", "Vaccination Date", "Days"]],
      body: filteredCows.map((cow) => [
        cow.animal_id,
        cow.status,
        cow.disease_name || "N/A",
        cow.vaccine_name || "N/A",
        cow.vaccination_date || "N/A",
        dayCounts[cow._id] !== undefined ? dayCounts[cow._id] + " days" : "N/A"
      ]),
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("AnimalHealthReport.pdf");
  };

  const handleSendReport = () => {
    const phonenumber = "+94764050673";
    const message = `Animal Health Report`;
    const WhatsAppUrl = `http://web.Whatsapp.com/send?phone=${phonenumber}&text=${encodeURIComponent(message)}`;

    window.open(WhatsAppUrl, "_blank");
  };

  return (
    <div className="cows-container">
      <h1 className="cows-title">Cows Health Details</h1>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      <input
        type="text"
        placeholder="Search by ID, Status, Disease, or Vaccine"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <div ref={componentRef} className="cows-list">
        {filteredCows.map((cow) => (
          <div key={cow._id} className="cow-item">
            <div className="cow-card">
              <h2 className="cow-title">Animal ID: {cow.animal_id}</h2>
              <div className="cow-info">
                <p><strong>Status:</strong> {cow.status}</p>
                <p><strong>Disease Name:</strong> {cow.disease_name}</p>
                <p><strong>Vaccine Name:</strong> {cow.vaccine_name}</p>
                <p><strong>Vaccination Date:</strong> {cow.vaccination_date}</p>
                {dayCounts[cow._id] !== undefined && (
                  <p><strong>Days Since Vaccination:</strong> {dayCounts[cow._id]} day(s)</p>
                )}
              </div>
              <div className="cow-actions">
                <button onClick={() => handleEdit(cow)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(cow._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleDownloadReport} className="download-btn">Download Report</button>
      <button onClick={handleSendReport} className="download-btn">Send WhatsApp Message</button>

      {/* Edit Modal */}
      {editingCow && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Animal Details</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Animal ID:</label>
                <input
                  type="text"
                  name="animal_id"
                  value={editingCow.animal_id}
                  readOnly
                  required
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  name="status"
                  value={editingCow.status}
                  onChange={handleEditChange}
                  required
                >
                  <option value="Healthy">Healthy</option>
                  <option value="Sick">Sick</option>
                  <option value="Recovered">Recovered</option>
                  <option value="Vaccinated">Vaccinated</option>
                </select>
              </div>
              <div className="form-group">
                <label>Disease Name:</label>
                <input
                  type="text"
                  name="disease_name"
                  value={editingCow.disease_name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Vaccine Name:</label>
                <select
                  name="vaccine_name"
                  value={editingCow.vaccine_name}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Vaccine</option>
                  {vaccineOptions.map((vaccine) => (
                    <option key={vaccine._id} value={vaccine.vaccine_name}>
                      {vaccine.vaccine_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Vaccination Date:</label>
                <input
                  type="date"
                  name="vaccination_date"
                  value={editingCow.vaccination_date}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => setEditingCow(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={false} />
    </div>
  );
}

export default Cows; 