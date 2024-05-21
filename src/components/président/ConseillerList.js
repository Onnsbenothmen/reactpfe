import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Table, Avatar } from 'antd';
import axios from 'axios';

const ConseillerList = () => {
  const [conseillers, setConseillers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchConseillers();
  }, []);

  const fetchConseillers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/getlistconseille');
      setConseillers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des conseillers:', error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce conseiller ?');

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:5000/users/${id}`);
      setConseillers(conseillers.filter(conseiller => conseiller.id !== id));
      console.log('Conseiller supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du conseiller:', error);
    }
  };

  const handleUpdate = (conseiller) => {
    history.push(`/UpdateConseiller/${conseiller.id}`, { conseiller });
  };

  const columns = [
    {
      title: 'Image de profil',
      dataIndex: 'profile_image',
      key: 'profile_image',
      render: (text, conseiller) => (
        <Avatar src={`http://127.0.0.1:5000/static/uploads/${text}`} size={64} />
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Prénom',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Nom',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, conseiller) => (
        <span>
          <Button type="primary" onClick={() => handleUpdate(conseiller)}>
            Modifier
          </Button>
          <Button type="danger" onClick={() => handleDelete(conseiller.id)}>
            Supprimer
          </Button>
        </span>
      ),
    },
  ];

  const paginationConfig = {
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30'],
  };

  return (
    <div>
      <h2>Liste des Conseillers</h2>
      <Table dataSource={conseillers} columns={columns} rowKey="id" pagination={paginationConfig} />
    </div>
  );
};

export default ConseillerList;
