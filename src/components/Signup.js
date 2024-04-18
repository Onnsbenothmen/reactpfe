import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Avatar, Modal, Alert } from 'antd';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const SignUp = () => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [errorAlertVisible, setErrorAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Récupération des rôles depuis l'API Flask lors du chargement du composant
    axios.get('http://localhost:5000/roles')
      .then(response => {
        setRoles(response.data.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des rôles:', error);
        message.error('Erreur lors de la récupération des rôles');
      });
  }, []);

  const handleSignUp = async (values) => {
    try {
      const formData = new FormData();
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('role', values.role);

      const response = await axios.post('http://localhost:5000/signup', formData);

      if (response.status === 200) {
        setErrorAlertVisible(true);
        setErrorMessage("Échec de l'inscription. Veuillez réessayer.");
      } else {
        message.success('Inscription réussie');
        alert('Inscription réussie');
      }
    } catch (error) {
      if (error.response.status === 409) {
        setErrorAlertVisible(true);
        setErrorMessage("Cet email est déjà utilisé. Veuillez utiliser une autre adresse email.");
      } else {
        setErrorAlertVisible(true);
        setErrorMessage("Une erreur s'est produite lors de l'inscription. Veuillez réessayer plus tard.");
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#e6f7ff' }}>
      <div style={{ width: '400px', padding: '20px', border: '2px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Sign Up</h2>
        <Form form={form} onFinish={handleSignUp}>
          <Form.Item name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
            <Input prefix={<UserOutlined />} placeholder="First Name" />
          </Form.Item>
          <Form.Item name="lastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Last Name" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="role" rules={[{ required: true, message: 'Please select your role!' }]}>
            <Select placeholder="Select a role">
              {roles.map(role => (
                <Option key={role.id} value={role.name}>{role.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {errorAlertVisible && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => setErrorAlertVisible(false)}
            style={{ marginBottom: '10px' }}
          />
        )}
      </div>
    </div>
  );
};

export default SignUp;
