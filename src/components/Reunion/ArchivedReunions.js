import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import './ArchivedReunions.css'; // Assurez-vous d'avoir ce fichier CSS

const ArchivedReunions = () => {
  const [archivedReunions, setArchivedReunions] = useState([]);

  useEffect(() => {
    fetchArchivedReunions();
  }, []);

  const fetchArchivedReunions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/reunions/archive');
      setArchivedReunions(response.data);
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
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut) => (
        <Tag
          className={`status-tag ${statut === 'réalisée' ? 'status-realisee' : 'status-annulee'}`}
        >
          {statut}
        </Tag>
      ),
    },
    {
      title: 'PV',
      key: 'pv',
      render: (text, record) => (
        record.pv_path ? (
          <span>disponible</span>
        ) : (
          <span>non disponible</span>
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
    },
  ];

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#006bbd' }}>Liste des Réunions</h2>
      <br /> {/* Ajoutez un retour à la ligne ici */}
      <Table columns={columns} dataSource={archivedReunions} rowKey="id" />
    </div>
  );
};

export default ArchivedReunions;
