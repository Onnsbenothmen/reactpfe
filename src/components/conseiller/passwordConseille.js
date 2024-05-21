import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

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
        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: 'Succès!',
            text: 'Inscription réussie !',
          });
        }, 2000); // Le délai est de 2000 millisecondes, soit 2 secondes
        // Rediriger vers la page de connexion après un délai
        setTimeout(() => {
          window.location.href = '/login';
        }, 4000); // Redirige après 4 secondes
      }
      
       else {
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
    <Form onFinish={handleSubmit} initialValues={formData}>
      <Form.Item name="password" rules={[{ required: true, message: 'Veuillez entrer votre mot de passe !' }]}>
        <Input prefix={<LockOutlined />} type="password" placeholder="Mot de passe" />
      </Form.Item>
      <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Veuillez confirmer votre mot de passe !' }]}>
        <Input prefix={<LockOutlined />} type="password" placeholder="Confirmer le mot de passe" />
      </Form.Item>
      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1877f2', borderColor: '#1877f2' }}>
          Enregistrer le mot de passe
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PasswordForm;
