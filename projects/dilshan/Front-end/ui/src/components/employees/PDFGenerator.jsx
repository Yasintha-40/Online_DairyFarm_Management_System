import React from 'react';
import { jsPDF } from 'jspdf';

const PDFGenerator = ({ employees }) => {
  const generatePDF = () => {
    try {
      console.log('Starting PDF generation...');
      console.log('Employees data received:', employees);
      
      if (!employees || employees.length === 0) {
        console.error('No employee data available');
        alert('No employee data available to generate PDF');
        return;
      }

      // Create new PDF document
      const doc = new jsPDF();
      console.log('PDF document created');
      
      // Set font
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      
      // Add title
      doc.text('Employee List', 20, 20);
      console.log('Title added to PDF');
      
      // Set font for content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      
      // Add employee data
      let yPosition = 30;
      employees.forEach((employee, index) => {
        console.log(`Processing employee ${index + 1}:`, employee);
        
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          console.log('New page added');
        }
        
        const employeeText = [
          `Employee ${index + 1}:`,
          `Name: ${employee.name || 'N/A'}`,
          `ID: ${employee.employeeId || 'N/A'}`,
          `Gender: ${employee.gender || 'N/A'}`,
          `Birth Date: ${employee.birthdate ? new Date(employee.birthdate).toLocaleDateString() : 'N/A'}`
        ];
        
        employeeText.forEach((text, i) => {
          doc.text(text, 20, yPosition + (i * 7));
        });
        
        // Add a line separator
        doc.line(20, yPosition + 35, 190, yPosition + 35);
        
        yPosition += 45;
      });
      
      console.log('All employee data added to PDF');
      
      // Save the PDF
      doc.save('employee_list.pdf');
      console.log('PDF saved successfully');
    } catch (error) {
      console.error('Detailed PDF Generation Error:', error);
      console.error('Error stack:', error.stack);
      alert(`Error generating PDF: ${error.message}\nCheck console for details.`);
    }
  };

  return (
    <button onClick={generatePDF} className="btn btn-primary">
      Download PDF
    </button>
  );
};

export default PDFGenerator; 