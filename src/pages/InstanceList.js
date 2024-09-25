import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Modal, Form, Input, Card, Button, Select, message } from 'antd';
import Swal from 'sweetalert2';
import { SearchOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import OrgChartComponent from './OrgChartComponent';
import './inst.css';  // Importer le fichier CSS personnalisé

const { Title } = Typography;
const { Option } = Select;

const InstanceList = () => {
    const [instances, setInstances] = useState([]);
    const [filteredInstances, setFilteredInstances] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [instanceToEdit, setInstanceToEdit] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedInstanceName, setSelectedInstanceName] = useState('');
    const [selectedCity, setSelectedCity] = useState(undefined); // Initialisé à undefined pour le placeholder

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

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCityChange = (value) => {
        setSelectedCity(value);
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

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm === '') {
                setSearchResults([]);
                setNoResultsFound(false);
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
            setSearchResults(response.data.data);
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

    const handleModalClose = () => {
        setModalVisible(false);
        setInstanceToEdit(null);
        form.resetFields();
    };

    const handleFormSubmit = async (values) => {
        if (instanceToEdit) {
            try {
                await axios.put(`http://localhost:5000/instances/${instanceToEdit.id}`, values);
                const updatedInstances = instances.map(instance =>
                    instance.id === instanceToEdit.id ? { ...instance, ...values } : instance
                );
                setInstances(updatedInstances);
                setFilteredInstances(updatedInstances);
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

    return (
        <div className="instance-list-container" style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/dra.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            padding: '40px', // Plus de padding pour espacer le contenu
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <Card className="instance-list-card" style={{
                width: '90%',
                maxWidth: '1200px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Léger fond blanc pour contraste avec l'image
                padding: '20px',
                borderRadius: '8px'
            }}>
                <Title level={3} className="instance-list-title" style={{ textAlign: 'center' }}>
                    Instances
                </Title>
                
                <div className="search-filter-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Input
                        placeholder="Rechercher par nom d'instance..."
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                        style={{ marginBottom: '10px', width: '50%' }}
                    />
                    <Select
                        placeholder="Filtrer par ville"
                        value={selectedCity}
                        onChange={handleCityChange}
                        className="filter-select"
                        style={{ width: '50%' }}
                    >
                        <Option value="Nabeul">Nabeul</Option>
                        <Option value="Tunis">Tunis</Option>
                        <Option value="Sousse">Sousse</Option>
                    </Select>
                </div>
                <div className="card-container" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between', // Espace entre les lignes
                    gap: '20px'
                }}>
                    {searchResults.map(instance => (
                        <Card key={instance.id} className="card" style={{
                            flex: '0 1 calc(33% - 20px)', // 3 cartes par ligne, en tenant compte de l'espacement
                            minWidth: '280px', // Largeur minimum pour une bonne mise en page
                            textAlign: 'center'
                        }}>
                            <p className="card-title" style={{ fontWeight: 'bold' }}>{instance.instance_name}</p>
                            <p className="card-content">Nombre de conseillés: {instance.nombre_conseille}</p>
                            <p className="card-content">Ville: {instance.ville}</p>
                            <Button type="link" className="card-button" onClick={() => handleShowUsers(instance)}>
                                Voir les conseillers
                            </Button>
                        </Card>
                    ))}
                </div>
            </Card>
            
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
                    width={1200}
                    style={{ top: 20 }}
                    bodyStyle={{ height: '70vh', overflow: 'auto' }}
                >
                    <OrgChartComponent users={users} />
                </Modal>
            )}
        </div>
    );
};

export default InstanceList;
