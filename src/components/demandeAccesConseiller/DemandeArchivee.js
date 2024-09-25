import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Card, Typography, Button, message } from 'antd';
import './DemandeArchivee.css'; // Fichier CSS pour les styles personnalisés

const { Text } = Typography;

const DemandeArchivee = () => {
  const [demandesArchivees, setDemandesArchivees] = useState([]);

  useEffect(() => {
    const fetchDemandesArchivees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/demande_archivee');
        setDemandesArchivees(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des demandes archivées !', error);
      }
    };

    fetchDemandesArchivees();
  }, []);

  const desarchiverDemande = async (demandeId) => {
    try {
      // Envoyer une requête pour désarchiver la demande
      await axios.put(`http://localhost:5000/api/demande/${demandeId}/desarchiver`);
      // Actualiser la liste des demandes archivées après le désarchivage
      setDemandesArchivees(demandesArchivees.filter(demande => demande.id !== demandeId));
      // Afficher un message de succès
      message.success('Demande désarchivée avec succès');
    } catch (error) {
      console.error('Erreur lors du désarchivage de la demande !', error);
      message.error('Erreur lors du désarchivage de la demande');
    }
  };

  return (
    <div className="demandes-archivees-container">
      <h2 className="demandes-archivees-title">Liste des Demandes Archivées</h2>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={demandesArchivees}
        renderItem={demande => (
          <List.Item>
            <Card className="demande-card" hoverable>
              <div>
                <Text strong>{demande.titre}</Text>
                <br />
                <Text>{`Demande par ${demande.nom_citoyen} ${demande.prenom_citoyen}`}</Text>
                <br />
                <Text type="secondary">{`Date: ${new Date(demande.created_at).toLocaleDateString()}`}</Text>
                <br />
                <Button type="primary" onClick={() => desarchiverDemande(demande.id)}>Désarchiver</Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default DemandeArchivee;
