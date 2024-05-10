import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext'; 
import { Avatar, Button, Card, message, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './UpdateProfil.css'; 

const UpdateProfil = () => {
  const location = useLocation();
  const history = useHistory();
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(true);
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }
    setCurrentImageUrl(user?.profile_image || null);
  }, [user, history]);

  const handleSave = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`http://localhost:5000/update_profile/${user.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        message.success('Profil mis à jour avec succès !');
        setCurrentImageUrl(URL.createObjectURL(image));
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
    const selectedImage = event.target.files[0];
    setImage(selectedImage);

    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleImageClick = () => {
    if (previewImage) {
      window.open(previewImage, '_blank');
    } else if (user && user.profile_image) {
      window.open(`http://127.0.0.1:5000/static/uploads/${user.profile_image}`, '_blank');
    }
  };

  return (
    <div className='profile-container'>
      {user ? (
        <Card className='profile-card' title="Profil de l'utilisateur">
          <div className='profile-info'>
            <div className='avatar-container'>
              <input type='file' accept='image/*' onChange={handleImageChange} />
              <div className="preview-image-container" onClick={handleImageClick}>
                {previewImage || user.profile_image ? (
                  <img src={previewImage || `http://127.0.0.1:5000/static/uploads/${user.profile_image}`} alt="Preview" className='preview-image' />
                ) : (
                  <Avatar size={120} icon={<UserOutlined />} className='profile-avatar' />
                )}
              </div>
            </div>
            {editing && (
              <Form layout="vertical" onFinish={handleSave} initialValues={user}>
                <Form.Item label="Prénom" name="firstName">
                  <Input />
                </Form.Item>
                <Form.Item label="Nom" name="lastName">
                  <Input />
                </Form.Item>
                <Form.Item label="Numéro de téléphone" name="phoneNumber">
                  <Input />
                </Form.Item>
                <Form.Item label="Adresse" name="address">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Sauvegarder</Button>
                </Form.Item>
              </Form>
            )}
            {!editing && (
              <Button type='primary' onClick={() => setEditing(true)} className='edit-profile-btn'>Modifier le Profil</Button>
            )}
          </div>
        </Card>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default UpdateProfil;
