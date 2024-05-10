import React, { useState } from 'react';
import axios from 'axios';
import { Layout, Typography, Button, Modal, Form, Input, message } from 'antd'; // Importez Text depuis la bibliothèque antd
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/AuthContext';
import './Propos.css'; // Créez un fichier PersonalProfile.css pour le style

const { Content } = Layout;
const { Title, Text } = Typography;

const PersonalProfile = () => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleFinish = (values) => {
    const { newPassword, confirmPassword, currentPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error('Les mots de passe ne correspondent pas');
      return;
    }

    axios.post('http://127.0.0.1:5000/api/change-password', {
      userId: user.id,
      currentPassword,
      newPassword
    })
    .then(response => {
      message.success('Mot de passe changé avec succès');
      handleCloseModal();
      form.resetFields();
    })
    .catch(error => {
      message.error('Échec du changement de mot de passe');
      console.error(error);
    });
  };

  return (
    <section className="personal-profile">
      <Content className="content">
        <div className="profile-container">
          <div className="user-info">
            <Title level={3}>{user.firstName} {user.lastName}</Title>
            <Text><MailOutlined /> {user.email}</Text>
            <Text><PhoneOutlined /> {user.phoneNumber}</Text>
            <Text><HomeOutlined /> {user.address}</Text>
          </div>
          <div className="action-buttons">
            <Button type="primary" onClick={handleOpenModal}>Changer de mot de passe</Button>
          </div>
        </div>
        <div className="avatar-container">
          <img className="avatar-round" src={user.profile_image ? `http://127.0.0.1:5000/static/uploads/${user.profile_image}` : null} alt="Avatar" />
        </div>
      </Content>
      <Modal
        title="Changer le mot de passe"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            label="Mot de passe actuel"
            name="currentPassword"
            rules={[{ required: true, message: 'Veuillez saisir votre mot de passe actuel' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Nouveau mot de passe"
            name="newPassword"
            rules={[
              { required: true, message: 'Veuillez saisir votre nouveau mot de passe' },
              { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' },
              { pattern: /^(?=.*[0-9])(?=.*[A-Z]).+$/, message: 'Le mot de passe doit contenir au moins un chiffre et une lettre majuscule' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirmer le nouveau mot de passe"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Veuillez confirmer votre nouveau mot de passe' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Changer le mot de passe</Button>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default PersonalProfile;
