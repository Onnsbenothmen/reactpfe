import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Spin, message } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AddAdministrationForm.css'; // Importer des styles personnalisés

const AddAdministrationForm = ({ user, token }) => {
  const [form] = Form.useForm();
  const [instanceName, setInstanceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingInstance, setFetchingInstance] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      setFetchingInstance(true);
      axios.get(`http://localhost:5000/user/${user.id}/inst`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        const nomInstance = response.data.nom_instance;
        if (nomInstance) {
          setInstanceName(nomInstance);
          form.setFieldsValue({ instanceName: nomInstance });
        } else {
          message.error("Le nom de l'instance n'a pas pu être récupéré.");
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du nom de l\'instance:', error);
        message.error("Erreur lors de la récupération du nom de l'instance.");
      })
      .finally(() => {
        setFetchingInstance(false);
      });
    }
  }, [user, form, token]);

  const onFinish = async (values) => {
    if (!user) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: "Utilisateur non défini." });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/addAdministration', {
        ...values,
        user_id: user.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({ icon: 'success', title: 'Succès', text: response.data.message });
      form.resetFields();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'administration:', error);
      Swal.fire({ icon: 'error', title: 'Erreur', text: "Erreur lors de l'ajout de l'administration." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Card title="Ajouter une Administration" bordered={false} style={{ width: '100%' }}>
        {fetchingInstance ? (
          <div className="loading-container">
            <Spin tip="Chargement..." />
          </div>
        ) : (
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="admin-form"
          >
            <Form.Item
              name="admin_name"
              label="Nom de l'administration"
              rules={[{ required: true, message: 'Veuillez entrer le nom de l\'administration' }]}
            >
              <Input placeholder="Entrez le nom de l'administration" />
            </Form.Item>
            <Form.Item
              name="director_email"
              label="Email du directeur"
              rules={[
                { required: true, message: 'Veuillez entrer l\'email du directeur' },
                { type: 'email', message: 'Veuillez entrer un email valide' }
              ]}
            >
              <Input placeholder="Entrez l'email du directeur" />
            </Form.Item>
            <Form.Item
              name="instanceName"
              label="Nom de l'instance"
              initialValue={instanceName}
              hidden
            >
              <Input hidden value={instanceName} readOnly />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="submit-button"
              >
                Enregistrer
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default AddAdministrationForm;
