import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag, message, Select } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import './ArchivedReunions.css'; // Assurez-vous d'avoir ce fichier CSS

const { Option } = Select;

const ArchivedReunions = () => {
  const [archivedReunions, setArchivedReunions] = useState([]);
  const [filteredReunions, setFilteredReunions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchArchivedReunions();
  }, []);

  useEffect(() => {
    filterReunions();
  }, [selectedStatus, archivedReunions]);

  const fetchArchivedReunions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/reunions/archiveconseiller');
      setArchivedReunions(response.data);
      setFilteredReunions(response.data); // Initialiser avec toutes les réunions
    } catch (error) {
      console.error('Erreur lors du chargement des réunions archivées :', error);
      message.error('Erreur lors du chargement des réunions archivées');
    }
  };

  const filterReunions = () => {
    if (selectedStatus === 'all') {
      setFilteredReunions(archivedReunions);
    } else {
      const filtered = archivedReunions.filter(reunion => reunion.statut === selectedStatus);
      setFilteredReunions(filtered);
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
          className={`status-tag ${statut === 'réalisée' ? 'status-realisee' : statut === 'Prévue' ? 'status-prevue' : 'status-en-cours'}`}
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
      <br />
      <Select
        value={selectedStatus}
        onChange={(value) => setSelectedStatus(value)}
        style={{ width: 200, marginBottom: 16 }}
      >
        <Option value="all">Tous les statuts</Option>
        <Option value="Prévue">Prévue</Option>
        <Option value="en cours">En cours</Option>
        <Option value="réalisée">Réalisée</Option>
      </Select>
      <Table columns={columns} dataSource={filteredReunions} rowKey="id" />
    </div>
  );
};

export default ArchivedReunions;
