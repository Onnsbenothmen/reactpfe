import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const { Title } = Typography;

const PasswordForm = () => {
  const { newUserId } = useParams(); // Récupérer l'ID de l'utilisateur depuis l'URL
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (values) => {
    try {
      if (values.password !== values.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur!',
          text: 'Les mots de passe ne correspondent pas.',
        });
        return;
      }

      const response = await axios.post(`http://127.0.0.1:5000/add_password/${newUserId}`, {
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Inscription réussie !',
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000); // Rediriger vers la page de connexion après 2 secondes
      } else {
        throw new Error('Erreur lors de l\'enregistrement du mot de passe');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du mot de passe:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: 'Erreur lors de l\'enregistrement du mot de passe. Veuillez réessayer.',
      });
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
      <div style={{ maxWidth: '400px', width: '100%', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', color: '#006bbd' }}>Créez votre mot de passe</Title>
        <Form onFinish={handleSubmit} initialValues={formData}>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe !' }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Mot de passe" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Veuillez confirmer votre mot de passe !' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les mots de passe ne correspondent pas !'));
                },
              }),
            ]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Confirmer le mot de passe" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#006bbd', borderColor: '#006bbd', width: '100%' }}>
              Enregistrer le mot de passe
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PasswordForm;
