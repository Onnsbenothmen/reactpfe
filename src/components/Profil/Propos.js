import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import axios from 'axios';
import { Layout, Typography, Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import './PersonalProfile.css'; // Importez votre fichier CSS pour les styles personnalisés
import UpdateProfil from './UpdateProfil';

const { Content } = Layout;
const { Title, Text } = Typography;


const PersonalProfile = () => {
  const history = useHistory();
  const { user, setUser } = useAuth();
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);

  const handleOpenEditProfileModal = () => {
    setEditProfileModalVisible(true);
  };


const handleCloseEditProfileModal = () => {
    setEditProfileModalVisible(false);
  };
  

  const handleOpenChangePasswordModal = () => {
    setChangePasswordModalVisible(true);
  };

  const handleCloseChangePasswordModal = () => {
    setChangePasswordModalVisible(false);
  };

  const handleFinishChangePassword = (values) => {
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
      handleCloseChangePasswordModal();
      form.resetFields();
    })
    .catch(error => {
      message.error('Échec du changement de mot de passe');
      console.error(error);
    });
  };
  const handleAfterSave = () => {
    // Fermer la modale après avoir enregistré les modifications du profil
    handleCloseEditProfileModal();
  };

  return (
    <section className="personal-profile">
      <div className="profile-container">
        <div className="avatar-info-container">
          <div className="avatar-container">
            <img className="avatar-round" src={user.profile_image ? `http://127.0.0.1:5000/static/uploads/${user.profile_image}` : null} alt="Avatar" />
          </div>
        </div>
        <div className="user-info">
          <Title level={3}>{user.firstName} {user.lastName}</Title><br></br><br></br>
          <Text><MailOutlined /> {user.email}</Text><br></br><br></br>
          <Text><PhoneOutlined /> {user.phoneNumber}</Text><br></br><br></br>
          <Text><HomeOutlined /> {user.address}</Text><br></br><br></br><br></br><br></br><br></br>
          <div className="action-buttons">
            <Button type="primary" onClick={handleOpenChangePasswordModal}>Changer de mot de passe</Button>
            <Button type="primary" onClick={handleOpenEditProfileModal}>Modifier le profil</Button>
          </div>
        </div>
      </div>

      <Modal
        title="Modifier le profil"
        visible={editProfileModalVisible}
        onCancel={() => setEditProfileModalVisible(false)}
        footer={null}
      >
        <UpdateProfil afterSave={handleAfterSave} />
      </Modal>
 

      <Modal
        title="Changer le mot de passe"
        visible={changePasswordModalVisible}
        onCancel={handleCloseChangePasswordModal}
        footer={null}
      >
        <Form form={form} onFinish={handleFinishChangePassword} layout="vertical">
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
            <Button type="primary" htmlType="submit">sauvegarder</Button>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default PersonalProfile;
