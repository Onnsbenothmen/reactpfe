import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { Avatar, Button, Card, message, Form, Input, Typography, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UpdateProfil = () => {
  const location = useLocation();
  const history = useHistory();
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(true);
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }
    setCurrentImageUrl(user?.profile_image || null);
  }, [user, history]);

  const handleSave = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`http://localhost:5000/update_profile/${user.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        if (image) {
          setCurrentImageUrl(URL.createObjectURL(image));
        }
        message.success('Profil mis à jour avec succès !');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Une erreur s\'est produite lors de la mise à jour du profil.');
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);

    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', backgroundColor: '#f0f2f5', borderRadius: '100px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
      {user ? (
        <Card bordered={false} style={{ borderRadius: '8px', padding: '24px' }}>
                  <Title level={3} style={{ textAlign: 'center', color: '#006bbd' }}>Mettre à jour le profil</Title>

          <div className='profile-info'>
            <div className='avatar-container' style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <input type='file' accept='image/*' onChange={handleImageChange} style={{ display: 'none' }} id="profile-image-input" />
              <label htmlFor="profile-image-input">
                <div className="preview-image-container" style={{ cursor: 'pointer' }}>
                  {previewImage || user.profile_image ? (
                    <img 
                      src={previewImage || `http://127.0.0.1:5000/static/uploads/${user.profile_image}`} 
                      alt="Preview" 
                      className='preview-image' 
                      style={{ width: '120px', height: '120px', borderRadius: '50%', border: '2px solid #1890ff' }}
                    />                
                  ) : (
                    <Avatar size={120} icon={<UserOutlined />} className='profile-avatar' />
                  )}
                </div>
              </label>
            </div>
            <Form layout="vertical" onFinish={handleSave} initialValues={user}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Prénom" name="firstName" rules={[{ required: true, message: 'Veuillez entrer votre prénom!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Nom" name="lastName" rules={[{ required: true, message: 'Veuillez entrer votre nom!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Numéro de téléphone" name="phoneNumber" rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Adresse" name="address" rules={[{ required: true, message: 'Veuillez entrer votre adresse!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Date de naissance" name="birth_date" rules={[{ required: true, message: 'Veuillez entrer votre date de naissance!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="CIN" name="cin" rules={[{ required: true, message: 'Veuillez entrer votre CIN!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Situation familiale" name="situation_familiale" rules={[{ required: true, message: 'Veuillez entrer votre situation familiale!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Ville" name="ville" rules={[{ required: true, message: 'Veuillez entrer votre ville!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="LinkedIn" name="linkedin">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Lien Facebook" name="lienFacebook">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item style={{ textAlign: 'center' }}>
                <Button type="primary" htmlType="submit" style={{ width: '100%', background:'#006bbd'}}>Sauvegarder</Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default UpdateProfil;