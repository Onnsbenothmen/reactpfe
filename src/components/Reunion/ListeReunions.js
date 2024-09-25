import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Select, Upload, message, Modal } from 'antd';
import { UploadOutlined, EyeOutlined, CloseOutlined } from '@ant-design/icons';
import './ListeReunions.css';
import AbsenceIcon from '../../assets/absence.png';
import UploadIcon from '../../assets/submit.png';
import ArchivedReunions from './ArchivedReunions';
import AjoutReunion from './AjoutReunion'

const { Option } = Select;

const ListeReunions = () => {
  const [reunions, setReunions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedReunion, setSelectedReunion] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const [showAjoutReunion, setshowAjoutReunion] = useState(false);
  const [textSize, setTextSize] = useState('24px'); // Taille de texte du titre (modifiable)


  useEffect(() => {
    fetchReunions();
  }, []);

  const fetchReunions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/reunions');
      setReunions(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des réunions :', error);
    }
  };


  const getStatutOptions = (statut) => {
    if (statut === 'Prévue') {
      return ['en cours', 'annulée'];
    } else if (statut === 'en cours') {
      return ['réalisée'];
    } else {
      // Retourne une option par défaut si le statut n'est pas "Prévue" ou "en cours"
      return [statut];
    }
  };
  

  const handleUpload = (reunionId, file) => {
    const formData = new FormData();
    formData.append('pv_file', file);

    setUploading(true);
    axios.post(`http://localhost:5000/reunions/${reunionId}/upload_pv`, formData)
      .then(response => {
        message.success('PV uploaded successfully');
        fetchReunions();
      })
      .catch(error => {
        console.error('Erreur lors du téléchargement du PV :', error);
        message.error('Error uploading PV');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handlePresenceChange = async (reunionId, userId, presence) => {
    try {
      await axios.put(`http://localhost:5000/reunions/${reunionId}/participants/${userId}/presence`, { presence });
      const updatedParticipants = participants.map(participant => {
        if (participant.user.id === userId) {
          return { ...participant, presence };
        }
        return participant;
      });
      setParticipants(updatedParticipants);
      message.success('Présence mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présence :', error);
      message.error('Erreur lors de la mise à jour de la présence');
    }
  };


  const handleStatusChange = async (reunionId, statut) => {
    try {
      await axios.put(`http://localhost:5000/reunions/${reunionId}`, { statut });
      // Mettre à jour les réunions après la mise à jour du statut
      fetchReunions();
      message.success('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
      message.error('Erreur lors de la mise à jour du statut');
    }
  };

  
  



  

  const handleOpenModal = async (reunion) => {
    try {
      const response = await axios.get(`http://localhost:5000/reunions/${reunion.id}/participants`);
      setParticipants(response.data);
      setSelectedReunion(reunion);
      setModalVisible(true);
    } catch (error) {
      console.error('Erreur lors du chargement des participants :', error);
      message.error('Erreur lors du chargement des participants');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setParticipants([]);
    setSelectedReunion(null);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Heure',
      dataIndex: 'heure',
      key: 'heure',
    },
    {
      title: 'Type de réunion',
      dataIndex: 'type_reunion',
      key: 'type_reunion',
    },
    {
      title: 'Lieu',
      dataIndex: 'lieu',
      key: 'lieu',
    },
    
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (text) => (
        <span>{text}</span>
      ),
    },
    
    {
      title: 'Absence',
      key: 'participants',
      render: (text, record) => (
        <Button onClick={() => handleOpenModal(record)} style={{ background: 'transparent', border: 'none' }}>
          <img src={AbsenceIcon} alt="Absence" style={{ width: '30px', height: '30px' }} />
        </Button>
      ),
    },
    {
      title: 'PV',
      key: 'pv',
      render: (text, record) => (
        record.pv_path ? (
          <span>PV disponible</span>
        ) : (
          <span>Non disponible</span>
        )
      ),
    },
    
    {
      title: 'Voir',
      key: 'voir',
      render: (text, record) => (
        record.pv_path ? (
          <a href={`http://localhost:5000/${record.pv_path}`} target="_blank" rel="noopener noreferrer">
            <EyeOutlined style={{ fontSize: '20px', color: '#006bbd' }} />
          </a>
        ) : (
          <span>-</span>
        )
      ),
    }
  ];

  const participantColumns = [
    {
      title: 'Prénom',
      dataIndex: ['user', 'firstName'],
      key: 'firstName',
    },
    {
      title: 'Nom',
      dataIndex: ['user', 'lastName'],
      key: 'lastName',
    },
    {
      title: 'Présence',
      key: 'presence',
      render: (text, record) => (
        <span>{record.presence ? 'Présent' : 'Absent'}</span>
      ),
    },
  ];
  

  const rowClassName = (record) => {
    return !record.presence ? 'absent-row' : '';
  };

  return (
    <div>
<h2 className="titre-liste"  style={{ 
  textAlign: 'center', 
  color: '#2B6CC4', 
  fontFamily: 'Arial, sans-serif', 
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
  margin: '20px 0', 
  padding: '10px 0' 
}}> Réunions
</h2>
<Button
        type="primary"
        style={{ marginLeft: 900, background: '#006bbd', borderColor: '#006bbd' }}
        onClick={() => setShowArchivedModal(true)}
      >
        Voir les réunions archivées
      </Button>

      <Button
        type="primary"
        style={{ marginTop: 20, background: '#006bbd', borderColor: '#006bbd' }}
        onClick={() => setshowAjoutReunion(true)}
      >
        Ajouter réunion
      </Button>
      <br></br><br></br><br></br>

      <Table columns={columns} dataSource={reunions} rowKey="id" />

      <Modal
        title={<div style={{ fontSize: '24px', textAlign: 'center', color:'#006bbd' }}>Liste absence<br /></div>}
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        wrapClassName="custom-modal"
        style={{ borderRadius: '10px', width: '80%' }}
      >
        <Table
          columns={participantColumns}
          dataSource={participants}
          rowKey={(record) => record.user.id}
          pagination={false}
        />
      </Modal>

      
      <Modal
        visible={showArchivedModal}
        onCancel={() => setShowArchivedModal(false)}
        footer={null}
        wrapClassName="custom-modal"
        style={{ minWidth: '900px' }}
      >
        <ArchivedReunions />
      </Modal>

      <Modal
        title=""
        visible={showAjoutReunion}
        onCancel={() => setshowAjoutReunion(false)}
        footer={null}
        wrapClassName="custom-modal"
        style={{ minWidth: '900px' }}
      >
        <AjoutReunion />
      </Modal>
    </div>
  );
};

export default ListeReunions;