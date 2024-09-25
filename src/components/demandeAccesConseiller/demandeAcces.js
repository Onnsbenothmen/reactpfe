import React, { useState, useEffect } from 'react';
import { List, Button, message, Card, Typography, Divider, Modal, Space } from 'antd';
import { useAuth } from '../../hooks/AuthContext';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const DemandeAcces = () => {
  const [demandes, setDemandes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedDemande, setSelectedDemande] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/demande/conseillerff/${user.id}`);
        setDemandes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes d\'accès à l\'information:', error);
      }
    };

    fetchDemandes();
  }, [user.id]);

  const accepterDemande = async (demandeId) => {
    try {
      await axios.put(`http://localhost:5000/demande/conseiller/${user.id}/${demandeId}/accepter`);
      message.success('Demande acceptée avec succès');
      filtrerDemandesAcceptees(demandeId);
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande:', error);
      message.error('Erreur lors de l\'acceptation de la demande');
    }
  };

  const archiverDemande = async (demandeId) => {
    try {
      await axios.put(`http://localhost:5000/demande/conseiller/${user.id}/${demandeId}/archiver`);
      message.success('Demande archivée avec succès');
      filtrerDemandesAcceptees(demandeId);
    } catch (error) {
      console.error('Erreur lors de l\'archivage de la demande:', error);
      message.error('Erreur lors de l\'archivage de la demande');
    }
  };

  const filtrerDemandesAcceptees = (demandeId) => {
    setDemandes(demandes.filter(demande => demande.id !== demandeId));
  };

  const showModal = (demande) => {
    setSelectedDescription(demande.description);
    setSelectedDemande(demande);
    setModalVisible(true);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div className="container">
      <h1
        className="titre-liste"
        style={{
          textAlign: 'center',
          color: '#2B6CC4',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          margin: '20px 0',
          padding: '10px 0'
        }}
      >
         Demandes d'accès à l'information
      </h1>
      <Divider />

      <List
        itemLayout="vertical"
        size="large"
        dataSource={demandes}
        renderItem={item => (
          <List.Item key={item.id}>
            <Card
              hoverable
              style={{
                border: '2px solid #006bbd',
                borderRadius: '8px',
                padding: '10px',
                transition: 'border-color 0.3s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2B6CC4'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#006bbd'; }}
            >
              <a href="#" className="card-title" onClick={() => showModal(item)}>
                {item.titre}
              </a>
              <br />
              <span className="text-muted">
                {`Demande à ${item.nom_administration} par ${item.nom_citoyen} ${item.prenom_citoyen} `}
                <Text type="secondary" className="custom-date">
                  {'le ' + new Date(item.created_at).toLocaleDateString()}
                </Text>
              </span>
              <br />

              <div className="demande-actions" style={{ float: 'right' }}>
                <Space>
                  <Button
                    type="primary"
                    style={{ backgroundColor: '#006bbd', borderColor: '#006bbd' }}
                    onClick={() => accepterDemande(item.id)}
                  >
                    Accepter
                  </Button>
                  <Button onClick={() => archiverDemande(item.id)}>Archiver</Button>
                </Space>
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Fermer
          </Button>,
        ]}
      >
        {selectedDemande && (
          <div>
            <div
              className="modal-title"
              style={{ color: '#006bbd', textAlign: 'center', fontSize: '24px' }}
            >
              {selectedDemande.titre}
            </div>
            <br />
            <Paragraph>{selectedDescription}</Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DemandeAcces;
