import React, { useState, useEffect } from 'react';
import { Table, Button, Avatar } from 'antd';
import axios from 'axios';

const ArchivedUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchArchivedUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/archived-user');
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs archivés :', error);
      }
    };

    fetchArchivedUsers();
  }, []);

  const handleActivate = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:5000/users/${id}/activate`);
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Erreur lors de la réactivation de l\'utilisateur :', error);
    }
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'profile_image',
      key: 'avatar',
      render: (text) => (
        text ? <Avatar src={`http://127.0.0.1:5000/static/uploads/${text}`} /> : <Avatar />
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
      title: 'Téléphone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Adresse',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, user) => (
        <Button       
        style={{ backgroundColor: '#006bbd', borderColor: '#006bbd', marginRight: '10px' }} // Ajoutez de l'espace entre les boutons
        

        type="primary" onClick={() => handleActivate(user.id)}>Réactiver</Button>
      ),
    },
  ];

  return (
    <div className="container mt-4" style={{ textAlign: 'left' }}>
<h2 className="titre-liste"  style={{ 
  textAlign: 'center', 
  color: '#2B6CC4', 
  fontFamily: 'Arial, sans-serif', 
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
  margin: '20px 0', 
  padding: '10px 0' 
}}>Liste des Utilisateurs archivés</h2>      <br></br>
      <div>
        <Table dataSource={users} columns={columns} />
      </div>
    </div>
  );
};

export default ArchivedUsers;
