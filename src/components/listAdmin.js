import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Table, Avatar } from 'antd';
import axios from 'axios';

const AdminPubliqueList = () => {
  const [admins, setAdmins] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/admins');
      setAdmins(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des administrateurs:', error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?');

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:5000/adminpublique/${id}`);
      setAdmins(admins.filter(admin => admin.id !== id));
      console.log('Administrateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'administrateur:', error);
    }
  };

  const handleUpdate = (admin) => {
    history.push(`/UpdateAdmin/${admin.id}`, { admin });
  };

  const columns = [
    {
      title: 'Image de profil',
      dataIndex: 'profile_image',
      key: 'profile_image',
      render: (text, admin) => (
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
      title: 'Directeur',
      dataIndex: 'directeur',
      key: 'directeur',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, admin) => (
        <span>
          <Button type="primary" onClick={() => handleUpdate(admin)}>
            Modifier
          </Button>
          <Button type="danger" onClick={() => handleDelete(admin.id)}>
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
      <h2>Liste des Administrateurs</h2>
      <Table dataSource={admins} columns={columns} rowKey="id" pagination={paginationConfig} />
    </div>
  );
};

export default AdminPubliqueList;
