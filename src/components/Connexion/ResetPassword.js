import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const ResetPassword = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/ResetPassword', values);
      message.success(response.data.message);
      history.push('/login'); // Rediriger vers la page de connexion après la réinitialisation du mot de passe
    } catch (error) {
      message.error(error.response.data.error || 'Une erreur s\'est produite lors de la réinitialisation du mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#f0f2f5' }}>
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}><br></br>
        <h1 className="mb-4 text-center" style={{ fontFamily: 'Arial, serif', fontSize: '24px', fontWeight: 'bold'}} >Réinitialiser le mot de passe</h1>
        <br></br>
        <Form
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Veuillez saisir votre adresse e-mail.' }]}
          >
            <Input placeholder="Adresse e-mail" />
          </Form.Item>
          <Form.Item
            name="verification_code"
            rules={[{ required: true, message: 'Veuillez saisir le code de vérification.' }]}
          >
            <Input placeholder="Code de vérification" />
          </Form.Item>
          <Form.Item
            name="new_password"
            rules={[{ required: true, message: 'Veuillez saisir votre nouveau mot de passe.' }]}
          >
            <Input.Password placeholder="Nouveau mot de passe" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-100">
              Réinitialiser le mot de passe
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
