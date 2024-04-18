import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext'; 
import { Form, Input, Button, Card, Avatar, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import './Profil.css'; // Importer le fichier CSS pour les styles

const Profile = () => {
  const location = useLocation();
  const history = useHistory();
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [image, setImage] = useState(null); // State pour stocker l'image sélectionnée

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }
  }, [user, history]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async (values) => {
    try {
      const formData = new FormData();
      // Ajouter les valeurs du formulaire à FormData
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      // Ajouter l'image sélectionnée à FormData
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`http://localhost:5000/update_profile/${user.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser); // Mettre à jour l'utilisateur dans le contexte d'authentification
        message.success('Profil mis à jour avec succès !');
        setEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Une erreur s\'est produite lors de la mise à jour du profil.');
    }
  };

  const handleImageChange = (event) => {
    // Récupérer l'image sélectionnée
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  return (
    <div className='profile-container'>
      {user ? (
        <Card className='profile-card' title="Profil de l'utilisateur">
          <div className='profile-info'>
            <Avatar size={120} icon={<UserOutlined />} className='profile-avatar' />
            <div className='profile-details'>
              {/* Afficher l'image sélectionnée */}
              {image && <img src={URL.createObjectURL(image)} alt='profile' className='profile-image' />}
              {/* Afficher les informations utilisateur */}
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Nom:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Rôle:</strong> {user.role}</p>
              {/* Bouton pour modifier le profil */}
              {!editing ? (
                <Button type='primary' onClick={handleEdit} className='edit-profile-btn'>Modifier le Profil</Button>
              ) : (
                // Formulaire pour modifier les informations utilisateur
                <Form onFinish={handleSave} layout='vertical' initialValues={user}>
                  <Form.Item label='Prénom' name='firstName'>
                    <Input />
                  </Form.Item>
                  <Form.Item label='Nom' name='lastName'>
                    <Input />
                  </Form.Item>
                  <Form.Item label='Numéro de téléphone' name='phoneNumber'>
                    <Input />
                  </Form.Item>
                  <Form.Item label='Adresse' name='address'>
                    <Input />
                  </Form.Item>
                  <Form.Item label='Image de profil' name='image'>
                    <input type='file' accept='image/*' onChange={handleImageChange} />
                  </Form.Item>
                  <Form.Item>
                    <Button type='primary' htmlType='submit'>Sauvegarder</Button>
                  </Form.Item>
                </Form>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default Profile;
