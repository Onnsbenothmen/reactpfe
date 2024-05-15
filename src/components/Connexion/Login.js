import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { Button, Form, Input, Typography, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const Login = () => {
  const history = useHistory();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/login', values);
      const { token, profile, is_archived } = response.data;

      if (is_archived === 'true') {
        message.error('Votre compte est archivé. Veuillez contacter l\'administrateur.');
        setLoading(false);
        return;
      }

      login(profile, token);
      if (profile.role === 'président') {
        history.push('/president_dashboard');
      } else if(profile.role === 'super admin') {
        history.push('/superAdmin_dashboard');
      } else if(profile.role === 'conseiller') {
        history.push('/conseille');
      } else {
        console.error('Role non géré:', profile.role);
      }
    } catch (error) {
      if (error.response && error.response.data.message === "Your account is archived. Please contact the administrator.") {
        message.error('Votre compte est archivé. Veuillez contacter l\'administrateur.');
      } else {
        message.error('Email ou mot de passe incorrect.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Connexion</Title>
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Veuillez saisir votre email' }]}>
              <Input type="email" />
            </Form.Item>
            <Form.Item label="Mot de passe" name="password" rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', height: '50px', fontSize: '18px' }}>Se connecter</Button>
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              <Link to="/forgot_password">Mot de passe oublié ?</Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
