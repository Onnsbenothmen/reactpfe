import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';



const ArchivedReunions = () => {
  const [archivedReunions, setArchivedReunions] = useState([]);

  useEffect(() => {
    fetchArchivedReunions();
  }, []);

  const fetchArchivedReunions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/reunions');
      const allReunions = response.data;
      const archivedReunions = allReunions.filter(reunion => reunion.statut === 'réalisée');
      setArchivedReunions(archivedReunions);
    } catch (error) {
      console.error('Erreur lors du chargement des réunions archivées :', error);
      message.error('Erreur lors du chargement des réunions archivées');
    }
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
      title: 'PV',
      key: 'pv',
      render: (text, record) => (
        record.pv_path ? (
          <a href={`http://localhost:5000/${record.pv_path}`} target="_blank" rel="noopener noreferrer">
            <EyeOutlined />
          </a>
        ) : (
          <span>PV non disponible</span>
        )
      ),
    },
  ];

  return (
    <div>
      <h2>Liste des Réunions Archivées</h2>
      <Table columns={columns} dataSource={archivedReunions} rowKey="id" />
    </div>
  );
};

export default ArchivedReunions;