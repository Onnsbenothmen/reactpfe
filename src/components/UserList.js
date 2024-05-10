import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Avatar, Table, Button, Modal, message, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      const response = await axios.post(`http://127.0.0.1:5000/users/${id}/archive`);
      if (response.status === 200) {
        console.log('Utilisateur archivé avec succès');
        fetchUsers();  // Rafraîchir la liste des utilisateurs après l'archivage
        fetchArchivedUsers(); // Rafraîchir la liste des utilisateurs archivés
      } else {
        console.error('Erreur lors de l\'archivage de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de l\'archivage de l\'utilisateur:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/users');
      setUsers(response.data.data.map(user => ({ ...user, isButtonDisabled: false })));
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleArchive = async () => {
    setIsArchiveVisible(true);
    await fetchArchivedUsers(); // Appel pour récupérer les utilisateurs archivés
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      console.log('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
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
        <Button type="primary" htmlType="submit">
          Enregistrer
        </Button>
        <Button onClick={closeModal} style={{ marginLeft: 8 }}>
          Annuler
        </Button>
      </Form>
    );
  };

  const addUser = async () => {
    console.log("Ajouter un utilisateur");
  };

  const handleCloseArchive = () => {
    setIsArchiveVisible(false);
  };
  const handleActivate = async (id) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/users/${id}/activate`);
      if (response.status === 200) {
        console.log('Utilisateur activé avec succès');
        // Mettre à jour la liste des utilisateurs archivés localement
        const updatedArchivedUsers = archivedUsers.filter(user => user.id !== id);
        setArchivedUsers(updatedArchivedUsers);
        // Afficher une alerte
        message.success('Utilisateur réactivé avec succès');
      } else {
        console.error('Erreur lors de l\'activation de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation de l\'utilisateur:', error);
      // Afficher une alerte en cas d'erreur
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
        : <div style={{ backgroundColor: 'coral', width: 40, height:40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '14px', color: '#ffffff' }}>
            {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
          </span>
        </div>
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
      title: 'Actions',
      key: 'actions',
      render: (text, user) => (
        <span>
          <Button type="primary" onClick={() => handleUpdate(user)}>
            Modifier
          </Button>
          <Button type="danger" onClick={() => handleDelete(user.id)}>
            Supprimer
          </Button>
          <Button disabled={user.isButtonDisabled} style={{ backgroundColor: 'orange', color: 'black' }} onClick={() => handleDisable(user.id)}>Désactiver</Button>
        </span>
      ),
    },
  ];

  const archiveColumns = [
    {
      title: 'Image de profil',
      dataIndex: 'profile_image',
      key: 'profile_image',
      render: (text, user) => (
        text 
        ? <Avatar src={`http://127.0.0.1:5000/static/uploads/${text}`} size={40} />
        : <div style={{ backgroundColor: 'coral', width: 40, height:40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '14px', color: '#ffffff' }}>
            {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
          </span>
        </div>
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
      title: 'Actions',
      key: 'actions',
      render: (text, user) => (
        <span>
          <Button style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleActivate(user.id)}>Réactiver</Button>
        </span>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <Title level={2} className="text-center">Liste des Utilisateurs</Title>
      <div style={{ marginBottom: '20px' }}>
        <Button
          type="primary"
          onClick={handleArchive}
        >
          Archives
        </Button>
      </div>
      <Table 
        dataSource={users} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }} 
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
      <Modal 
        title="Archive" 
        visible={isArchiveVisible} 
        onCancel={handleCloseArchive} 
        footer={null}
      >
        <Table 
          dataSource={archivedUsers} 
          columns={archiveColumns} 
          rowKey="id" 
          pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }} 
          rowClassName={() => 'compact-row'} 
          size="small" 
        />
      </Modal>
    </div>
  );
};

export default UserList;
