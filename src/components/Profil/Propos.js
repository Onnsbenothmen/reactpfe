import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import axios from 'axios';
import { Layout, Typography, Button, Modal, Form, Input, message ,Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import './PersonalProfile.css'; // Importez votre fichier CSS pour les styles personnalisés
import UpdateProfile from './UpdateProfil';

import LinkedinImage from '../../assets/linkedin.png'
import facebookImage from '../../assets/facebook.png'



const { Content } = Layout;
const { Title, Text } = Typography;

const PersonalProfile = () => {
  const history = useHistory();
  const { user, setUser } = useAuth();
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [instanceName, setInstanceName] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    if (user && user.id) {
      axios.get(`http://127.0.0.1:5000/user/${user.id}/instance_name`)
        .then(response => {
          if (response.data && response.data.nom_instance) {
            setInstanceName(response.data.nom_instance);
          } else {
            message.error("Le nom de l'instance n'a pas pu être récupéré.");
          }
        })
        .catch(error => {
          message.error("Erreur lors de la récupération du nom de l'instance.");
          console.error(error);
        });
    }
  }, [user]);

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
    handleCloseEditProfileModal();
  };

  return (
    <Layout >
      <Content style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100vh' }} >
        <div className="profile-container">
          <div className="avatar-info-container">
            <div className="avatar-container">
              <img className="avatar-round" src={user.profile_image ? `http://127.0.0.1:5000/static/uploads/${user.profile_image}` : null} alt="Avatar" />
              <div className="counter">
    </div>
    <div >
        
   
      </div> 
            </div> 
          </div>
          
          


   
  


          <div className="about-text go-to"><div>
            
          <Title className="dark-color" style={{ display: 'flex', alignItems: 'center' }}>
  <div>
    {user.firstName}
    <span style={{ marginLeft: '1cm' }}>{user.lastName}</span>
  </div>
  <div style={{ flexGrow: 1 }}></div> 
  <div>
    <img 
      style={{ marginRight: '20px' }} 
      src={facebookImage} 
      alt="Facebook" 
      className="social-icon" 
    />
    <img 
      src={LinkedinImage} 
      alt="LinkedIn" 
      className="social-icon" 
    />
  </div>
</Title>



          <div className="social-icons">
              
              </div>
          
  <h2 className="theme-color lead" style={{ marginRight: '400px' }}>  <p>{user.description_profil}</p>
 </h2>
  

</div>
  <div className="row about-list">

    <div className="col-lg-6">
      
    <div class="info-item">

  <span class="info-label">Prénom :</span>
  <span class="info-value">{user.firstName}</span>
</div>

      <div className="info-item">
        <span className="info-label">Nom:</span>
        <span className="info-value">{user.lastName}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Situation familiale:</span>
        <span className="info-value">{user.situation_familiale}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Email:</span>
        <span className="info-value">{user.email}</span>
      </div>
    </div>
    <div className="col-lg-6">
      
      <div className="info-item">
        <span className="info-label" >Téléphone:</span>
        <span className="info-value">{user.phoneNumber}</span>
      </div>
      <div className="info-item">
  <span className="info-label">DateDeNaissance:</span>
  <span className="info-value">{new Date(user.birth_date).toLocaleDateString()}</span>
</div>
<div className="info-item">
  <span className="info-label">membreDepuis:</span>
  <span className="info-value">{new Date(user.created_at).toLocaleDateString()}</span>
</div>


      <div className="info-item">
        <span className="info-label">Ville:</span>
        <span className="info-value">{user.ville}</span>
      </div>
    </div>
  </div>
  <div className="action-buttons" >
  <Button type="primary" onClick={handleOpenChangePasswordModal} style={{ marginRight: '400px' , background:'#006bbd'}}>Changer mot de passe</Button>
    <Button type="primary" onClick={handleOpenEditProfileModal} style={{ background:'#006bbd'}} >Modifier le profil</Button>
</div>
          </div>
          
        </div>
       

       
      </Content>
  

      <Modal

      visible={editProfileModalVisible}
      onCancel={handleCloseEditProfileModal}
      footer={null}
      width={900} // Adjust the width as needed
    >

      <UpdateProfile afterSave={handleAfterSave} />
    </Modal>

    <Modal
      title={<span style={{ color: '#006bbd', textAlign: 'center', width: '100%', display: 'block', fontSize: '24px' }}>Modifier votre mot de passe</span>}
      centered
      visible={changePasswordModalVisible}
      onCancel={handleCloseChangePasswordModal}
      footer={null}
    >
      <Form form={form} onFinish={handleFinishChangePassword} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Mot de passe actuel"
              name="currentPassword"
              rules={[{ required: true, message: 'Veuillez saisir votre mot de passe actuel' }]}
            >
              <Input.Password style={{ borderColor: '#006bbd', borderRadius: '5px' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Nouveau mot de passe"
              name="newPassword"
              rules={[
                { required: true, message: 'Veuillez saisir votre nouveau mot de passe' },
                { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' },
                { pattern: /^(?=.*[0-9])(?=.*[A-Z]).+$/, message: 'Le mot de passe doit contenir au moins un chiffre et une lettre majuscule' },
              ]}
            >
              <Input.Password style={{ borderColor: '#006bbd', borderRadius: '5px' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
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
              <Input.Password style={{ borderColor: '#006bbd', borderRadius: '5px' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#006bbd', borderColor: '#006bbd' }}>
                Changer le mot de passe
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
    </Layout>
  );
};

export default PersonalProfile;