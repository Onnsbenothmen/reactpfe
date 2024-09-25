import React, { useState, useEffect } from 'react';
import { Table, message, Modal, Button, Avatar, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddCounselorsForm from './add_conseillers';

const ConseillerList = ({ user }) => {
  const [instanceName, setInstanceName] = useState('');
  const [counselors, setCounselors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchInstanceName();
    fetchCounselors();
  }, [user]);

  const fetchInstanceName = () => {
    axios.get(`http://localhost:5000/user/${user.id}/inst`)
      .then(response => {
        const nomInstance = response.data.nom_instance;
        if (nomInstance) {
          setInstanceName(nomInstance);
        } else {
          message.error("Le nom de l'instance n'a pas pu être récupéré.");
        }
      })
      .catch(error => {
        message.error("Erreur lors de la récupération du nom de l'instance.");
      });
  };

  const fetchCounselors = () => {
    axios.get('http://localhost:5000/getlistConseillers', { withCredentials: true })
      .then(response => {
        const dataWithKeys = response.data.map((item, index) => ({ ...item, key: index }));
        setCounselors(dataWithKeys);
        console.log("Liste des conseillers récupérée avec clés :", dataWithKeys);
      })
      .catch(error => {
        message.error("Erreur lors de la récupération des conseillers.");
      });
  };

  const showEditModal = (counselor) => {
    setIsModalVisible(true);
    // Pré-remplir le formulaire avec les données du conseiller si nécessaire
  };

  const columns = [
    {
      title: 'Image de profil',
      dataIndex: 'profile_image',
      key: 'profile_image',
      render: (text) => (
        <Avatar src={`http://127.0.0.1:5000/static/uploads/${text}`} size={64} />
      ),
    },
    {
      title: 'Nom',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Prénom',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'ID de l\'instance',
      dataIndex: 'instance_id',
      key: 'instance_id',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => showEditModal(record)}>Modifier</Button>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={1} style={{ 
        textAlign: 'center', 
        color: '#4A90E2', 
        fontFamily: 'Arial, sans-serif', 
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
        margin: '20px 0', 
        padding: '10px 0' 
      }}>Liste des Conseillers</Typography.Title>
  
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} style={{ background: 'green' }}>Ajouter</Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={counselors.filter(counselor => counselor.instance_id === instanceName)} 
        style={{ backgroundColor: '#FFFFFF', borderRadius: '5px' }} 
      />
  
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1000}
        bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
        className="pointed-modal"
      >
        <AddCounselorsForm user={user} />
      </Modal>
    </div>
  );
};

export default ConseillerList;
