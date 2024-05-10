import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Modal, Typography, Space, Select, Table } from 'antd'; // Importez Table depuis 'antd'
import { HeartTwoTone, InfoCircleTwoTone } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';
import './ListeVisiteEvaluation.css'; 
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const { Option } = Select;

const ListeVisiteEvaluation = () => {
    const [programmesVisite, setProgrammesVisite] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProgramme, setSelectedProgramme] = useState(null);
    const [selectedConseiller, setSelectedConseiller] = useState(null);
    const [conseillers, setConseillers] = useState([]);
    const [evaluationModalVisible, setEvaluationModalVisible] = useState(false);
    const [selectedProgrammeId, setSelectedProgrammeId] = useState(null);
    const [rapportPDFData, setRapportPDFData] = useState(null);
    
    const [evaluationData, setEvaluationData] = useState({
        observations: '',
        evaluations: '',  
        recommendations: '',
    });
    
    useEffect(() => {
        const fetchConseillers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/conseillers');
                setConseillers(response.data);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchConseillers();
    }, []);
    

    useEffect(() => {
        const fetchProgrammesVisite = async () => {
            try {
                let url = 'http://127.0.0.1:5000/ListeVisiteEvaluation'; 
                if (selectedConseiller) {
                    const { firstName, lastName } = selectedConseiller;
                    url = `http://127.0.0.1:5000/conseillers/${firstName}/${lastName}/programmes_visite`;
                }
    
                const response = await axios.get(url);
                setProgrammesVisite(response.data);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchProgrammesVisite();
    }, [selectedConseiller]);
    

    const showModal = async (record) => {
        setSelectedProgramme(record);
        setSelectedProgrammeId(record.id); 
        try {
          const response = await axios.get(`http://127.0.0.1:5000/programmes_visite/${record.id}`);
          console.log(response.data);
          setModalVisible(true);
        } catch (error) {
          console.error(error);
        }
    };
    

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleCreateEvaluation = (programme) => {
        if (!programme) {
            console.error("Aucun programme n'a été sélectionné.");
            return;
        }
        setSelectedProgramme(programme);
        setSelectedProgrammeId(programme.id); 
        setEvaluationModalVisible(true);
    };
    
    

    const handleEvaluationChange = (event) => {
        const { name, value } = event.target;
        setEvaluationData({ ...evaluationData, [name]: value });
    };

    const handleEvaluationSubmit = async (event) => {
        event.preventDefault();
        try {
            let programmeIdToSend = selectedProgrammeId; 
            if (!programmeIdToSend && programmesVisite.length > 0) {
                programmeIdToSend = programmesVisite[0].id; 
            }
            if (programmeIdToSend) {
                const evaluationDataWithProgrammeId = {
                    ...evaluationData,
                    programme_id: programmeIdToSend,
                };
                const response = await axios.post(`http://127.0.0.1:5000/evaluation/${programmeIdToSend}`, evaluationDataWithProgrammeId);
    
                // Convertir la réponse en blob
                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                // Créer une URL pour le blob
                const pdfUrl = URL.createObjectURL(pdfBlob);
    
                // Ouvrir le PDF dans un nouvel onglet
                window.open(pdfUrl, '_blank');
    
                setEvaluationModalVisible(false);
            } else {
                console.error("Aucun programme de visite n'est disponible pour créer une évaluation.");
            }
        } catch (error) {
            console.error("Error submitting evaluation:", error);
        }
    };
    

    const handleConseillerChange = async (conseillerId) => {
        try {
            const conseiller = conseillers.find(c => c.id === conseillerId);
            setSelectedConseiller(conseiller); 

            if (conseiller) {
                const { firstName, lastName } = conseiller;
                const response = await axios.get(`http://127.0.0.1:5000/conseillers/${firstName}/${lastName}/programmes_visite`);

                setProgrammesVisite(response.data);
            } else {
                const response = await axios.get(`http://127.0.0.1:5000/programmes_visite`);
                setProgrammesVisite(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Fonction pour gérer le clic sur le bouton "Voir rapport"
const handleViewReport = async (record) => {
    try {
        // Envoyer une requête au backend pour récupérer le rapport PDF du programme de visite sélectionné
        const response = await axios.get(`http://127.0.0.1:5000/programmes_visite/${record.id}/rapport`);
        
        // Convertir la réponse en blob
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        // Créer une URL pour le blob
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Ouvrir le PDF dans un nouvel onglet
        window.open(pdfUrl, '_blank');
    } catch (error) {
        console.error("Error fetching report:", error);
    }
};


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
          title: 'Actions',
          key: 'actions',
          render: (text, record) => (
            <span>
              <Button type="primary" icon={<InfoCircleTwoTone />} onClick={() => showModal(record)}>Détails</Button>
              <Button type="primary" icon={<HeartTwoTone />} onClick={() => handleCreateEvaluation(record)}>Créer évaluation</Button>
              {/* Bouton "Voir rapport" */}
              <Button type="primary" onClick={() => handleViewReport(record)}>Voir rapport</Button>
            </span>
          ),
        },
    ];
    


    

    return (
        <>
            <h2 className="titre-liste">Liste des Programmes de Visite</h2>
            <Select
                placeholder="Sélectionnez un conseiller"
                style={{ width: 200, marginBottom: 20 }}
                onChange={handleConseillerChange}
                value={selectedConseiller ? selectedConseiller.id : undefined}
            >
                {conseillers.map(conseiller => (
                    <Option key={conseiller.id} value={conseiller.id}>
                        {conseiller.firstName} {conseiller.lastName}
                    </Option>
                ))}
            </Select>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Table dataSource={programmesVisite} columns={columns} /> 
                    {/* Utilisez le composant Table */}
                </Col>
            </Row>

            <Modal
                title="Détails du Programme de Visite"
                visible={modalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Fermer
                    </Button>,
                ]}
            >
                <p><strong>Période:</strong> {selectedProgramme ? `${moment(selectedProgramme.periode_debut).format("DD/MM/YYYY")} - ${moment(selectedProgramme.periode_fin).format("DD/MM/YYYY")}` : ''}</p>
                <p><strong>Lieu:</strong> {selectedProgramme ? selectedProgramme.lieu : ''}</p>
                <p><strong>Description:</strong> {selectedProgramme ? selectedProgramme.description : ''}</p>
            </Modal>

            <Modal
                title="Créer une évaluation"
                visible={evaluationModalVisible}
                onCancel={() => setEvaluationModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setEvaluationModalVisible(false)}>
                        Fermer
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleEvaluationSubmit}>
                        Soumettre
                    </Button>,
                ]}
            >
                <form>
                    <label>
                        Observations:
                        <input type="text" name="observations" value={evaluationData.observations} onChange={handleEvaluationChange} />
                    </label>
                    <label>
                        Évaluation:
                        <select name="evaluations" value={evaluationData.evaluations} onChange={handleEvaluationChange}>
                            <option value="">Sélectionnez une évaluation</option>
                            <option value="Satisfaisant">Satisfaisant</option>
                            <option value="À améliorer">À améliorer</option>
                            <option value="Non conforme">Non conforme</option>
                        </select>
                    </label>
                    <label>
                        Recommandations:
                        <input type="text" name="recommendations" value={evaluationData.recommendations} onChange={handleEvaluationChange} />
                    </label>
                </form>
            </Modal>
        </>
    );
};

export default ListeVisiteEvaluation;
