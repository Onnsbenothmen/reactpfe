// Presentielle.js
import React, { useState } from 'react';
import { Input, Select, Button } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';

const { TextArea } = Input;
const { Option } = Select;

const Presentielle = ({ handleSelection }) => {
  const [meetingDetails, setMeetingDetails] = useState({
    location: '',
    date: '',
    time: '',
    agenda: '',
    organizer: '',
    status: ''
  });

  const handleInputChange = (key, value) => {
    setMeetingDetails({ ...meetingDetails, [key]: value });
  };

  const handleContinue = () => {
    handleSelection('presentielle', meetingDetails);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Réunion Présentielle</h2>
          <form>
            <Input
              placeholder="Lieu"
              value={meetingDetails.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
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
              value={meetingDetails.agenda}
              onChange={(e) => handleInputChange('agenda', e.target.value)}
            />
            <Input
              placeholder="Organisateur"
              value={meetingDetails.organizer}
              onChange={(e) => handleInputChange('organizer', e.target.value)}
            />
            <Select
              placeholder="Statut"
              value={meetingDetails.status}
              onChange={(value) => handleInputChange('status', value)}
            >
              <Option value="planifiée">Planifiée</Option>
              <Option value="annulée">Annulée</Option>
              <Option value="réalisée">Réalisée</Option>
              <Option value="en_cours">En cours</Option>
            </Select>
            <br />
            <br />
            <Button type="primary" onClick={handleContinue}>Continuer</Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default Presentielle;
