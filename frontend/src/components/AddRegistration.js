import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import moment from 'moment';

function AddRegistration({ onAddRegistration }) {

  const [show, setShow] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [classId, setClassId] = useState('');
  const [dateTimeOfClass, setDateTimeOfClass] = useState(new Date());
  const [action, setAction] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState('');

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleClose = () => {
    setShow(false);
    setStudentId('');
    setInstructorId('');
    setClassId('');
    setDateTimeOfClass(new Date());
    setAction('New');
  };

  const handleShow = () => setShow(true);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formattedDate = moment(dateTimeOfClass).format('YYYY-MM-DDTHH:mm:ss');
    onAddRegistration({ studentId, instructorId, classId, date: formattedDate, action });
    setShow(false);
  }

  const handleModalClose = () => {
    window.location.reload();
  }
  
  const handleSaveButtonClick = () => {
    const formattedDate = moment(dateTimeOfClass).format('YYYY-MM-DDTHH:mm:ss');
    fetch('http://localhost:5000/schedules/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        studentId,
        instructorId,
        classId,
        date: formattedDate,
        action
      })
    })
      .then(res => res.json())
      .then(data => {
        setShowModal(true);
        setData(data);
        onAddRegistration({ studentId, instructorId, classId, date: formattedDate, action });
        setShow(false);
        setStudentId('');
        setInstructorId('');
        setClassId('');
        setDateTimeOfClass(new Date());
        setAction('New');
      })
      .catch(error => setShowModal(true));
  }


  return (
    <>
      <Button variant="outline-dark" onClick={handleShow}>Add Registration</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Schedule Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="studentId">
              <Form.Label>Student Id</Form.Label>
              <Form.Control type="number" required placeholder="Enter Student Id" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
            </Form.Group>
            <br />
            <Form.Group controlId="instructorId">
              <Form.Label>Instructor Id</Form.Label>
              <Form.Control type="number" required placeholder="Enter Instructor Id" value={instructorId} onChange={(e) => setInstructorId(e.target.value)} />
            </Form.Group>
            <br />
            <Form.Group controlId="classId">
              <Form.Label>Class Id</Form.Label>
              <Form.Control type="number" required placeholder="Enter Class Id" value={classId} onChange={(e) => setClassId(e.target.value)} />
            </Form.Group>
            <br />
            <Form.Group controlId="dateTimeOfClass">
              <Form.Label>Date and Time of Class</Form.Label>
              <DatePicker
                selected={dateTimeOfClass}
                onChange={date => setDateTimeOfClass(date)}
                showTimeInput
                showTimeSelect
                timeInputLabel='choose time of class'
                dateFormat='yyyy-MM-dd h:mm aa'
                timeFormat='h:mm aa'
                className="form-control"
              />
            </Form.Group>
            <br />
            <Form.Group controlId="action">
              <Form.Label>Action</Form.Label>
              <Form.Control as="select" required value={action} onChange={(e) => setAction(e.target.value)}>
                <option value="" disabled>Select Action New</option>
                <option value="New">New</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>X</Button>
          <Button variant="primary" onClick={handleSaveButtonClick}>Add Class</Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>ALERT</Modal.Title>
        </Modal.Header>
        <Modal.Body>{data}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Close</Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default AddRegistration;