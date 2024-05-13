import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const ActiveUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/active-users');
        console.log(response.data); // Vérifiez la structure de la réponse dans la console
        if (Array.isArray(response.data.active_users)) {
          setUsers(response.data.active_users);
        } else {
          console.error('Les données renvoyées ne sont pas sous forme de tableau :', response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs actifs :', error);
      }
    };

    fetchActiveUsers();
  }, []);

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
  ];

  return (
    <div>
      <h2>Liste des Utilisateurs activés</h2>
      <Table dataSource={users} columns={columns} />
    </div>
  );
};

export default ActiveUsers;
