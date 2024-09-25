import React, { useState, useEffect } from 'react';
import { Col, Row, Button, Modal, Select, Table, Input, Form } from 'antd';
import { FormOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';
import CreateProgrammeVisite from './CreateProgrammeVisite';

const { Option } = Select;

const ListeVisiteEvaluation = () => {
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
        { text: 'En cours', value: 'En cours' }
    ];

    const handleCreateEvaluation = (programme) => {
        if (!programme) {
            console.error("Aucun programme n'a été sélectionné.");
            return;
        }
        setSelectedProgramme(programme);
        setSelectedProgrammeId(programme.id);
        setEvaluationModalVisible(true);
    };

    const handleEvaluationChange = (name, value) => {
        setEvaluationData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleEvaluationSubmit = async (values) => {
        try {
            let programmeIdToSend = selectedProgrammeId;
            if (!programmeIdToSend && programmesVisite.length > 0) {
                programmeIdToSend = programmesVisite[0].id;
            }
            if (programmeIdToSend) {
                const evaluationDataWithProgrammeId = {
                    ...values,
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
            render: (statut, record) => (
                <Select
                    defaultValue={statut}
                    onChange={(newStatus) => handleChangeStatus(record, newStatus)}
                >
                    <Option value="En cours">En cours</Option>
                    <Option value="Clôturé">Clôturé</Option>
                </Select>
            ),
        },
        {
            title: 'Evaluation',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button type="primary" style={{ color: '#006bbd', background: 'none', border: 'none' }} icon={<FormOutlined />} onClick={() => handleCreateEvaluation(record)} />
                </span>
            ),
            style: { color: '#006bbd' }, // Changer la couleur du texte
        },
    ];

    return (
        <>
            <h2 className="titre-liste" style={{
                textAlign: 'center',
                color: '#2B6CC4',
                fontFamily: 'Arial, sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                margin: '20px 0',
                padding: '10px 0'
            }}>Liste des Programmes de Visite et Évaluation</h2>

            <Row justify="center" style={{ marginBottom: '20px' }}>
                <Col>
                    <label style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '10px' }}>Sélectionnez un Conseiller:</label>
                    <Select
                        placeholder="Sélectionner un Conseiller"
                        style={{ width: '200px' }}
                        onChange={handleConseillerChange}
                    >
                        {conseillers.map((conseiller) => (
                            <Option key={conseiller.id} value={conseiller.id}>
                                {`${conseiller.firstName} ${conseiller.lastName}`}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            <Table
                dataSource={programmesVisite}
                columns={columns}
                rowKey="id"
                onRow={(record) => ({
                    onDoubleClick: () => showModal(record),
                })}
                pagination={{ pageSize: 5 }}
            />

            <Modal
                visible={modalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                {selectedProgramme && (
                    <>
                        <h3 style={{ textAlign: 'center', fontSize: '18px', color: '#006bbd', fontWeight: 'bold', margin: '10px 0' }}>{selectedProgramme.nomAdminPublique}</h3>
                        <p style={{ textAlign: 'center', fontSize: '16px', color: '#333', fontStyle: 'italic' }}>{selectedProgramme.description}</p>
                        <p style={{ textAlign: 'center', fontSize: '14px', color: '#333' }}>Période: {moment(selectedProgramme.periode_debut).format("DD/MM/YYYY")} - {moment(selectedProgramme.periode_fin).format("DD/MM/YYYY")}</p>
                        <p style={{ textAlign: 'center', fontSize: '14px', color: '#333' }}>Lieu: {selectedProgramme.lieu}</p>
                        <Button
                            type="primary"
                            onClick={() => handleViewReport(selectedProgramme)}
                            style={{ display: 'block', margin: '20px auto', backgroundColor: '#006bbd', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
                        >
                            Voir Rapport
                        </Button>
                    </>
                )}
            </Modal>

            <Modal
                visible={evaluationModalVisible}
                onCancel={() => setEvaluationModalVisible(false)}
                footer={null}
            >
                <div style={{ textAlign: 'center' }}>
                    <h2 className="titre-liste" style={{
                        textAlign: 'center',
                        color: '#2B6CC4',
                        fontFamily: 'Arial, sans-serif',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        margin: '20px 0',
                        padding: '10px 0'
                    }}>Créer une Évaluation
                    </h2>
                </div>
                <Form onFinish={handleEvaluationSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
                    <Form.Item label="Observations" name="observations" rules={[{ required: true, message: 'Veuillez saisir vos observations' }]}>
                        <Input.TextArea
                            name="observations"
                            value={evaluationData.observations}
                            onChange={(e) => handleEvaluationChange(e.target.name, e.target.value)}
                            style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}
                            required
                        />
                    </Form.Item>
                    <Form.Item label="Évaluation" name="evaluations" rules={[{ required: true, message: 'Veuillez sélectionner une évaluation' }]}>
                        <Select
                            placeholder="Sélectionnez une évaluation"
                            value={evaluationData.evaluations}
                            onChange={(value) => handleEvaluationChange('evaluations', value)}
                        >
                            <Option value="Satisfaisant">Satisfaisant</Option>
                            <Option value="À améliorer">À améliorer</Option>
                            <Option value="Non conforme">Non conforme</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Recommandations" name="recommendations" rules={[{ required: true, message: 'Veuillez saisir vos recommandations' }]}>
                        <Input.TextArea
                            name="recommendations"
                            value={evaluationData.recommendations}
                            onChange={(e) => handleEvaluationChange(e.target.name, e.target.value)}
                            style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}
                            required
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#006bbd', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}>Soumettre</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                visible={createModalVisible}
                onCancel={handleCreateModalClose}
                footer={null}
            >
                <CreateProgrammeVisite
                    visible={createModalVisible}
                    onClose={handleCreateModalClose}
                />
            </Modal>
        </>
    );
};

export default ListeVisiteEvaluation;
