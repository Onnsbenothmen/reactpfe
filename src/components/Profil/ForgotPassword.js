import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const ForgotPassword = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const onFinishForgotPassword = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/forgot_password', values);
      message.success('Un code de vérification a été envoyé à votre adresse e-mail.');
      history.push('/ResetPassword');
    } catch (error) {
      message.error('Une erreur s\'est produite. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.push('/login'); // Rediriger vers la page de connexion
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5' }} className="min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="mt-4 mb-3 text-center" style={{ fontFamily: 'Arial, sans-serif', fontSize: '24px', fontWeight: 'bold' }}>
                {showLoginForm ? 'Réinitialiser le mot de passe' : 'Connexion'}
              </h2>
              <br />
         
                <>
                  <h4 style={{ fontFamily: 'serif', fontSize: '15px', fontWeight: 'bold' }}>
                    Veuillez entrer votre e-mail pour rechercher votre compte.
                  </h4>
                  <Form onFinish={onFinishForgotPassword}>
                    <Form.Item
                      label="Adresse e-mail"
                      name="email"
                      rules={[{ required: true, message: 'Veuillez saisir votre adresse e-mail' }]}
                    >
                      <Input type="email" />
                    </Form.Item>
                    <Form.Item className="text-center">
                      <Button type="primary" htmlType="submit" loading={loading} className="mr-2">
                        Envoyer le code de vérification
                      </Button>
                      <Button onClick={handleCancel} >
                        Annuler
                      </Button>
                    </Form.Item>
                  </Form>
                </>
          
         
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
