import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Select ,Row, Col } from 'antd';
import axios from 'axios';
import './AjoutReunion.css';
import Swal from 'sweetalert2';


const { Option } = Select;

const AjoutReunion = () => {
  const [form] = Form.useForm();
  const [message, setMessage] = useState('');
  const [typeReunion, setTypeReunion] = useState('');
  const [conseillers, setConseillers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/conseillersReunionsEmails')
      .then(response => {
        setConseillers(response.data);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des conseillers :', error);
      });
  }, []);

  const onFinish = (values) => {
    axios.post('http://localhost:5000/reunions', values)
      .then(response => {
        console.log(response.data);
        Swal.fire({
          title: 'Succès',
          text: 'Réunion ajoutée avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        });
                form.resetFields();
        setTypeReunion('');
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout de la réunion :', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Erreur lors de l\'ajout de la réunion',
          icon: 'error',
          confirmButtonText: 'OK'
        });
              });
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Validation failed:', errorInfo);
  };

  return (
    <div > {/* Centrage du formulaire */}
<h2 className="titre-liste"  style={{ 
  textAlign: 'center', 
  color: '#2B6CC4', 
  fontFamily: 'Arial, sans-serif', 
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
  margin: '20px 0', 
  padding: '10px 0' 
}}>Ajouter une réunion</h2>      {message && <p style={{ textAlign: 'center', color: 'red' }}>{message}</p>}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }} // Conteneur du formulaire
      >
        <Form.Item
          label="Type de réunion"
          name="type_reunion"
          rules={[{ required: true, message: 'Veuillez sélectionner le type de réunion' }]}
        >
          <Radio.Group onChange={(e) => setTypeReunion(e.target.value)}>
            <Radio value="presentielle">Présentielle</Radio>
            <Radio value="meet">Meet</Radio>
          </Radio.Group>
        </Form.Item>
        {typeReunion && (
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Veuillez sélectionner la date de la réunion' }]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              label="Heure"
              name="heure"
              rules={[{ required: true, message: 'Veuillez sélectionner l\'heure de la réunion' }]}
            >
              <Input type="time" />
            </Form.Item>
            {typeReunion === 'presentielle' && (
              <Form.Item
                label="Lieu"
                name="lieu"
                rules={[{ required: true, message: 'Veuillez saisir le lieu de la réunion' }]}
              >
                <Input />
              </Form.Item>
            )}
            {typeReunion === 'meet' && (
              <Form.Item
                label="Lien Meet"
                name="lien_meet"
                rules={[{ required: true, message: 'Veuillez saisir le lien Meet de la réunion' }]}
              >
                <Input />
              </Form.Item>
            )}
            </Col>
            <Col span={12}>
                        

            <Form.Item
              label="Ordre du jour"
              name="ordre_du_jour"
              rules={[{ required: true, message: 'Veuillez saisir l\'ordre du jour de la réunion' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Participants"
              name="participants"
              rules={[{ required: true, message: 'Veuillez sélectionner les participants' }]}
            >
              <Select mode="multiple" placeholder="Sélectionnez les participants">
                {conseillers.map(email => (
                  <Option key={email} value={email}>{email}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
            <Row justify="center"> {/* Centrage du bouton */}
            <Col>

            <Button
  type="primary"
  htmlType="submit"
  style={{ backgroundColor: "#006bbd", borderColor: "#006bbd" }}
>
  Ajouter la réunion
</Button>
              </Col>
                </Row>
            </Form.Item>
            </Col>
          </Row>
        
        )}
      </Form>
    </div>
  );
};

export default AjoutReunion;
