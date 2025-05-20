import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Badge, Modal, Form, InputGroup, Toast } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Services = () => {
    const [animalServices, setAnimalServices] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('animalId'); // 'animalId', 'serviceId', or 'age'
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        fetchAnimalServices();
    }, []);

    const fetchAnimalServices = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/animal-services');
            // Sort services by serviceId in ascending order
            const sortedServices = response.data.sort((a, b) => a.serviceId - b.serviceId);
            setAnimalServices(sortedServices);
        } catch (error) {
            console.error('Error fetching animal services:', error);
        }
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:3000/api/animal-services/${selectedService._id}`, {
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
            alert('Error updating service. Please try again.');
        }
    };

    const handleDelete = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await axios.delete(`http://localhost:3000/api/animal-services/${serviceId}`);
                fetchAnimalServices();
            } catch (error) {
                console.error('Error deleting service:', error);
                alert('Error deleting service. Please try again.');
            }
        }
    };

    const handleAnimalServiceNotificationToggle = async (service) => {
        try {
            await axios.patch(`http://localhost:3000/api/animal-services/${service._id}`, {
                isNotified: !service.isNotified
            });
            fetchAnimalServices();
        } catch (error) {
            console.error('Error updating animal service notification status:', error);
            alert('Error updating notification status. Please try again.');
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
            alert('Failed to copy to clipboard');
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

            // Prepare table data
            const tableData = filteredServices.map(service => [
                service.serviceId,
                service.animalId,
                service.age,
                service.serviceType,
                service.notes || 'N/A',
                service.status || 'Pending',
                service.isNotified ? 'Notified' : 'Pending'
            ]);

            // Add table using autoTable
            autoTable(doc, {
                head: [['Service ID', 'Animal ID', 'Age', 'Service Type', 'Notes', 'Status', 'Notification']],
                body: tableData,
                startY: 35,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] }
            });

            // Save the PDF
            doc.save('animal-services-report.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Animal Services</h2>
            
            <div className="d-flex justify-content-end mb-3">
                <Button 
                    variant="outline-primary" 
                    onClick={handleDownloadPDF}
                    size="sm"
                    style={{ 
                        padding: '0.15rem 0.35rem', 
                        fontSize: '0.75rem',
                        width: 'auto',
                        minWidth: '45px'
                    }}
                >
                    <i className="fas fa-file-pdf me-1"></i>
                    PDF
                </Button>
            </div>

            {/* Search Section */}
            <div className="mb-3">
                <InputGroup>
                    <Form.Select 
                        value={searchType} 
                        onChange={handleSearchTypeChange}
                        style={{ maxWidth: '200px' }}
                    >
                        <option value="animalId">Search by Animal ID</option>
                        <option value="serviceId">Search by Service ID</option>
                        <option value="age">Search by Age</option>
                        <option value="status">Search by Status</option>
                    </Form.Select>
                    <Form.Control
                        type="text"
                        placeholder={`Search by ${searchType}...`}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </InputGroup>
            </div>

            <Table striped bordered hover>
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
                                <Badge bg={
                                    service.status === 'Completed' ? 'success' : 
                                    service.status === 'In Progress' ? 'primary' : 
                                    service.status === 'Cancelled' ? 'danger' : 'warning'
                                }>
                                    {service.status || 'Pending'}
                                </Badge>
                            </td>
                            <td>
                                <Badge bg={service.isNotified ? "success" : "warning"}>
                                    {service.isNotified ? "Notified" : "Pending"}
                                </Badge>
                            </td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="info" 
                                        size="sm"
                                        onClick={() => handleEdit(service)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        size="sm"
                                        onClick={() => handleDelete(service._id)}
                                    >
                                        Delete
                                    </Button>
                                    <Button 
                                        variant={service.isNotified ? "success" : "warning"} 
                                        size="sm"
                                        onClick={() => handleAnimalServiceNotificationToggle(service)}
                                    >
                                        {service.isNotified ? "Mark as Pending" : "Mark as Notified"}
                                    </Button>
                                    <Button 
                                        variant="success" 
                                        size="sm"
                                        onClick={() => handleCopyAndWhatsApp(service)}
                                    >
                                        Copy & WhatsApp
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Toast Notification */}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
                <Toast show={showToast} onClose={() => setShowToast(false)}>
                    <Toast.Header>
                        <strong className="me-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body>Service details copied to clipboard!</Toast.Body>
                </Toast>
            </div>

            {/* Edit Service Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Animal Service</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedService && (
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Animal ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedService.animalId}
                                    onChange={(e) => setSelectedService({...selectedService, animalId: e.target.value})}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Age</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedService.age}
                                    onChange={(e) => setSelectedService({...selectedService, age: e.target.value})}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Service Type</Form.Label>
                                <Form.Select
                                    value={selectedService.serviceType}
                                    onChange={(e) => setSelectedService({...selectedService, serviceType: e.target.value})}
                                    required
                                >
                                    <option value="">Select Service</option>
                                    <option value="Veterinary Checkup">Veterinary Checkup</option>
                                    <option value="Hoof Check">Hoof Check</option>
                                    <option value="Breeding Check">Breeding Check</option>
                                    <option value="Tag Check">Tag Check</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={selectedService.status || 'Pending'}
                                    onChange={(e) => setSelectedService({...selectedService, status: e.target.value})}
                                    required
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedService.notes || ''}
                                    onChange={(e) => setSelectedService({...selectedService, notes: e.target.value})}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Update Service
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Services; 