import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import moment from 'moment';

const ArchivedProgrammesVisite = () => {
    const [archivedProgrammesVisite, setArchivedProgrammesVisite] = useState([]);

    useEffect(() => {
        const fetchArchivedProgrammesVisite = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/archived_programmes_visite');
                setArchivedProgrammesVisite(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchArchivedProgrammesVisite();
    }, []);

    const columns = [
        {
            title: 'Période',
            dataIndex: 'periode_debut',
            key: 'periode_debut',
            render: text => moment(text).format("DD/MM/YYYY"),
        },
        {
            title: 'Lieu',
            dataIndex: 'lieu',
            key: 'lieu',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Admin Public',
            dataIndex: 'nomAdminPublique',
            key: 'nomAdminPublique',
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
        },
    ];

    return (
        <>
            <h2 className="titre-liste">Liste des Programmes de Visite Archivés</h2>
            <Table dataSource={archivedProgrammesVisite} columns={columns} />
        </>
    );
};

export default ArchivedProgrammesVisite;