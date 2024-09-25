import React, { useState, useEffect } from 'react';
import { Table, Space, message, Modal, Button, Popconfirm, Avatar, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddAdministrationForm from './ajouterAdministration';
import { useAuth } from '../../hooks/AuthContext';
import { useHistory } from 'react-router-dom';

const API_URL = 'http://localhost:5000/getlistAdministrations';
const ERROR_MESSAGE = "Erreur lors de la récupération des administrateurs.";

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff', 
    minHeight: '100vh', 
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    color: '#1890ff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
  },
  addButton: {
    alignSelf: 'flex-end', 
    marginBottom: '16px',
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  actionIcons: {
    fontSize: '18px',
    color: '#1890ff',
    cursor: 'pointer',
  },
  tableHeader: {
    backgroundColor: '#fafafa',
    fontWeight: 'bold',
  },
  tableRow: {
    backgroundColor: '#fff',
  },
};

const AdminPubliqueList = () => {
  const [admins, setAdmins] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = () => {
    axios.get(API_URL, { withCredentials: true })
      .then(response => {
        const filteredAdmins = response.data.filter(admin => admin.firstName && admin.lastName);
        setAdmins(filteredAdmins);
      })
      .catch(() => {
        message.error(ERROR_MESSAGE);
      });
  };

  const handleDelete = async (id)=> {
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      fetchAdmins();
      message.success("Administrateur supprimé avec succès.");
    } catch (error) {
      message.error("Erreur lors de la suppression de l'administrateur.");
    }
  };

  const handleAddAdmin = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSuccess = () => {
    setIsModalVisible(false);
    fetchAdmins();
  };

  const columns = [
    {
      title: 'Image de profil',
      dataIndex: 'profile_image',
      key: 'profile_image',
      render: (text) => (
        <Avatar src={`http://127.0.0.1:5000/static/uploads/${text}`} size={64} />
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Prénom',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Nom',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Nom d\'administration',
      dataIndex: 'nameAdminPublique',
      key: 'nameAdminPublique',
    },
    
  ];

  const paginationConfig = {
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30'],
  };

  return (
    <div style={styles.container}>
    <h2 className="titre-liste"  style={{ 
  textAlign: 'center', 
  color: '#2B6CC4', 
  fontFamily: 'Arial, sans-serif', 
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
  margin: '20px 0', 
  padding: '10px 0' 
}}>Administrations Publiques
</h2>
<Button
      type="primary"
      onClick={handleAddAdmin}
      icon={<PlusOutlined />}
      style={{ ...styles.addButton, backgroundColor: "#006bbd" }}
    >
      Ajouter
    </Button>
      <Table
        dataSource={admins}
        columns={columns}
        rowKey="id"
        pagination={paginationConfig}
        className="admin-table"
        rowClassName={() => styles.tableRow}
      />
      
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <AddAdministrationForm user={user} onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};

export default AdminPubliqueList;