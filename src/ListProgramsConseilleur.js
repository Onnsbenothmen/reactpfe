import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { List, Card } from 'antd';

const ListProgramsConseilleur = () => {
    const [programmes, setProgrammes] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/list-programs-for-conseiller/${id}`);
                setProgrammes(response.data.programs);
            } catch (error) {
                console.error('Erreur lors de la récupération des programmes:', error);
            }
        };

        fetchPrograms();
    }, [id]);

    return (
        <div>
            <h1>Liste des Programmes pour le Conseiller {id}</h1>
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={programmes}
                renderItem={programme => (
                    <List.Item>
                        <Card title={`Programme ${programme.programme_id}`}>
                            <p>Période de début: {new Date(programme.periode_debut).toLocaleDateString()}</p>
                            <p>Période de fin: {new Date(programme.periode_fin).toLocaleDateString()}</p>
                            <p>Critères d'évaluation: {programme.criteres_evaluation}</p>
                            <p>Lieu: {programme.lieu}</p>
                            <p>Description: {programme.description}</p>
                            <p>Contacts d'urgence: {programme.contacts_urgence}</p>
                            <p>Documents joints: {programme.documents_joints}</p>
                            <p>Date de création: {new Date(programme.created_at).toLocaleDateString()}</p>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ListProgramsConseilleur;