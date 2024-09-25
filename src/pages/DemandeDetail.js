import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Divider } from 'antd';
import './DemandeDetail.css'; // Importer le fichier CSS personnalisé

const { Title, Paragraph, Text } = Typography;

const DemandeDetail = () => {
  const { demandeId } = useParams();
  const [demande, setDemande] = useState(null);

  useEffect(() => {
    const fetchDemande = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/demande/${demandeId}`);
        setDemande(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la demande:', error);
      }
    };

    fetchDemande();
  }, [demandeId]);

  if (!demande) {
    return <div>Chargement...</div>;
  }

  const titreStyle = {
    color: '#006bbd', // Couleur du titre
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  return (
    <div className="demande-detail-container">
      <Title level={2} style={titreStyle}>{demande.titre}</Title>
      <Divider className="demande-divider" />
      <div className="chat-container">
        <div className="question">
          <Text strong>Citoyen :</Text> {demande.description}
        </div>
        <Divider className="message-divider" />
        <div className="response">
          <Text strong>Administrateur :</Text> {demande.reponse}
        </div>
      </div>
    </div>
  );
};

export default DemandeDetail;
