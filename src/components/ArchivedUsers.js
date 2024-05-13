import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';

const ArchivedUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchArchivedUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/archived-user');
        console.log(response.data); // Vérifiez la structure de la réponse dans la console
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs archivés :', error);
      }
    };

    fetchArchivedUsers();
  }, []);

  const handleActivate = async (id) => {
    try {
      // Envoyer une requête au serveur pour réactiver l'utilisateur avec l'ID donné
      await axios.post(`http://127.0.0.1:5000/users/${id}/activate`);
      // Rafraîchir la liste des utilisateurs archivés après réactivation
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Erreur lors de la réactivation de l\'utilisateur :', error);
    }
  };

  const columns = [
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
        <Button type="primary" onClick={() => handleActivate(user.id)}>Réactiver</Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Liste des Utilisateurs archivés</h2>
      <Table dataSource={users} columns={columns} />
    </div>
  );
};

export default ArchivedUsers;
