import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { TextArea } = Input;
const { Option } = Select;

const Meet = ({ handleSelection, meetingType }) => {
  const [meetingDetails, setMeetingDetails] = useState({
    lieu: '',
    date: '',
    time: '',
    user: '',
    ordre_du_jour: '',
    statut: '',
    type_reunion: meetingType
  });

  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (key, value) => {
    setMeetingDetails({ ...meetingDetails, [key]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/reunions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetingDetails)
      });
      if (response.ok) {
        handleSelection(meetingDetails);
        toast.success(`Réunion ${meetingDetails.statut} ajoutée avec succès!`);
      } else {
        console.error('Erreur lors de la création de la réunion');
        toast.error('Erreur lors de la création de la réunion');
      }
    } catch (error) {
      console.error('Erreur lors de la communication avec le serveur', error);
      toast.error('Erreur lors de la communication avec le serveur');
    }
  };
  

  return (
    <Container>
      <Row>
        <Col>
          <h2>Réunion en Meet</h2>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="lieu"
              value={meetingDetails.lieu}
              onChange={(e) => handleInputChange('lieu', e.target.value)}
            />
            <Input
              type="date"
              placeholder="Date"
              value={meetingDetails.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
            <Input
              type="time"
              placeholder="Heure"
              value={meetingDetails.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
            />
            <TextArea
              placeholder="Ordre du Jour"
              value={meetingDetails.ordre_du_jour}
              onChange={(e) => handleInputChange('ordre_du_jour', e.target.value)}
            />
            <Input
              placeholder="Nom du Président"
              value={meetingDetails.user}
              onChange={(e) => handleInputChange('user', e.target.value)}
            />
            <Select
              placeholder="Statut"
              value={meetingDetails.statut}
              onChange={(value) => handleInputChange('statut', value)}
            >
              <Option value="planifiée">Planifiée</Option>
              <Option value="annulée">Annulée</Option>
              <Option value="réalisée">Réalisée</Option>
              <Option value="en_cours">En cours</Option>
            </Select>
            <br />
            <br />
            <button type="submit">Continuer</button>
          </form>
          {showAlert && <div className="alert">Réunion {meetingDetails.statut} ajoutée avec succès!</div>}
        </Col>
      </Row>
    </Container>
  );
};

export default Meet;
