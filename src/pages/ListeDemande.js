import React, { useState, useEffect } from 'react';
import { List, Typography, Divider, Card, Badge } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ListeDemande = () => {
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/demande/statut/true');
        setDemandes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    };

    fetchDemandes();
  }, []);

  const roughBorderStyles = {
    border: '3px solid black',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    background: 'white',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div style={{
      backgroundColor: '#F0F0F0', // Remplacement de l'image par une couleur bleue
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          color: '#2B6CC4', 
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
          margin: '20px 0', 
          padding: '10px 0' 
        }}>
          Demandes d'accès à l'information 
        </h2>
        <Divider />
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={demandes}
          renderItem={item => (
            <List.Item>
              <Card
                hoverable
                className="custom-card"
                style={{ 
                  ...roughBorderStyles,
                  margin: '0 auto', 
                  maxWidth: '600px',
                  fontSize: '16px',
                  color: 'black'
                }}
                actions={[
                  <Link to={`/demande/${item.id}`} className="custom-link" style={{ color: '#2B6CC4', fontSize: '16px' }}>Voir Détails</Link>,
                  item.statut ?
                    <Badge color="green" text="Complétée" icon={<CheckCircleOutlined />} /> :
                    <Badge color="yellow" text="En attente" icon={<ClockCircleOutlined />} />
                ]}
              >
                <div style={{ position: 'relative' }}>
                </div>
                <List.Item.Meta
                  title={
                    <Link to={`/demande/${item.id}`} className="custom-link" style={{ fontSize: '18px', color: '#006bbd' }}>
                      {item.titre}
                    </Link>
                  }
                  description={
                    <div style={{ fontSize: '16px', color: 'black' }}>
                      Envoyé par {item.nom_citoyen} {item.prenom_citoyen} à {item.nom_administration} le {new Date(item.created_at).toLocaleDateString()}
                      <br />
                      <Text type="secondary" style={{ color: 'black' }}>Envoyé par {item.nom_conseiller}</Text>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ListeDemande;
