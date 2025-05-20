import React, { useState, useEffect, useRef } from 'react';
import Nav from "../Nav/Nav";
import Footer from '../Footer/Footer';
import axios from 'axios';
import Vaccine from '../Vaccine/Vaccine';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import './Vaccines.css';

const URL = 'http://localhost:5005/vaccines';

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Vaccines() {
  const [vaccines, setVaccines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const componentRef = useRef(null);

  useEffect(() => {
    fetchHandler().then((data) => setVaccines(data.vaccines));
  }, []);

  const handleDelete = (deletedVaccineId) => {
    setVaccines((prevVaccines) => prevVaccines.filter((vaccine) => vaccine._id !== deletedVaccineId));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredVaccines = vaccines.filter((vaccine) =>
    vaccine.vaccine_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vaccine.vaccine_name && vaccine.vaccine_name.toLowerCase().includes(searchTerm.toLowerCase()))||
    (vaccine.disease_name && vaccine.disease_name.toLowerCase().includes(searchTerm.toLowerCase()))||
    vaccine.target.toLowerCase().includes(searchTerm.toLowerCase()) 
     
    
  );

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.text("Vaccine Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Vaccine ID","Vaccine Name","Disease Name", "Target", "Description"]],
      body: filteredVaccines.map((vaccine) => [
        vaccine.vaccine_id,
        vaccine.vaccine_name|| "N/A",
        vaccine.disease_name || "N/A",
        vaccine.target ,
        vaccine.description || "N/A"
      ]),
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("VaccineReport.pdf");
  };

  const handleSendReport=() =>{
    const phonenumber = "+94764050673";
    const message =`selected User Report`
    const WhatsAppUrl = `http://web.Whatsapp.com/send?phone=${phonenumber}&text=${encodeURIComponent(message)}`;

    window.open(WhatsAppUrl , "_blank");
  }

  return (
    <div>
      <Nav />
    <div className="vaccines-container">
      
      <h1 className="vaccines-title">Vaccines Health Details</h1>
      <input
        type="text"
        placeholder="Search by ID,Disease,target or Vaccine"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <div ref={componentRef} className="vaccines-list">
        {filteredVaccines.map((vaccine) => (
          <div key={vaccine._id} className="vaccine-item">
            <Vaccine vaccine={vaccine} onDelete={handleDelete} />
          </div>
        ))}
      </div>
      <button onClick={handleDownloadReport} className="download-btn">Download Report</button><br/>
      <button onClick={handleSendReport} className="download-btn">Send Whatsapp Message</button>
      
      
    </div>
    <Footer/>
    </div>
  );
}

export default Vaccines;
