import React, { useState, useEffect } from 'react';
import { List, Button, Card, Typography, Divider, Space, Input, message, Modal, Badge, Select } from 'antd';
import { useAuth } from '../../hooks/AuthContext';
import axios from 'axios';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const DemandeAccesDirecteur = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showResponseBox, setShowResponseBox] = useState({});
  const [responseText, setResponseText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState({});
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/demande/directeur/${user.id}`);
        setDemandes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes d\'accès à l\'information:', error);
        setError('Erreur lors de la récupération des demandes d\'accès à l\'information.');
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchDemandes();
    }
  }, [user]);

  const handleToggleResponseBox = (id) => {
    setShowResponseBox(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendResponse = async (id) => {
    if (!responseText) return;

    try {
      await axios.post(`http://localhost:5000/demande/repondre/${id}`, { reponse: responseText });
      const updatedDemandes = demandes.map(demande => {
        if (demande.id === id) {
          return { ...demande, reponse: responseText, statut: true };
        }
        return demande;
      });
      setDemandes(updatedDemandes);
      setShowResponseBox(prev => ({ ...prev, [id]: false }));
      setResponseText('');
      message.success('Réponse envoyée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      message.error('Erreur lors de l\'envoi de la réponse');
    }
  };

  const handleViewResponse = (demande) => {
    setSelectedDemande(demande);
    setModalVisible(true);
  };

  const getFilteredDemandes = () => {
    if (filter === 'reussi') {
      return demandes.filter(demande => demande.reponse);
    } else if (filter === 'en attente') {
      return demandes.filter(demande => !demande.reponse);
    } else {
      return demandes;
    }
  };

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="demande-container" >
      <h2 className="titre-liste" style={{ 
        textAlign: 'center', 
        color: '#2B6CC4', 
        fontFamily: 'Arial, sans-serif', 
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
        margin: '20px 0', 
        padding: '10px 0' 
      }}>Liste des demandes d'accès à l'information</h2>
      <Divider />
      <Select
        defaultValue="all"
        style={{ width: 120, marginBottom: '10px' }}
        onChange={value => setFilter(value)}
      >
        <Option value="all">Tous</Option>
        <Option value="reussi">Réussi</Option>
        <Option value="en attente">En attente</Option>
      </Select>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={getFilteredDemandes()}
        renderItem={demande => (
          <List.Item>
            <Card
              hoverable
              className="custom-card"
              style={{ 
                marginLeft: '200px', 
                border: '2px solid #ccc', // Bordure solide de 2px avec une couleur grise
                marginRight: '200px', 
                maxWidth: '800px', 
                width: '100%', 
                marginLeft: 'auto', 
                marginRight: 'auto' // Centre la carte
              }}
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleViewResponse(demande)}
                  style={{ backgroundColor: '#006bbd', borderColor: '#006bbd' }}
                >
                  Voir Détails
                </Button>,
                demande.reponse ? (
                  <Badge color="green" text="Réussi" />
                ) : (
                  <Badge color="yellow" text="En attente" />
                )
              ]}
            >
              <Text strong style={{ fontSize: '17px' }}>{demande.titre}</Text>
              <br />
              <Text style={{ fontSize: '16px' }}>{`Demande à ${demande.nom_administration} par ${demande.nom_citoyen} ${demande.prenom_citoyen} le ${new Date(demande.created_at).toLocaleDateString()}`}</Text>
              <div className="demande-actions" style={{ marginTop: '10px' }}>
                {!demande.reponse && (
                  <>
                    <Button
                      type="primary"
                      onClick={() => handleToggleResponseBox(demande.id)}
                      style={{ backgroundColor: '#006bbd', borderColor: '#006bbd', marginRight: '420px' }}
                    >
                      Répondre
                    </Button>
                    {showResponseBox[demande.id] && (
                      <div>
                        <TextArea
                          rows={4}
                          value={responseText}
                          onChange={e => setResponseText(e.target.value)}
                          placeholder="Écrivez votre réponse ici..."
                          className="response-textarea"
                          style={{ marginBottom: '10px' }}
                        />
                        <Button 
                          type="primary" 
                          onClick={() => handleSendResponse(demande.id)} 
                          style={{ backgroundColor: '#006bbd', borderColor: '#006bbd' }}
                        >
                          Envoyer
                        </Button>
                      </div>
                    )}
                  </>
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
          <Title level={2} style={{ textAlign: 'center', fontSize: '20px', color: '#1E0F1C', fontWeight: 'bold' }}>{selectedDemande.titre}</Title>
          <Divider className="demande-divider" />
          <div className="chat-container">
            <div className="question">
              <Text strong>Citoyen :</Text> {selectedDemande.description}
            </div>
            <Divider className="message-divider" />
            <div className="response">
              <Space>
                <img
                  src={`${process.env.PUBLIC_URL}/images/flech.png`}
                  alt="Fleche"
                  style={{ width: '16px', height: '16px', marginRight: '5px' }}
                />
                <Text>{selectedDemande.reponse}</Text>
              </Space>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DemandeAccesDirecteur;
