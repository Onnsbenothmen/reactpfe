import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Avatar, Typography } from 'antd';
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const SignupConseille = () => {
  const { newUserId } = useParams();
  const [previewImage, setPreviewImage] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const history = useHistory();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values) => {
    try {
      const data = new FormData();
      data.append('firstName', values.firstName);
      data.append('lastName', values.lastName);
      data.append('email', values.email);
      data.append('address', values.address);
      data.append('phoneNumber', values.phoneNumber);
      if (values.avatar && values.avatar.file) {
        data.append('avatar', values.avatar.file);
      }

      const response = await axios.post(`http://127.0.0.1:5000/register/${newUserId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setIsRegistered(true);
        setTimeout(() => {
          history.push(`/add_password/${newUserId}`);
        }, 1000);
      } else {
        throw new Error('Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/aa.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div style={{ maxWidth: '500px', width: '100%', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', color: '#006bbd', marginBottom: '20px' }}>Créer un compte</Title>

        {!isRegistered ? (
          <Form onFinish={handleSubmit} layout="vertical">
            <Form.Item name="avatar">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar"
              />
              <label htmlFor="avatar">
                <Avatar size={100} icon={<UserOutlined />} src={previewImage} style={{ cursor: 'pointer' }} />
              </label>
            </Form.Item>
            <Form.Item name="firstName" rules={[{ required: true, message: 'Veuillez entrer votre prénom !' }]}>
              <Input prefix={<UserOutlined />} placeholder="Prénom" />
            </Form.Item>
            <Form.Item name="lastName" rules={[{ required: true, message: 'Veuillez entrer votre nom de famille !' }]}>
              <Input prefix={<UserOutlined />} placeholder="Nom de famille" />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, message: 'Veuillez entrer votre email !' }]}>
              <Input prefix={<UserOutlined />} type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item name="address" rules={[{ required: true, message: 'Veuillez entrer votre adresse !' }]}>
              <Input prefix={<UserOutlined />} placeholder="Adresse" />
            </Form.Item>
            <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone !' }]}>
              <Input prefix={<UserOutlined />} placeholder="Numéro de téléphone" />
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#006bbd', borderColor: '#006bbd', width: '100%' }}>
                S'inscrire
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div style={{ textAlign: 'center', fontSize: '100px', color: '#52c41a' }}>
            <CheckCircleOutlined />
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupConseille;
