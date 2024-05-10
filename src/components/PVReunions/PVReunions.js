import React, { useState } from 'react';
import { Radio, Button } from 'antd';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Meet from './Meet';
import Presentielle from './Presentielle';
import './PVReunions.css';

const PVReunions = () => {
  const [meetingType, setMeetingType] = useState('');

  const handleSelection = (meetingDetails) => {
    console.log(meetingDetails);
  };

  const handleChange = (event) => {
    setMeetingType(event.target.value);
  };

  return (
    <Container className="reunions-container">
      <Row>
        <Col>
          <h2 className="text-center">Sélectionner le Type de Réunion</h2>
          <Radio.Group onChange={handleChange} value={meetingType}>
            <Radio value="en_meet" className="text-center">Réunion en Meet</Radio>
            <Radio value="presentielle" className="text-center">Réunion Présentielle</Radio>
          </Radio.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          {meetingType === 'en_meet' && (
            <Card className="meeting-card">
              <Card.Body>
                <Meet handleSelection={handleSelection} meetingType={meetingType} />
              </Card.Body>
            </Card>
          )}
          {meetingType === 'presentielle' && (
            <Card className="meeting-card">
              <Card.Body>
                <Presentielle handleSelection={handleSelection} meetingType={meetingType} />
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PVReunions;
