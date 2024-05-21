import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Select, Upload, message, Checkbox, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './ListeReunions.css'; // Assurez-vous d'importer le fichier CSS
import { DeleteOutlined } from '@ant-design/icons';
import { EyeOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons'; // ou une autre icône de silhouette
import { DownloadOutlined } from '@ant-design/icons';



const { Option } = Select;

const ListeReunions = () => {
  const [reunions, setReunions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedReunion, setSelectedReunion] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchReunions();
  }, []);

  const fetchReunions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/reunions');
      const allReunions = response.data;
      const currentReunions = allReunions.filter(reunion => reunion.statut !== 'réalisée');
      setReunions(currentReunions);
    } catch (error) {
      console.error('Erreur lors du chargement des réunions :', error);
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

  const handleDeletePV = async (reunionId) => {
    try {
      await axios.delete(`http://localhost:5000/reunions/${reunionId}/delete_pv`);
      message.success('PV deleted successfully');
      fetchReunions();
    } catch (error) {
      console.error('Erreur lors de la suppression du PV :', error);
      message.error('Error deleting PV');
    }
  };
  

  const handleStatusChange = async (reunionId, statut) => {
    try {
      await axios.put(`http://localhost:5000/reunions/${reunionId}`, { statut });
      fetchReunions();
      message.success('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
      message.error('Erreur lors de la mise à jour du statut');
    }
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
          <Option value="prévue">Prévue</Option>
          <Option value="annulée">Annulée</Option>
          <Option value="réalisée">Réalisée</Option>
          <Option value="en cours">En cours</Option>
        </Select>
      ),
    },
    {
      title: 'Absence',
      key: 'participants',
      render: (text, record) => (
        <Button onClick={() => handleOpenModal(record)}>
  <UserOutlined style={{ color: 'red' }} /> {/* Vous pouvez ajuster la couleur et le style selon vos préférences */}
</Button>
      ),
    },
    {
      title: 'PV',
      key: 'pv',
      render: (text, record) => (
        record.pv_path ? (
          <div>
            <a href={`http://localhost:5000/${record.pv_path}`} target="_blank" rel="noopener noreferrer">
  <EyeOutlined />
</a>

            <Button
              type="danger"
              onClick={() => handleDeletePV(record.id)}
              style={{ marginLeft: 10 }}
              icon={<DeleteOutlined />}
            />
          </div>
        ) : (
          <Upload
  beforeUpload={(file) => {
    handleUpload(record.id, file);
    return false;
  }}
  showUploadList={false}
>
  <Button icon={<DownloadOutlined />} loading={uploading}></Button>
</Upload>
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
        <Checkbox
          checked={!record.presence}
          onChange={e => handlePresenceChange(selectedReunion.id, record.user.id, !e.target.checked)}
        >
          Absent
        </Checkbox>
      ),
    },
  ];

  const rowClassName = (record) => {
    return !record.presence ? 'absent-row' : '';
  };

  return (
    <div>
      <h2>Liste des Réunions Actuelles</h2>
      <Table columns={columns} dataSource={reunions} rowKey="id" />
      <Link to="/ArchivedReunions">
        <Button type="primary" style={{ marginTop: 20 }}>Voir les réunions archivées</Button>
      </Link>
      <Modal
        title={`Participants à la réunion du ${selectedReunion && selectedReunion.date}`}
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Table
          columns={participantColumns}
          dataSource={participants}
          rowKey={record => record.user.id}
          rowClassName={rowClassName}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default ListeReunions;