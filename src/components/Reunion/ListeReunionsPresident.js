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

const ListeReunionsPresident = () => {
  const [reunions, setReunions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedReunion, setSelectedReunion] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const [showAjoutReunion, setshowAjoutReunion] = useState(false);


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
      title: 'Ordre du jour',
      dataIndex: 'ordre_du_jour',
      key: 'ordre_du_jour',
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (text, record) => (
        <Select defaultValue={text} onChange={value => handleStatusChange(record.id, value)}>
          {getStatutOptions(text).map(option => (
            <Option key={option} value={option}>{option}</Option>
          ))}
        </Select>
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
          <Upload
            beforeUpload={(file) => {
              handleUpload(record.id, file);
              return false;
            }}
            showUploadList={false}
          >
            <Button loading={uploading} style={{ background: 'transparent', border: 'none' }}>
              <img src={UploadIcon} alt="Upload" style={{ width: '30px', height: '30px' }} />
            </Button>
          </Upload>
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
      title: 'Absent',
      key: 'presence',
      render: (text, record) => (
        <Button
          icon={
            record.presence
              ? <span style={{ width: '16px', height: '16px', display: 'inline-block', border: '1px solid #ccc', borderRadius: '50%' }} />
              : <CloseOutlined style={{ color: 'red', fontSize: '16px' }} />
          }
          style={{ background: 'transparent', border: 'none', padding: 0 }}
          onClick={() => handlePresenceChange(selectedReunion.id, record.user.id, !record.presence)}
        />
      ),
    },
  ];

  const rowClassName = (record) => {
    return !record.presence ? 'absent-row' : '';
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#006bbd' }}>Liste des Réunions Actuelles</h2>
<br /><br />
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
        title={`Participants à la réunion du ${selectedReunion && selectedReunion.date}`}
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        wrapClassName="custom-modal"
        style={{ borderRadius: '10px', width: '80%' }}
      >
        <Table
          columns={participantColumns}
          dataSource={participants}
          rowKey={record => record.user.id}
          rowClassName={rowClassName}
          pagination={false}
        />
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



      <Modal
        title="  "
        visible={showArchivedModal}
        onCancel={() => setShowArchivedModal(false)}
        footer={null}
        wrapClassName="custom-modal"
        style={{ minWidth: '900px' }}
      >
        <ArchivedReunions />
      </Modal>
    </div>
  );
};

export default ListeReunionsPresident;
