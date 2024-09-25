import React, { useState, useEffect } from 'react';
import { List, Button, Card, Typography, Divider } from 'antd';
import axios from 'axios';

const PlainteArchiveeListe = () => {
  const [plaintesArchives, setPlaintesArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaintesArchives = async () => {
      try {
        const response = await axios.get('http://localhost:5000/plaintes/archives');
        setPlaintesArchives(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des plaintes archivées:', error);
        setError('Erreur lors de la récupération des plaintes archivées.');
        setLoading(false);
      }
    };

    fetchPlaintesArchives();
  }, []);

  const handleReArchive = async (plainteId) => {
    try {
      await axios.put(`http://localhost:5000/plaintes/${plainteId}/rearchive`);
      setPlaintesArchives(prevState => prevState.filter(plainte => plainte.id !== plainteId));
    } catch (error) {
      console.error('Erreur lors du ré-archivage de la plainte:', error);
    }
  };

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <h1>Liste des Plaintes Archivées</h1>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={plaintesArchives}
        renderItem={plainte => (
          <List.Item>
            <Card title={plainte.titre} className="demande-card">
              <Typography.Paragraph>{plainte.description}</Typography.Paragraph>
              <Divider />
              <Typography.Text strong>Envoyé par:</Typography.Text> {plainte.nom_citoyen} {plainte.prenom_citoyen} le {new Date(plainte.created_at).toLocaleDateString()}
              <div className="demande-actions">
                <Button type="primary" onClick={() => handleReArchive(plainte.id)}>Ré-archiver</Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default PlainteArchiveeListe;
