import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Modal, Form, Input, Table, Button, Card, message, Select } from 'antd';
import Swal from 'sweetalert2';
import { EditOutlined, PlusOutlined, SearchOutlined, MailOutlined, StopOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Popconfirm } from 'antd';
import './inst.css';
import OrgChartComponent from './OrgChartComponent'; // Import OrgChartComponent

const { Column } = Table;
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
    const [inputVisible, setInputVisible] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [archivedInstancesModalVisible, setArchivedInstancesModalVisible] = useState(false);
    const [archivedInstances, setArchivedInstances] = useState([]);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedInstanceName, setSelectedInstanceName] = useState('');

    const fetchUsersByInstance = async (instanceId) => {
        try {
            const response = await axios.get(`http://localhost:5000/instances/${instanceId}/users`);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    };

    const handleShowUsers = async (instance) => {
        const users = await fetchUsersByInstance(instance.id);
        setUsers(users);
        setSelectedInstanceName(instance.instance_name);
        setUserModalVisible(true);
    };

    const fetchArchivedInstances = async () => {
        try {
            const response = await axios.get('http://localhost:5000/desactiveInstances');
            setArchivedInstances(response.data.data);
        } catch (error) {
            console.error('Error fetching archived instances:', error);
        }
    };

    const handleIconClick = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDisable = async (id) => {
        try {
            await axios.put(`http://localhost:5000/instances/${id}/disable`);
            fetchInstances();
            message.success('Instance désactivée avec succès!');
        } catch (error) {
            console.error('Error disabling instance:', error);
            message.error('Une erreur s\'est produite lors de la désactivation de l\'instance.');
        }
    };

    const searchInstances = async (term) => {
        try {
            const response = await axios.get(`http://localhost:5000/instances/search?q=${term}`);
            setSearchResults(response.data);
            setNoResultsFound(response.data.length === 0);
        } catch (error) {
            console.error('Error searching instances:', error);
        }
    };

    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
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
            ville: instance.ville,
        });
        setModalVisible(true);
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
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const resendEmailToPresident = async (id) => {
        try {
            await axios.post(`http://localhost:5000/resendEmailToPresident/${id}`);
            Swal.fire({
                icon: 'success',
                title: 'Succès!',
                text: 'E-mail renvoyé avec succès',
            });
        } catch (error) {
            console.error('Error resending email:', error);
        }
    };

    const handleRearchive = async (instanceId) => {
        try {
            await axios.put(`http://localhost:5000/instances/${instanceId}/rearchive`);
            // Rafraîchir la liste des instances après la réactivation réussie
            fetchInstances(); // Assurez-vous d'avoir une fonction fetchInstances pour mettre à jour la liste des instances
            fetchArchivedInstances(); // Rafraîchir également la liste des instances archivées
            message.success('Instance réarchivée avec succès!');
        } catch (error) {
            console.error('Error rearchiving instance:', error);
            message.error('Une erreur s\'est produite lors de la réactivation de l\'instance.');
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

    const handleFormSubmit = async (values) => {
        if (instanceToEdit) {
            try {
                await axios.put(`http://localhost:5000/instances/${instanceToEdit.id}`, values);
                setInstances(prevInstances =>
                    prevInstances.map(instance =>
                        instance.id === instanceToEdit.id ? { ...instance, ...values } : instance
                    )
                );
                handleModalClose();
                Swal.fire({
                    icon: 'success',
                    title: 'Succès!',
                    text: 'Instance mise à jour avec succès',
                });
            } catch (error) {
                console.error(error);
                message.error('Une erreur s\'est produite lors de la mise à jour de l\'instance.');
            }
        } else {
            try {
                await axios.post('http://localhost:5000/addInstances', values);
                fetchInstances();
                handleModalClose();
                Swal.fire({
                    icon: 'success',
                    title: 'Succès!',
                    text: 'Instance ajoutée avec succès',
                });
            } catch (error) {
                console.error(error);
                message.error('Une erreur s\'est produite lors de la soumission du formulaire.');
            }
        }
    };

    const columns = [
        {
            title: 'ID de l\'instance',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Email du président',
            dataIndex: 'president_email',
            key: 'president_email'
        },
        {
            title: 'Nom de l\'instance',
            dataIndex: 'instance_name',
            key: 'instance_name',
            render: (text, record) => (
                <Button type="link" onClick={() => handleShowUsers(record)}>
                    {text}
                </Button>
            )
        },
        {
            title: 'Nombre de conseillé',
            dataIndex: 'nombre_conseille',
            key: 'nombre_conseille'
        },
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
{
title: 'Créé à',
dataIndex: 'created_at',
key: 'created_at'
},
{
title: 'Envoyer un e-mail',
dataIndex: '',
key: 'send_email',
render: (text, record) => (
<span>
<MailOutlined style={{ color: 'blue', marginRight: 8 }} onClick={() => resendEmailToPresident(record.id)} />
</span>
)
},
{
title: 'Actions',
dataIndex: '',
key: 'actions',
render: (text, record) => (
<span>
{record.active && (
<Popconfirm
title="Êtes-vous sûr de vouloir désactiver cette instance?"
onConfirm={() => handleDisable(record.id)}
okText="Oui"
cancelText="Non"
>
<StopOutlined style={{ color: 'red', marginRight: 8 }} />
</Popconfirm>
)}
{!record.active && (
<Popconfirm
title="Êtes-vous sûr de vouloir réactiver cette instance?"
onConfirm={() => handleRearchive(record.id)}
okText="Oui"
cancelText="Non"
>
<EditOutlined style={{ color: 'green', marginRight: 8 }} />
</Popconfirm>
)}
<EditOutlined style={{ color: 'blue' }} onClick={() => handleEdit(record)} />
</span>
)
}
];
return (
    
    <div>
        
        <Card style={{ marginBottom: 10 }}>
        <h2 style={{ 
        textAlign: 'center', 
        color: '#2B6CC4', 
        fontFamily: 'Arial, sans-serif', 
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
        margin: '20px 0', 
        padding: '10px 0',
      }}>
        Liste des Instances

      </h2>
      <br></br>            
            <div style={{ marginBottom: 10 }}>
                <Input
                    placeholder="Rechercher par nom d'instance..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenModal}
                style={{ backgroundColor: '#006bbd', borderColor: '#006bbd' }}
            >
                Ajouter une instance
            </Button>
            <Button 
    style={{ backgroundColor: 'darkgray', borderColor: 'darkgray' }}
    onClick={() => {
        setArchivedInstancesModalVisible(true);
        fetchArchivedInstances();
    }}
>
    listes archiver
</Button>        </div>
            <Table dataSource={searchResults} columns={columns} rowKey="id" loading={loading} />
        </Card>
        
        




        <Modal
            title={instanceToEdit ? 'Modifier l\'instance' : 'Ajouter une nouvelle instance'}
            visible={modalVisible}
            onOk={() => form.submit()}
            onCancel={handleModalClose}
            okText="Enregistrer"
            cancelText="Annuler"
            confirmLoading={loading}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
            >
                <Form.Item
                    name="president_email"
                    label="Email du président"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez saisir l\'email du président!',
                        },
                        {
                            type: 'email',
                            message: 'Veuillez saisir un email valide!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="instance_name"
                    label="Nom de l'instance"
                    rules={[{ required: true, message: 'Veuillez saisir le nom de l\'instance!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="nombre_conseille"
                    label="Nombre de conseillé"
                    rules={[{ required: true, message: 'Veuillez saisir le nombre de conseillé!' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    name="ville"
                    label="Ville"
                    rules={[{ required: true, message: 'Veuillez sélectionner la ville!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Sélectionner une ville"
                        optionFilterProp="children"
                        onChange={handleCityChange}
                    >
                        <Option value="Nabeul">Nabeul</Option>
                        <Option value="Tunis">Tunis</Option>
                        <Option value="Sousse">Sousse</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
        <Modal
            title={`Utilisateurs de l'instance ${selectedInstanceName}`}
            visible={userModalVisible}
            onCancel={() => setUserModalVisible(false)}
            footer={null}
        >
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </Modal>
        {userModalVisible && (
           <Modal
           title={`Organigramme de l'instance ${selectedInstanceName}`}
           visible={userModalVisible}
           onCancel={() => setUserModalVisible(false)}
           footer={null}
           width={1200} // Définir une largeur personnalisée pour la modal
           style={{ top: 20 }} // Ajuster la position de la modal
           bodyStyle={{ height: '70vh', overflow: 'auto' }} // Ajuster la hauteur et la gestion du défilement
         >
           <OrgChartComponent users={users} />
         </Modal>
        )}


<Modal

visible={archivedInstancesModalVisible}
onCancel={() => setArchivedInstancesModalVisible(false)}
footer={null}
width={1200} // Définir une largeur personnalisée pour le modal
bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }} // Définir une hauteur maximale avec un défilement pour le corps du modal
className="pointed-modal" // Appliquer une classe CSS personnalisée pour le modal

>
<div style={{ textAlign: 'center' }}> 
    <h2 style={{ color: 'red' }}>Listes désactivées</h2>
</div> <br></br> <br></br>
<Table dataSource={archivedInstances} pagination={false} size="middle" bordered>
    <Column title="ID de l'instance" dataIndex="id" key="id" />
    <Column title="Email du président" dataIndex="president_email" key="president_email" />
    <Column title="Nom de l'instance" dataIndex="instance_name" key="instance_name" />
    <Column title="Nombre de conseillé" dataIndex="nombre_conseille" key="nombre_conseille" />
    <Column title="Ville" dataIndex="ville" key="ville" />
    <Column title="Créé à" dataIndex="created_at" key="created_at" />
    <Column
title="Réarchiver"
key="rearchive"
render={(text, record) => (
    <Button 
        type="primary" 
        onClick={() => handleRearchive(record.id)}
        style={{ 
            background: 'white', // Fond blanc
            border: '1px solid red', // Bordure rouge
            color: 'red', // Texte rouge
        }}
    >
        Réarchiver
    </Button>
)}
/>
</Table>
</Modal>
    </div>

);
};
export default InstanceList;
