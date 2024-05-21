import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Modal, Form, Input, Table, Button, Card, message, Select } from 'antd';
import Swal from 'sweetalert2';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, MailOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Title } = Typography;
const { Option } = Select;

const InstanceList = () => {
    const [instances, setInstances] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [filteredInstances, setFilteredInstances] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [instanceToEdit, setInstanceToEdit] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [inputVisible, setInputVisible] = useState(false); // État pour contrôler la visibilité de l'entrée


    const handleIconClick = () => {
        setInputVisible(true); // Afficher l'entrée lorsque l'icône est cliquée
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };


    const searchInstances = async (term) => {
        try {
            const response = await axios.get(`http://localhost:5000/instances/search?q=${term}`);
            setSearchResults(response.data);
            setNoResultsFound(response.data.length === 0); // Mettre à jour l'état noResultsFound
        } catch (error) {
            console.error('Error searching instances:', error);
        }
    };

    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);

        // Déclencher la recherche en temps réel avec le terme de recherche actuel
        searchInstances(newSearchTerm);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm === '') {
                setSearchResults([]);
                return;
            }
            searchInstances(searchTerm);
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm]);

    const fetchInstances = async () => {
        try {
            const response = await axios.get('http://localhost:5000/instances');
            setInstances(response.data.data);
            setFilteredInstances(response.data.data);
        } catch (error) {
            console.error('Error fetching instances:', error);
        }
    };

    useEffect(() => {
        fetchInstances();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            const filtered = instances.filter(instance => instance.ville.toLowerCase() === selectedCity.toLowerCase());
            setFilteredInstances(filtered);
            setSearchResults(filtered);
        } else {
            setFilteredInstances(instances);
            setSearchResults(instances);
        }
    }, [selectedCity, instances]);

    const handleEdit = (instance) => {
        setInstanceToEdit(instance);
        form.setFieldsValue({
            president_email: instance.president_email,
            instance_name: instance.instance_name,
            nombre_conseille: instance.nombre_conseille,
            gouvernement: instance.gouvernement,
            ville: instance.ville,
            active: instance.active
        });
        setModalVisible(true);
    };
    const handleSendEmail = (id) => { }


    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios.delete(`http://localhost:5000/instances/${id}`);
                    setInstances(instances.filter(instance => instance.id !== id));
                } catch (error) {
                    console.error('Error deleting instance:', error);
                }
            }
        });
    };
    const sendEmailToPresident = async (presidentEmail, instanceName, ville, newUserId) => {
        try {
            await axios.post('http://localhost:5000/sendEmailToPresident', {
                president_email: presidentEmail,
                instance_name: instanceName,
                ville: ville,
                new_user_id: newUserId
            });
            console.log('Email sent successfully');
            // Afficher un message de succès ou effectuer une autre action en cas de réussite
        } catch (error) {
            console.error('Error sending email:', error);
            // Gérer les erreurs ici
        }
    };
    const resendEmailToPresident = async (id) => {
        try {
            // Faites une requête au backend pour renvoyer l'e-mail au président en utilisant l'identifiant de l'instance
            await axios.post(`http://localhost:5000/resendEmailToPresident/${id}`);

            // Afficher l'alerte pour indiquer que l'e-mail a été renvoyé avec succès
            Swal.fire({
                icon: 'success',
                title: 'Succès!',
                text: 'E-mail renvoyé avec succès',
            });
        } catch (error) {
            console.error('Error resending email:', error);
            // Gérer les erreurs ici
        }
    };


    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setInstanceToEdit(null);
        form.resetFields();
    };

    const handleCityChange = (value) => {
        setSelectedCity(value);
    };

    const handleUpdate = (instance) => {
        setInstanceToEdit(instance);
        form.setFieldsValue({
            president_email: instance.president_email,
            instance_name: instance.instance_name,
            nombre_conseille: instance.nombre_conseille,
            gouvernement: instance.gouvernement,
            ville: instance.ville,
            active: instance.active
        });
        setModalVisible(true);
    };

    const handleFormSubmit = async (values) => {
        try {
            // Ajout d'une nouvelle instance
            await axios.post('http://localhost:5000/addInstances', values);

            // Actualisation de la liste des instances après ajout réussi
            fetchInstances();

            handleModalClose();

            // Afficher l'alerte pour indiquer que l'instance a été ajoutée avec succès
            Swal.fire({
                icon: 'success',
                title: 'Succès!',
                text: 'Instance ajoutée et e-mail envoyé avec succès',
            });
        } catch (error) {
            console.error(error);
            message.error('Une erreur s\'est produite lors de la soumission du formulaire.');
        }
    };

    const columns = [
        { title: 'ID de l\'instance', dataIndex: 'id', key: 'id' },
        { title: 'Email du président', dataIndex: 'president_email', key: 'president_email' },
        { title: 'Nom de l\'instance', dataIndex: 'instance_name', key: 'instance_name' },
        { title: 'Nombre de conseillé', dataIndex: 'nombre_conseille', key: 'nombre_conseille' },
        { title: 'Gouvernement', dataIndex: 'gouvernement', key: 'gouvernement' },
        {
            title: 'Ville',
            dataIndex: 'ville',
            key: 'ville',
            filters: [
                { text: 'Nabeul', value: 'Nabeul' },
                { text: 'Tunis', value: 'Tunis' },
                { text: 'Sousse', value: 'Sousse' },
            ],
            onFilter: (value, record) => record.ville.toLowerCase() === value.toLowerCase()
        },
        { title: 'Active', dataIndex: 'active', key: 'active', render: active => (active ? 'Oui' : 'Non') },
        { title: 'Créé à', dataIndex: 'created_at', key: 'created_at' },
        {
            title: 'Envoyer un e-mail',
            dataIndex: '',
            key: 'send_email',
            render: (_, record) => (
                <span>
                    <MailOutlined style={{ color: 'blue', marginRight: 8 }} onClick={() => resendEmailToPresident(record.id)} />
                </span>
            ),
        },
        {
            title: 'Actions',
            dataIndex: '',
            key: 'actions',
            render: (_, record) => (
                <span>
                    <EditOutlined style={{ color: '#1890ff', marginRight: 8 }} onClick={() => handleEdit(record)} />
                    <DeleteOutlined style={{ color: 'red' }} onClick={() => handleDelete(record.id)} />
                </span>
            ),
        },
    ];

    return (
        <div className=" py-4">
            <div className="text-center">
                <Title level={2} className="text-primary mb-4">Toutes les instances</Title>
            </div>
            <div>
                {inputVisible ? (
                    <Input
                        value={searchTerm}
                        onChange={handleInputChange}
                        onPressEnter={searchInstances}
                        onBlur={() => setInputVisible(false)} // Cacher l'entrée lorsque l'utilisateur perd le focus
                    />
                ) : (
                    <SearchOutlined
                        style={{ color: 'rgba(0,0,0,.25)' }}
                        onClick={handleIconClick}
                    />
                )}
            </div>

            <div style={{ marginBottom: '16px' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleOpenModal}
                    style={{ backgroundColor: 'green', borderColor: 'green' }}
                >
                    Ajouter une instance
                </Button>
            </div>
            {noResultsFound && <div>Aucun résultat trouvé.</div>} {/* Ajoutez la ligne ici */}
            <Table columns={columns} dataSource={searchTerm ? (noResultsFound ? [] : searchResults) : filteredInstances} />
            <Modal
                title="Ajouter une instance"
                visible={modalVisible}
                onCancel={handleModalClose}
                footer={null}
            >
                <Card>
                    <Form form={form} onFinish={handleFormSubmit}>
                        <Form.Item name="president_email" label="Email du président">
                            <Input />
                        </Form.Item>
                        <Form.Item name="instance_name" label="Nom de l'instance">
                            <Input />
                        </Form.Item>
                        <Form.Item name="nombre_conseille" label="Nombre de conseillé">
                            <Input />
                        </Form.Item>
                        <Form.Item name="gouvernement" label="Gouvernement">
                            <Input />
                        </Form.Item>
                        <Form.Item name="ville" label="Ville">
                            <Input />
                        </Form.Item>
                        <Form.Item name="active" label="Active">
                            <Select>
                                <Option value={true}>Oui</Option>
                                <Option value={false}>Non</Option>
                            </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit"  >Enregistrer</Button>
                    </Form>
                </Card>
            </Modal>
        </div>
    );
};

export default InstanceList;
