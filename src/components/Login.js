import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { Button, Form, Input, Typography, message } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const Login = () => {
  const history = useHistory();
  const { login } = useAuth(); // Utilisation de la fonction de connexion fournie par le contexte d'authentification
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/login', values);
      const { token, profile } = response.data;
      
      // Utilisation de la fonction de connexion pour mettre à jour l'utilisateur connecté
      login(profile, token);

      // Redirection vers la page du tableau de bord après la connexion
      if (profile.role === 'président') {
        history.push('/president_dashboard');
      } else {
        history.push('/admin_dashboard');
      }
    } catch (error) {
      message.error('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '400px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
      }}>
        <Title level={2}>Connexion</Title>
        <Form onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Veuillez saisir votre email' }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Mot de passe"
            name="password"
            rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Se connecter
            </Button>
          </Form.Item>
        </Form>
        <Text>
          Vous n'avez pas de compte ?{' '}
          <Link to="/signup">Inscrivez-vous ici</Link>
        </Text>
      </div>
    </div>
  );
};

export default Login;
