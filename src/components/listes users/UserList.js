import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Avatar, Table, Modal, Form, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isArchiveVisible, setIsArchiveVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchArchivedUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/archived-user');
      setArchivedUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs archivés:', error);
    }
  };

  const handleDisable = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:5000/users/${id}/archive`);
      message.success('Utilisateur archivé avec succès');
      fetchUsers();  // Rafraîchir la liste des utilisateurs après l'archivage
      fetchArchivedUsers(); // Rafraîchir la liste des utilisateurs archivés
    } catch (error) {
      console.error('Erreur lors de l\'archivage de l\'utilisateur:', error);
      message.error('Erreur lors de l\'archivage de l\'utilisateur');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/Allusers');
      setUsers(response.data.data.map(user => ({ ...user, isButtonDisabled: false })));
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };



  const handleUpdate = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await axios.put(`http://127.0.0.1:5000/users/${updatedUser.id}`, updatedUser);
      if (response.status === 200) {
        message.success('Utilisateur mis à jour avec succès.');
        handleCloseModal();
        fetchUsers(); // Rafraîchir la liste des utilisateurs après la mise à jour
      } else {
        message.error('Erreur lors de la mise à jour de l\'utilisateur.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      message.error('Une erreur s\'est produite lors de la mise à jour de l\'utilisateur.');
    }
  };
  
  

  const UpdateUserForm = ({ user, closeModal, updateUser }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
      const updatedUser = { ...user, ...values };
      updateUser(updatedUser);
    };

    return (
      <Form form={form} onFinish={onFinish} initialValues={user}>
        <Form.Item name="firstName" label="Prénom">
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Nom">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Numéro de téléphone">
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Enregistrer
        </Button>
        <Button onClick={closeModal} style={{ marginLeft: 8 }}>
          Annuler
        </Button>
      </Form>
    );
  };

  const handleActivate = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:5000/users/${id}/activate`);
      message.success('Utilisateur activé avec succès');
      // Mettre à jour la liste des utilisateurs archivés localement
      const updatedArchivedUsers = archivedUsers.filter(user => user.id !== id);
      setArchivedUsers(updatedArchivedUsers);
    } catch (error) {
      console.error('Erreur lors de l\'activation de l\'utilisateur:', error);
      message.error('Erreur lors de la réactivation de l\'utilisateur');
    }
  };

  const columns = [
    {
      title: 'Image de profil',
      dataIndex: 'profile_image',
      key: 'profile_image',
      render: (text, user) => (
        text 
        ? <Avatar src={`http://127.0.0.1:5000/static/uploads/${text}`} size={40} />
        : <Avatar icon={<UserOutlined />} size={40} />
      ),
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
      title: 'Téléphone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },

    {
      title: 'Actions',
      key: 'actions',
      render: (text, user) => (
        <span>
          <Button type="primary" onClick={() => handleUpdate(user)}>
            Modifier
          </Button>
      
          <Button disabled={user.isButtonDisabled} style={{ backgroundColor: 'orange', color: 'black' }} onClick={() => handleDisable(user.id)}>Désactiver</Button>
        </span>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <Title level={2} className="text-center">Liste des Utilisateurs</Title>
      <Table 
        dataSource={users} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }} 
        rowClassName={() => 'compact-row'} 
        size="small" 
      />
      <Modal 
        title="Modifier l'utilisateur" 
        visible={isModalVisible} 
        onCancel={handleCloseModal} 
        footer={null}
      >
        {selectedUser && <UpdateUserForm user={selectedUser} closeModal={handleCloseModal} updateUser={handleUpdateUser} />}
      </Modal>
    </div>
  );
};

export default UserList;
