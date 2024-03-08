import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Button, Form } from 'antd';
import axios from 'axios';

const SignUp = () => {
  const history = useHistory();
  const [form] = Form.useForm(); // Utiliser Form.useForm pour accéder aux méthodes du formulaire

  const validateEmail = (_, value, callback) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!value) {
      callback('Veuillez entrer votre adresse e-mail !');
    } else if (!emailRegex.test(value)) {
      callback('Format d\'e-mail invalide !');
    } else {
      callback();
    }
  };

  const handleSignUp = async (formValues) => {
    try {
      await axios.post('http://localhost:5000/signup', formValues);
      history.push('/login');
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error.response ? error.response.data.message : 'Erreur inconnue');
    }
  };

  useEffect(() => {
    // Réinitialiser le formulaire après la soumission
    form.resetFields();
  }, [form]);

  return (
    <div>
      <h2>Inscription</h2>
      <Form form={form} onFinish={handleSignUp}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Veuillez entrer votre adresse e-mail !' },
            { validator: validateEmail },
          ]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item label="Prénom" name="firstName" rules={[{ required: true, message: 'Veuillez entrer votre prénom !' }]}>
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Nom de famille" name="lastName" rules={[{ required: true, message: 'Veuillez entrer votre nom de famille !' }]}>
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Mot de passe" name="password" rules={[{ required: true, message: 'Veuillez entrer votre mot de passe !' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">S'inscrire</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUp;
