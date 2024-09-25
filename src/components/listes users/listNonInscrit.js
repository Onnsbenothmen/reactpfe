import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, notification, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const InactivePresidents = () => {
  const [inactivePresidents, setInactivePresidents] = useState([]);

  useEffect(() => {
    fetchInactivePresidents();
  }, []);

  const fetchInactivePresidents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/inactive_presidents');
      setInactivePresidents(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des présidents inactifs:', error);
      notification.error({
        message: 'Erreur',
        description: 'Erreur lors de la récupération des présidents inactifs.',
      });
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Email du Président',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Tooltip title={`Président: ${email}`}>
          <div>
            <ExclamationCircleOutlined style={{ marginRight: '8px', color: '#FF4D4F' }} />
            {email}
          </div>
        </Tooltip>
      ),
    }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      width: '100%', 
      padding: '20px 0',
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#2B6CC4', 
        fontFamily: 'Arial, sans-serif', 
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
        margin: '20px 0', 
        padding: '10px 0',
      }}>
        Liste des Présidents non inscrits
      </h2>
      <Table
        dataSource={inactivePresidents.map((email, index) => ({ key: index, email }))}
        columns={columns}
        pagination={false}
        bordered
        size="small"
        style={{ width: '80%', maxWidth: '1000px' }} // Ajustez la largeur ici
      />
    </div>
  );
};

export default InactivePresidents;
