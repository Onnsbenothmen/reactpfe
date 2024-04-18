import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Switch, message } from 'antd';

const AddInstanceForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/addInstances', values);
      message.success(response.data.message);
    } catch (error) {
      message.error('Une erreur s\'est produite lors de l\'ajout de l\'instance.');
      console.error(error);
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', marginTop: '50px', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Ajouter une nouvelle instance :</h2>
      <Form
        name="basic"
        initialValues={{
          active: true,
          created_at: new Date().toISOString(),
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          label="Email du président"
          name="president_email"
          rules={[{ required: true, message: 'Veuillez entrer l\'email du président!' }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Nom du conseil"
          name="council_name"
          rules={[{ required: true, message: 'Veuillez entrer le nom du conseil!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ville"
          name="ville"
          rules={[{ required: true, message: 'Veuillez sélectionner une ville!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Active"
          name="active"
          valuePropName="checked"
        >
          <Switch defaultChecked />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Ajouter Instance
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddInstanceForm;
