import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const AddCounselorsForm = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState(['']);
  const [instanceName, setInstanceName] = useState('');
  const [nbConseillers, setNbConseillers] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    // Récupérer le nombre de conseillers depuis Flask
    axios.get(`http://localhost:5000/user/${user.id}/conseillers`)
      .then(response => {
        const nbConseillers = response.data.nb_conseillers;
        setNbConseillers(nbConseillers);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du nombre de conseillers:', error);
      });

    // Récupérer le nom de l'instance depuis Flask
    axios.get(`http://localhost:5000/user/${user.id}/inst`)
      .then(response => {
        const nomInstance = response.data.nom_instance;
        console.log('Nom de l\'instance récupéré:', nomInstance);  // Log the instance name
        if (nomInstance) {
          setInstanceName(nomInstance);
          // Mettre à jour le champ du formulaire
          form.setFieldsValue({ instanceName: nomInstance });
        } else {
          message.error("Le nom de l'instance n'a pas pu être récupéré.");
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du nom de l\'instance:', error);
        message.error("Erreur lors de la récupération du nom de l'instance.");
      });
  }, [user, form]);

  const onFinish = async () => {
    setLoading(true);
    try {
      const counselors = emails.map(email => ({
        email,
        instanceName, // Utilisation de instanceName ici
      }));
  
      const response = await axios.post(
        'http://localhost:5000/addConseille',
        { user_id: user.id, counselors },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      message.success(response.data.message);
    } catch (error) {
      message.error("Erreur lors de l'ajout des conseillers.");
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
    if (emails.length < nbConseillers) { // Vérification avec le nombre maximum de conseillers
      setEmails([...emails, '']); // Ajout d'un champ vide
    } else {
      message.error("Vous avez atteint le nombre maximum de conseillers.");
    }
  };

  return (
    <Form
      form={form}
      name="addCounselors"
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="Nom de l'instance"
        name="instanceName"
        rules={[
          { required: true, message: 'Veuillez saisir le nom de l\'instance.' },
        ]}
      >
        <Input
          value={instanceName}
          disabled
        />
      </Form.Item>

      {emails.map((email, index) => (
        <div key={index}>
          <Form.Item
            label={index === 0 ? "E-mail du conseiller" : `E-mail du conseiller ${index + 1}`}
            name={`email${index + 1}`}
            rules={[
              { required: true, message: `Veuillez saisir l'e-mail du conseiller ${index + 1}.` },
              { type: 'email', message: `Veuillez saisir une adresse e-mail valide pour le conseiller ${index + 1}.` },
            ]}
          >
            <Input
              value={email}
              onChange={(event) => handleEmailChange(index, event)}
            />
          </Form.Item>
        </div>
      ))}

      <Form.Item>
        <Button type="primary" onClick={handleAddEmailField}>
          Ajouter un champ e-mail
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Ajouter les conseillers
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddCounselorsForm;
