

import React, { useState, useEffect } from 'react';
import { List, Avatar, Button, message, Card, Typography, Divider } from 'antd';
import { useAuth } from '../../hooks/AuthContext';
import axios from 'axios';

const { Title, Text } = Typography;

const Plainte = () => {
  const [demandes, setDemandes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/demande/conseiller/${user.id}`);
        setDemandes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes d\'accès à l\'information:', error);
      }
    };

    fetchDemandes();
  }, [user.id]);

  const effacerDemande = async (demandeId) => {
    try {
      await axios.delete(`http://localhost:5000/demande/conseiller/${user.id}/${demandeId}`);
      message.success('Demande effacée avec succès');
      const response = await axios.get(`http://localhost:5000/demande/conseiller/${user.id}`);
      setDemandes(response.data);
    } catch (error) {
      console.error('Erreur lors de la suppression de la demande:', error);
      message.error('Erreur lors de la suppression de la demande');
    }
  };

  const accepterDemande = async (demandeId) => {
    try {
      await axios.put(`http://localhost:5000/demande/conseiller/${user.id}/${demandeId}/accepter`);
      message.success('Demande acceptée avec succès');
      const response = await axios.get(`http://localhost:5000/demande/conseiller/${user.id}`);
      setDemandes(response.data);
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande:', error);
      message.error('Erreur lors de l\'acceptation de la demande');
    }
  };

  return (
    <div className="demande-container">
      <Title level={2} className="title">Liste des demandes d'accès à l'information</Title>
      <Divider />
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={demandes}
        renderItem={item => (
          <List.Item>
            <Card hoverable className="demande-card">
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: '#87d068' }}>{item.nom_citoyen[0]}</Avatar>}
                title={<Text strong>{item.titre}</Text>}
                description={
                  <>
                    <Text>{`Demande à ${item.nom_administration} par ${item.nom_citoyen} ${item.prenom_citoyen} le ${new Date(item.created_at).toLocaleDateString()}`}</Text>
                    <Text>{item.description}</Text>
                    <div className="demande-actions">
                      <Button onClick={() => effacerDemande(item.id)} type="link" danger>Effacer</Button>
                      <Button onClick={() => accepterDemande(item.id)} type="link">Accepter</Button>
                    </div>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Plainte;
