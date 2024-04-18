import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Input, Space, message, Modal, Form } from 'antd';

const { Column } = Table;
const { Item } = Form;

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/roles');
      setRoles(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles :', error);
    }
  };

  const handleCreateRole = async () => {
    try {
      await axios.post('http://localhost:5000/roles', { name: newRoleName });
      fetchRoles();
      setNewRoleName("");
      message.success('Rôle créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création du rôle :', error);
      message.error('Erreur lors de la création du rôle');
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/roles/${id}`);
      fetchRoles();
      message.success('Rôle supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du rôle :', error);
      message.error('Erreur lors de la suppression du rôle');
    }
  };

  const handleEditRole = (role) => {
    setEditMode(true);
    setEditingRole(role);
  };

  const handleUpdateRole = async (values) => {
    try {
      await axios.put(`http://localhost:5000/roles/${editingRole.id}`, values);
      setEditMode(false);
      setEditingRole(null);
      fetchRoles();
      message.success('Rôle modifié avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification du rôle :', error);
      message.error('Erreur lors de la modification du rôle');
    }
  };

  return (
    <div>
      <h2>Liste des rôles</h2>
      <Input
        placeholder="Nom du rôle"
        value={newRoleName}
        onChange={(e) => setNewRoleName(e.target.value)}
        style={{ width: 200, marginRight: 16 }}
      />
      <Button type="primary" onClick={handleCreateRole}>Créer</Button>
      <Table dataSource={roles} rowKey="id" style={{ marginTop: 16 }}>
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Nom" dataIndex="name" key="name" />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Button type="link" onClick={() => handleEditRole(record)}>Modifier</Button>
              <Button type="link" danger onClick={() => handleDeleteRole(record.id)}>Supprimer</Button>
            </Space>
          )}
        />
      </Table>
      <Modal
        title="Modifier le rôle"
        visible={editMode}
        onCancel={() => setEditMode(false)}
        footer={null}
      >
        <Form
          initialValues={{ name: editingRole ? editingRole.name : '' }}
          onFinish={handleUpdateRole}
        >
          <Item
            label="Nom du rôle"
            name="name"
            rules={[{ required: true, message: 'Veuillez entrer le nom du rôle' }]}
          >
            <Input />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">Enregistrer</Button>
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RolesList;
