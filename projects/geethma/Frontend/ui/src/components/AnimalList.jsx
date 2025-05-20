import React, { useState, useEffect } from 'react';
import axios from "axios";
import AnimalCard from './AnimalCard';
import "./AnimalList.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [searchQuery,setSearchQuery] = useState("");
  const [filteredAnimals,setfilteredAnimals] = useState([]);

  useEffect(()=>{
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = animals.filter(
      (animal)=>animal.animalid.toLowerCase().includes(lowerCaseQuery)
    );
    setfilteredAnimals(filtered);

  }, [searchQuery,animals]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/animals")
      .then((res) => {
        setAnimals(res.data);
        setfilteredAnimals(res.data);
        console.log(res.data);
      }).catch(() => {
        console.log("error while getting data");
      });
  }, []);

  //remove delete animal
  const handleDelete = (id) => {
    
    setAnimals(animals.filter(animal => animal._id !== id));
  };

  //Generating a PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.text("Animal List", 14, 15);
    
    const tableColumn = ["No.","Animal ID", "Breed","DOB","Weight","Gender","Health"];
    const tableRows = [];
  
    filteredAnimals.forEach((animal,index) => {
      const animalData = [
        index+1,
        animal.animalid || "Unknown",
        animal.breed || "Unknown",
        animal.dob || "Unknown",
        animal.weight || "Unknown",
        animal.gender || "Unknown",
        animal.health || "Unknown",
      ];
      tableRows.push(animalData);
    });
  
    //Calling auto table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    //total
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 30;
    doc.text(`Total Animals: ${filteredAnimals.length}`, 14, finalY + 10);

    doc.save("Animal_List.pdf");
  };

  const animalList = filteredAnimals.length === 0 ? "No animals found." : filteredAnimals.map((animal) =>
    <AnimalCard key={animal._id} animal={animal} onDelete={handleDelete} />
  );

  return (
    <div className="Show_AnimalList" >
      <div className="search-bar">
        <input type="text" placeholder="search animals..." value={searchQuery}
         onChange={(e)=>setSearchQuery(e.target.value)}/>
      </div>
      <h3>Animal List</h3>

      <div className="button" >
        <button onClick={generatePDF} >
          Download PDF
        </button>
        <br/><br/>
      </div>

      <div className="list">{animalList}</div>
    </div>
  );
};

export default AnimalList;
