import React, { useState, useEffect } from 'react';
import { Col, Row, Button, Modal, Select, Table, Input, Form } from 'antd'; // Utilisation de Input et Form
import {  EyeOutlined } from '@ant-design/icons';

import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';

const { Option } = Select;

const ProgrammeVisiteConseiller = () => {
    const [programmesVisite, setProgrammesVisite] = useState([]);
    const [selectedConseiller, setSelectedConseiller] = useState(null);
    const [conseillers, setConseillers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProgramme, setSelectedProgramme] = useState(null);
    const [selectedProgrammeId, setSelectedProgrammeId] = useState(null);
    const [evaluationModalVisible, setEvaluationModalVisible] = useState(false);
    const [evaluationData, setEvaluationData] = useState({
        observations: '',
        evaluations: '',
        recommendations: '',
    });
    const [createModalVisible, setCreateModalVisible] = useState(false);

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

    const statusFilters = [
        { text: 'En cours', value: 'En cours' }    ];
    
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

                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(pdfBlob);

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

    const handleChangeStatus = async (record, newStatus) => {
        try {
            const response = await axios.put(`http://127.0.0.1:5000/programmes_visite/${record.id}/statut`, { statut: newStatus });

            if (response.data.success) {
                const updatedProgrammesVisite = programmesVisite.map(item => {
                    if (item.id === record.id) {
                        return { ...item, statut: newStatus };
                    }
                    return item;
                });
                setProgrammesVisite(updatedProgrammesVisite);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleViewReport = async (record) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/programmes_visite/${record.id}/rapport`);

            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);

            window.open(pdfUrl, '_blank');
        } catch (error) {
            console.error("Error fetching report:", error);
        }
    };

    const handleAddButtonClick = () => {
        setCreateModalVisible(true);
    };

    const handleCreateModalClose = () => {
        setCreateModalVisible(false);
    };

    const columns = [
        {
            title: 'Période',
            dataIndex: 'periode_debut',
            key: 'periode_debut',
            render: text => moment(text).format("DD/MM/YYYY"),
            style: { color: '#006bbd' }, // Changer la couleur du texte
        },
        {
            title: 'Lieu',
            dataIndex: 'lieu',
            key: 'lieu',
            style: { color: '#006bbd' }, // Changer la couleur du texte
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            style: { color: '#006bbd' }, // Changer la couleur du texte
        },
        {
            title: 'Nom Admin Publique',
            dataIndex: 'nomAdminPublique',
            key: 'nomAdminPublique',
            style: { color: '#006bbd' }, // Changer la couleur du texte
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut) => <span>{statut}</span>,
            style: { color: '#006bbd' }, // Changer la couleur du texte
        },
        {
            title: 'Evaluation',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button type="primary" style={{ color: '#006bbd', background: 'none', border: 'none' }} icon={<EyeOutlined />} onClick={() => handleViewReport(record)} />
                </span>
            ),
            style: { color: '#006bbd' }, // Changer la couleur du texte
        },
    ];
    


    return (
        <>
            <h2 className="titre-liste"  style={{ 
  textAlign: 'center', 
  color: '#2B6CC4', 
  fontFamily: 'Arial, sans-serif', 
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
  margin: '20px 0', 
  padding: '10px 0' 
}}>Programmes de Visite</h2>

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
                </Col>
            </Row>

            <Modal
                title="Détails du Programme de Visite"
                visible={modalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Fermer
                    </Button>
                ]}
            >
                {selectedProgramme && (
                    <div>
                        <p><strong>Période:</strong> {moment(selectedProgramme.periode_debut).format("DD/MM/YYYY")} - {moment(selectedProgramme.periode_fin).format("DD/MM/YYYY")}</p>
                        <p><strong>Lieu:</strong> {selectedProgramme.lieu}</p>
                        <p><strong>Description:</strong> {selectedProgramme.description}</p>
                        <p><strong>Nom Admin Publique:</strong> {selectedProgramme.nomAdminPublique}</p>
                        <p><strong>Statut:</strong> {selectedProgramme.statut}</p>
                    </div>
                )}
            </Modal>

            <Modal
    visible={evaluationModalVisible}
    onCancel={() => setEvaluationModalVisible(false)}
    footer={null}
>
    <div style={{ textAlign: 'center' }}>
    <h2 className="titre-liste"  style={{ 
  textAlign: 'center', 
  color: '#2B6CC4', 
  fontFamily: 'Arial, sans-serif', 
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
  margin: '20px 0', 
  padding: '10px 0' 
}}>Créer une Évaluation
</h2>

    </div>
    <form onSubmit={handleEvaluationSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '16px', fontWeight: 'bold' }}>Observations:</label>
            <textarea
                name="observations"
                value={evaluationData.observations}
                onChange={handleEvaluationChange}
                style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}
                required
            />
        </div>
        <div style={{ marginBottom: '20px' }}>
        <label>
                        Évaluation:
                        <Select
              placeholder="Sélectionnez une évaluation"
              value={evaluationData.evaluations}
              onChange={handleEvaluationChange}
            >
              <Option value="Satisfaisant">Satisfaisant</Option>
              <Option value="À améliorer">À améliorer</Option>
              <Option value="Non conforme">Non conforme</Option>
            </Select>
                    </label>
            
        </div>
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '16px', fontWeight: 'bold' }}>Recommandations:</label>
            <textarea
                name="recommendations"
                value={evaluationData.recommendations}
                onChange={handleEvaluationChange}
                style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}
                required
            />
        </div>
        <div style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#006bbd', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}>Soumettre</Button>
        </div>
    </form>
</Modal>



        </>
    );
};

export default ProgrammeVisiteConseiller;