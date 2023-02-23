import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import moment from 'moment';
import AddRegistration from './AddRegistration';
import './popup.css';
import { Modal, Button } from 'react-bootstrap';


function Table1() {

    const [registrations, setRegistrations] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedRowU, setSelectedRowU] = useState(null);
    const [selectedRowD, setSelectedRowD] = useState(null);
    const [formData, setFormData] = useState({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showModalD, setShowModalD] = useState(false);
    const [showErrorModalD, setShowErrorModalD] = useState(false);


    function handleDownload() {
        if (!showConfirmationModal) {
            setShowConfirmationModal(true);
        } else {
            axios.get("http://localhost:5000/download", {
                responseType: "blob",
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "schedules.csv");
                document.body.appendChild(link);
                link.click();
            });
            setShowConfirmationModal(false);
        }
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    function handleRowClick(index) {
        setSelectedRow(index);
    }

    function handleRowClickU(index) {
        setSelectedRowU(index);
    }

    function handleRowClickD(index) {
        setSelectedRowD(index);
    }

    function addRegistration(newRegistration) {
        setRegistrations([...registrations, newRegistration]);
    }

    useEffect(() => {
        axios.get("http://localhost:5000/schedules")
            .then(response => setSchedules(response.data))
            .catch(error => console.log(error));
    }, []);

    function handleUpdate() {
        if (selectedRowU !== null) {
            const updatedFormData = { ...formData, action: 'Update' };
            axios.put(`http://localhost:5000/schedules/update/${schedules[selectedRowU].registrationId}`, updatedFormData)
                .then(response => {
                    const updatedSchedule = response.data;
                    setSchedules(schedules.map((schedule, index) => index === selectedRowU ? updatedSchedule : schedule));
                    setSelectedRowU(null);
                    setFormData({});
                    setShowModal(true);
                })
                .catch(error => {
                    console.log(error);
                    setShowErrorModal(true);
                });
        }
    }

    function handleDelete() {
        if (selectedRowD !== null) {
            const deletedFormData = { ...formData, action: 'Delete' };
            axios.put(`http://localhost:5000/schedules/updatecancel/${schedules[selectedRowD].registrationId}`, deletedFormData)
                .then(response => {
                    const deletedSchedule = response.data;
                    setSchedules(schedules.map((schedule, index) => index === selectedRowD ? deletedSchedule : schedule));
                    setSelectedRowD(null);
                    setFormData({});
                    setShowModalD(true);
                })
                .catch(error => {
                    console.log(error);
                    setShowErrorModalD(true);
                });
        }
    }

    //const [selectedFile, setSelectedFile] = useState(null);

    /* const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    }; */

    const [file, setFile] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/importSchedules', {
                method: 'POST',
                body: formData,
            });

            const data = await response.text();
            window.alert(data);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <>
            <h1>Schedule Classes Page</h1>
            <hr />
            <div style={{ marginTop: "5px" }}>
                <b><label className="text-primary" style={{ float: "left", marginLeft: "10px", marginTop: "6px" }}>Export Scheduled file Data .csv and see the format.</label></b>
                <button className="btn btn-outline-primary" style={{ float: "left", marginLeft: "5px" }} onClick={handleDownload}><b>Export</b></button>
                <br />
            </div>

            <div className='container'>
                <br /><br /><br />
                <h5 style={{ float: "left" }}>
                    Upload file to save all data inside to the schedules, or you can add a new registration click the button Add Registration:
                    <br /><p className='text-danger'>NOTE: DONOT ENTER THE REGISTRATION ID INSIDE THE CSV, BY DEFAULT WILL BE GENERATED..</p>
                </h5>
                <br />
                <br /><br />
                <form onSubmit={handleSubmit} >
                    <Form.Group controlId="formFileLg" className="mb-3">
                        <div style={{ display: 'flex' }}>
                            <Form.Control type="file" size="lg" name="file" onChange={handleFileChange} />
                            &nbsp;
                            <Button variant="success" type="submit" >Submit</Button>
                        </div>
                    </Form.Group>
                </form>

                <AddRegistration onAddRegistration={addRegistration} /> <hr />

                <div className="table-responsive">
                    <br />
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>StudentId</th>
                                <th>InstructorId</th>
                                <th>ClassId</th>
                                <th>DateTimeOfClass</th>
                                <th>Action</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((schedule, index) => (
                                <tr key={index}>
                                    <td><input type="text" disabled className="form-control" value={schedule.studentId} /></td>
                                    <td><input type="text" disabled className="form-control" value={schedule.instructorId} /></td>
                                    <td><input type="text" disabled className="form-control" value={schedule.classId} /></td>
                                    <td style={{ width: "200px" }}>
                                        <DatePicker
                                            className="form-control"
                                            selected={new Date(schedule.date)}
                                            dateFormat='yyyy-MM-dd h:mm aa'
                                            timeFormat='h:mm aa'
                                            disabled
                                        />
                                    </td>
                                    <td style={{ width: "120px" }}><input type="text" disabled className="form-control" value={schedule.action} /></td>
                                    <td>
                                        <button className="btn btn-outline-info" onClick={() => handleRowClick(index)}>View</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-outline-success" onClick={() => handleRowClickU(index)} data-toggle="modal" data-target="#updateModal">Update</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-outline-danger" onClick={() => handleRowClickD(index)} data-toggle="modal" data-target="#deleteModal">Cancel</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>



                {selectedRow !== null && (
                    <div className="popup">
                        <div className="popup-inner">
                            <h3>Details for schedule {selectedRow + 1}</h3>
                            <hr />
                            <div className="popup-data">
                                <p><strong>Registration ID:</strong> <u>{schedules[selectedRow].registrationId}</u></p>
                                <p><strong>Student ID:</strong>  <u>{schedules[selectedRow].studentId}</u></p>
                                <p><strong>Instructor ID:</strong>  <u>{schedules[selectedRow].instructorId}</u></p>
                                <p><strong>Class ID:</strong>  <u>{schedules[selectedRow].classId}</u></p>
                                <p><strong>Date and Time:</strong>  <u>{moment(schedules[selectedRow].date).format('LLL')}</u></p>
                            </div>
                            <hr />
                            <button className="btn btn-danger" onClick={() => setSelectedRow(null)}>Close</button>
                        </div>
                    </div>
                )}
                <br />



                {selectedRowU !== null && (
                    <div className="popup">
                        <div className="popup-inner">
                            <h3>Update schedule {selectedRowU + 1}</h3>
                            <hr />
                            <div className="popup-data">
                                <Form>
                                    <Form.Group>
                                        <Form.Label style={{ float: "left", marginTop: "1px" }}>Registration ID</Form.Label>
                                        <Form.Control name="registrationId" value={formData.registrationId || schedules[selectedRowU].registrationId} disabled />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ float: "left", marginTop: "10px", marginBottom: "1px" }}>Student ID</Form.Label>
                                        <Form.Control type="number" name="studentId" value={formData.studentId || schedules[selectedRowU].studentId} onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ float: "left", marginTop: "10px", marginBottom: "1px" }}>Instructor ID</Form.Label>
                                        <Form.Control type="number" name="instructorId" value={formData.instructorId || schedules[selectedRowU].instructorId} onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ float: "left", marginTop: "10px", marginBottom: "1px" }}>Class ID</Form.Label>
                                        <Form.Control type="number" name="classId" value={formData.classId || schedules[selectedRowU].classId} onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ float: "left", marginTop: "10px", marginBottom: "1px" }}>Date and Time of Class</Form.Label>
                                        <DatePicker
                                            className="form-control"
                                            selected={formData.date ? new Date(formData.date) : new Date(schedules[selectedRowU].date)}
                                            showTimeInput
                                            timeInputLabel='Time Start of Class'
                                            dateFormat='yyyy-MM-dd h:mm aa'
                                            timeFormat='h:mm aa'
                                            onChange={date => setFormData({ ...formData, date: date.toISOString() })}
                                        />
                                    </Form.Group>
                                    <Form.Label style={{ float: "left", marginTop: "10px", marginBottom: "1px" }}>Action</Form.Label>
                                    <select
                                        className="form-select"
                                        value={formData.action || schedules.action} onChange={handleInputChange} defaultValue="Update"
                                    >
                                        <option value="Update">Update</option>
                                    </select>
                                </Form>
                            </div>
                            <hr />
                            <div style={{ float: "right" }}>
                                <button className="btn btn-danger" onClick={() => setSelectedRowU(null)}>X</button>
                                &nbsp;
                                <button className="btn btn-primary" onClick={handleUpdate}>Update Class</button>
                            </div>
                        </div>
                    </div>
                )}



                {selectedRowD !== null && (
                    <div className="popup">
                        <div className="popup-inner">
                            <h3>Cancel schedule {selectedRowD + 1}</h3>
                            <hr />
                            <div className="popup-data">
                                <Form>
                                    <Form.Group>
                                        <Form.Label style={{ float: "left", marginTop: "1px" }}>Registration ID</Form.Label>
                                        <Form.Control name="registrationId" value={formData.registrationId || schedules[selectedRowD].registrationId} disabled />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ float: "left", marginTop: "10px", marginBottom: "1px" }}>Student ID</Form.Label>
                                        <Form.Control type="number" name="studentId" placeholder='Donot forget to make it null "0"' onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ float: "left", marginTop: "10px", marginBottom: "1px" }}>Instructor ID</Form.Label>
                                        <Form.Control type="number" name="instructorId" placeholder='Donot forget to make it null "0"' onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ float: "left", marginTop: "10px", marginBottom: "1px" }}>Class ID</Form.Label>
                                        <Form.Control type="number" name="classId" placeholder='Donot forget to make it null "0"' onChange={handleInputChange} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label style={{ float: "left", marginTop: "10px", marginBottom: "1px" }}>Date and Time</Form.Label>
                                        <DatePicker
                                            className="form-control"
                                            selected={formData.date ? new Date(formData.date) : new Date(schedules[selectedRowD].date)}
                                            showTimeInput
                                            timeInputLabel='Time Start of Class'
                                            dateFormat='yyyy-MM-dd h:mm aa'
                                            timeFormat='h:mm aa'
                                            onChange={date => setFormData({ ...formData, date: date })}
                                        />
                                    </Form.Group>
                                    <Form.Label style={{ float: "left", marginTop: "10px", marginBottom: "1px" }}>Action</Form.Label>
                                    <select
                                        className="form-select"
                                        value={formData.action || schedules.action} onChange={handleInputChange} defaultValue="Delete"
                                    >
                                        <option value="Delete" >Delete</option>
                                    </select>
                                </Form>
                            </div>
                            <hr />
                            <div style={{ float: "right" }}>
                                <button className="btn btn-danger" onClick={() => setSelectedRowD(null)}>X</button>
                                &nbsp;
                                <button className="btn btn-primary" onClick={handleDelete}>Delete Class</button>
                            </div>
                        </div>
                    </div>
                )}



                <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Export Schedule</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to export all the scheduled classes?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowConfirmationModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleDownload}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>



                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Schedule Updated Successfully</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        The schedule has been updated successfully.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>An error occurred while updating the schedule:</h5>
                        <p>You need to re-select the same date if you want to keep it the same..<br/><b> NOTE: check if there's another schedule for the same Student/Instructor in the same Date and Time you trying to put..</b></p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>



                <Modal show={showModalD} onHide={() => setShowModalD(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Schedule Cancelled Successfully</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        The schedule has been cancelled successfully..
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModalD(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showErrorModalD} onHide={() => setShowErrorModalD(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>An error occurred while canceling the schedule:</h5>
                        <p>You need to re-select the same date if you don't want to change it..</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowErrorModalD(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );

}

export default Table1;