import React, { useState, useEffect, useRef } from 'react';
import Nav from "../Nav/Nav";
import Footer from '../Footer/Footer';
import axios from 'axios';
import Cow from '../Cow/Cow';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Cows.css';

const URL = 'http://localhost:5005/cows';

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Cows() {
  const [cows, setCows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dayCounts, setDayCounts] = useState({});
  const componentRef = useRef(null);

  // ✅ To prevent duplicate toasts
  const shownToastsRef = useRef(new Set());

  useEffect(() => {
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

    fetchHandler().then((data) => {
      setCows(data.cows);
      updateDayCounts(data.cows);
    });
  }, []);

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

  const handleDelete = (deletedCowId) => {
    setCows((prevCows) => prevCows.filter((cow) => cow._id !== deletedCowId));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCows = cows.filter((cow) =>
    cow.animal_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cow.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cow.disease_name && cow.disease_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cow.vaccine_name && cow.vaccine_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    const message = `selected User Report`;
    const WhatsAppUrl = `http://web.Whatsapp.com/send?phone=${phonenumber}&text=${encodeURIComponent(message)}`;

    window.open(WhatsAppUrl, "_blank");
  };

  return (
    <div>
      <Nav />
      <div className="cows-container">
        <h1 className="cows-title">Cows Health Details</h1>
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
              <Cow cow={cow} onDelete={handleDelete} dayCount={dayCounts[cow._id]} />
            </div>
          ))}
        </div>
        <button onClick={handleDownloadReport} className="download-btn">Download Report</button><br />
        <button onClick={handleSendReport} className="download-btn">Send Whatsapp Message</button>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={false} />
    </div>
  );
}

export default Cows;
