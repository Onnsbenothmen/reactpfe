import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Select, Modal, Form, Input, Table, Button, Card, message } from 'antd';
import Swal from 'sweetalert2';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
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
        } else {
            setFilteredInstances(instances);
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

   // Dans InstanceList.js

// Fonction pour gérer la modification d'une instance
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

// Fonction pour soumettre le formulaire
const handleFormSubmit = async (values) => {
    try {
        if (instanceToEdit) {
            // Si instanceToEdit est défini, cela signifie que nous mettons à jour une instance existante
            await axios.put(`http://localhost:5000/instances/${instanceToEdit.id}`, values);
            // Mettre à jour l'état des instances après la modification
            const updatedInstances = instances.map(instance =>
                instance.id === instanceToEdit.id ? { ...instance, ...values } : instance
            );
            setInstances(updatedInstances);
            setFilteredInstances(updatedInstances);
        } else {
            // Sinon, nous ajoutons une nouvelle instance
            await axios.post('http://localhost:5000/addInstances', values);
            // Mettre à jour la liste des instances après l'ajout
            fetchInstances();
        }
        // Fermer le modal après avoir soumis le formulaire avec succès
        handleModalClose();
    } catch (error) {
        // Gérer les erreurs de manière appropriée
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
        <div className="container py-4">
            <div className="text-center">
                <Title level={2} className="text-primary mb-4">Toutes les instances</Title>
            </div>
            <div style={{ marginBottom: '16px' }}>
          
                <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}  style={{ backgroundColor: 'green', borderColor: 'green' }}>Ajouter une instance</Button>
            </div>
            <Table columns={columns} dataSource={filteredInstances} />
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
                                <Select.Option value={true}>Oui</Select.Option>
                                <Select.Option value={false}>Non</Select.Option>
                            </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Enregistrer</Button>
                    </Form>
                </Card>
            </Modal>
        </div>
    );
};

export default InstanceList;
