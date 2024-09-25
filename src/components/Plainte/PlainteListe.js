import React, { useState, useEffect } from 'react';
import { List, Button, Card, Typography, Divider, Space, Input, message, Modal } from 'antd';
import { CheckCircleOutlined, ArrowRightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import './PlainteListe.css';

const { Text, Title } = Typography;
const { TextArea } = Input;

const PlainteListe = () => {
  const [plaintes, setPlaintes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showResponseBox, setShowResponseBox] = useState({});
  const [responseText, setResponseText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlainte, setSelectedPlainte] = useState({});

  useEffect(() => {
    const fetchPlaintes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/plaintes');
        setPlaintes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des plaintes:', error);
        setError('Erreur lors de la récupération des plaintes.');
        setLoading(false);
      }
    };

    fetchPlaintes();
  }, []);

  const handleArchive = async (id) => {
    try {
      await axios.post(`http://localhost:5000/plaintes/${id}/archiver`);
      const updatedPlaintes = plaintes.filter(plainte => plainte.id !== id);
      setPlaintes(updatedPlaintes);
      message.success('Plainte archivée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'archivage de la plainte:', error);
      message.error('Erreur lors de l\'archivage de la plainte');
    }
  };

  const handleToggleResponseBox = (id) => {
    setShowResponseBox(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendResponse = async (id) => {
    if (!responseText) return;

    try {
      await axios.put(`http://localhost:5000/plaintes/${id}/repondre`, { reponse: responseText });
      const updatedPlaintes = plaintes.map(plainte => {
        if (plainte.id === id) {
          return { ...plainte, reponse: responseText };
        }
        return plainte;
      });
      setPlaintes(updatedPlaintes);
      setShowResponseBox(prev => ({ ...prev, [id]: false }));
      setResponseText('');
      message.success('Réponse envoyée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      message.error('Erreur lors de l\'envoi de la réponse');
    }
  };

  const handleViewResponse = (plainte) => {
    setSelectedPlainte(plainte);
    setModalVisible(true);
  };

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="plainte-container">
<h2 className="titre-liste"  style={{ 
  textAlign: 'center', 
  color: '#2B6CC4', 
  fontFamily: 'Arial, sans-serif', 
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
  margin: '20px 0', 
  padding: '10px 0' 
}}>Liste des Plaintes</h2>      <Divider />
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={plaintes}
        renderItem={plainte => (
          <List.Item>
            <Card hoverable className="plainte-card">
            <Text strong style={{ fontSize: '17px' }}>{`${plainte.titre}`}</Text>
            <br /> {/* Ajout de retour à la ligne */}              
            <Space direction="vertical" size="small">
                <Text style={{ fontSize: '17px' }}>{` ${plainte.description}`}</Text>
                <Text style={{ fontSize: '17px' }}>{`Envoyé par ${plainte.nom_citoyen} ${plainte.prenom_citoyen} le ${new Date(plainte.created_at).toLocaleDateString()}`}</Text>
                {plainte.reponse ? (
                  <>
                    <Text type="success" style={{ fontSize: '16px' }}>Réussi <CheckCircleOutlined /></Text>
                    <Button
  type="primary"
  onClick={() => handleViewResponse(plainte)}
  style={{ backgroundColor: '#006bbd', borderColor: '#006bbd' }} // Ajout du style
>
  Voir Détails
</Button>
                  </>
                ) : (
                  <>
                    <Text type="warning" style={{ fontSize: '16px' }}>
                      <ClockCircleOutlined style={{ marginRight: '5px' }} />
                      En attente
                    </Text>
                  </>
                )}
              </Space>
              <div className="plainte-actions">
                {plainte.reponse ? (
                  <Button
  type="primary"
  onClick={() => handleArchive(plainte.id)}
  style={{ backgroundColor: '#006bbd', borderColor: '#006bbd' }}
>
  Archiver
</Button>
                ) : (
<Button
  type="primary"
  onClick={() => handleToggleResponseBox(plainte.id)}
  style={{ backgroundColor: '#006bbd', borderColor: '#006bbd' }}
>
  Répondre
</Button>
                )}
                {showResponseBox[plainte.id] && !plainte.reponse && (
                  <div>
                    <TextArea
                      rows={4}
                      value={responseText}
                      onChange={e => setResponseText(e.target.value)}
                      placeholder="Écrivez votre réponse ici..."
                      className="response-textarea"
                    />
                    <Button type="primary" onClick={() => handleSendResponse(plainte.id)} style={{ marginTop: '10px',backgroundColor: '#006bbd', borderColor: '#006bbd' }}>Envoyer</Button>
                  </div>
                )}
              </div>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title={null}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        className="chat-modal pointy-modal"
      >
        <div className="demande-detail-container">
        <Title level={2} style={{ textAlign: 'center', fontSize: '20px', color: '#1E0F1C', fontWeight: 'bold' }}>{selectedPlainte.titre}</Title>
        <Divider className="demande-divider" />
          <div className="chat-container">
            <div className="question">
              <Text strong>Citoyen :</Text> {selectedPlainte.description}
            </div>
            <Divider className="message-divider" />
            <div className="response">
              <Space>
              <img
                        src={`${process.env.PUBLIC_URL}/images/flech.png`}
                        alt="Fleche"
                        style={{ width: '16px', height: '16px', marginRight: '5px' }}
                      />                <Text>{selectedPlainte.reponse}</Text>
              </Space>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlainteListe;
