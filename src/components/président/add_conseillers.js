import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined, MailOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddCounselorsForm = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState(['']);
  const [instanceName, setInstanceName] = useState('');
  const [nbConseillers, setNbConseillers] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    axios.get(`http://localhost:5000/user/${user.id}/conseillers`)
      .then(response => {
        const nbConseillers = response.data.nb_conseillers;
        setNbConseillers(nbConseillers);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du nombre de conseillers:', error);
      });

    axios.get(`http://localhost:5000/user/${user.id}/inst`)
      .then(response => {
        const nomInstance = response.data.nom_instance;
        if (nomInstance) {
          setInstanceName(nomInstance);
          form.setFieldsValue({ instanceName: nomInstance });
        } else {
          Swal.fire({ icon: 'error', title: "Erreur", text: "Le nom de l'instance n'a pas pu être récupéré." });
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du nom de l\'instance:', error);
        Swal.fire({ icon: 'error', title: "Erreur", text: "Erreur lors de la récupération du nom de l'instance." });
      });
  }, [user, form]);

  const onFinish = async () => {
    setLoading(true);
    try {
      const counselors = emails.map(email => ({ email, instanceName }));
  
      const response = await axios.post(
        'http://localhost:5000/addConseille',
        { user_id: user.id, counselors },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      Swal.fire({ icon: 'success', title: 'Succès', text: response.data.message });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: "Erreur lors de l'ajout des conseillers." });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (index, event) => {
    const newEmails = [...emails];
    newEmails[index] = event.target.value;
    setEmails(newEmails);
  };

  const handleAddEmailField = () => {
    if (emails.length < nbConseillers) {
      setEmails([...emails, '']);
    } else {
      Swal.fire({ icon: 'error', title: 'Erreur', text: "Vous avez atteint le nombre maximum de conseillers." });
    }
  };

  const handleRemoveEmailField = (index) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: ' auto' }}>
      <h1 style={{ color: '#4A90E2', fontFamily: 'Arial, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.2)', margin: '10px 40px', padding: '10px 10px 10px 10px' }}>Ajouter des conseillers</h1>
      <Form form={form} name="addCounselors" layout="vertical" onFinish={onFinish}>
        <Form.Item hidden name="instanceName" rules={[{ required: true, message: 'Veuillez saisir le nom de l\'instance.' }]}>
          <Input hidden value={instanceName} disabled />
        </Form.Item>
        {emails.map((email, index) => (
          <Row key={index} gutter={[16, 16]} style={{ marginBottom: '16px' }}>
            <Col span={16}>
              <Form.Item
                label={index === 0 ? "E-mail du conseiller" : `E-mail du conseiller ${index + 1}`}
                name={`email${index + 1}`}
                rules={[
                  { required: true, message: `Veuillez saisir l'e-mail du conseiller ${index + 1}.` },
                  { type: 'email', message: `Veuillez saisir une adresse e-mail valide pour le conseiller ${index + 1}.` },
                ]}
              >
                <Input prefix={<MailOutlined />} value={email} onChange={(event) => handleEmailChange(index, event)} />
              </Form.Item>
            </Col>
            <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {index === emails.length - 1 &&
                <Button type="link" icon={<PlusOutlined />} onClick={handleAddEmailField} />
              }
              {index > 0 &&
                <Button type="link" icon={<MinusOutlined />} onClick={() => handleRemoveEmailField(index)} />
              }
            </Col>
          </Row>
        ))}
        <Form.Item style={{ textAlign: 'center', marginTop: '10px' }} >
        <Button
  type="primary"
  htmlType="submit"
  loading={loading}
  icon={<UsergroupAddOutlined />}
  style={{ backgroundColor: '#006bbd', borderColor: '#006bbd' }}
>
  Ajouter
</Button>

</Form.Item>
</Form>
</div>
);
};

export default AddCounselorsForm;