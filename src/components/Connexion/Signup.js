import React, { useState } from 'react';
import { Form, Input, Button, Avatar, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom'; // Importez useParams depuis react-router-dom

const Signup = () => {
  const { newUserId } = useParams(); // Obtenez newUserId à partir des paramètres d'URL
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phoneNumber: '',
    birth_date: '',
    cin: '',
    postal_code: '',
    situation_familiale: '',
    ville: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const defaultAvatarURL = "https://www.flaticon.com/svg/vstatic/svg/6700/6700065.svg?token=exp=1648048685~hmac=7e693618df94908c52ff0e4d3cf27161";
  const [form] = Form.useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleNextStep = () => {
    setFormStep(formStep + 1);
  };

  const handleSignup = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('avatar', avatar);
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('birth_date', formData.birth_date);
    formDataToSend.append('cin', formData.cin);
    formDataToSend.append('postal_code', formData.postal_code);
    formDataToSend.append('situation_familiale', formData.situation_familiale);
    formDataToSend.append('ville', formData.ville);
    formDataToSend.append('linkedin', formData.linkedin);
    formDataToSend.append('lienFacebook', formData.lienFacebook);
    formDataToSend.append('description_profil', formData.description_profil);
    formDataToSend.append('password', password);

    try {
      const response = await fetch(`http://localhost:5000/signup/${newUserId}`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la requête');
      }

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phoneNumber: '',
        birth_date: '',
        cin: '',
        postal_code: '',
        situation_familiale: '',
        ville: '',
        linkedin: '',
        lienFacebook: '',
        description_profil: ''
      });
      setPassword('');
      setFormStep(1);
      message.success('Inscription réussie ! ');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      message.error('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const handleFormChange = (changedValues, allValues) => {
    setFormData(allValues);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', backgroundColor: '#f0f2f5', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1877f2' }}>Créer un compte</h2>
      {formStep === 1 && (
        <Form
          form={form}
          onFinish={handleNextStep}
          onValuesChange={handleFormChange}
          initialValues={formData}
        >
          <Form.Item>
  <input
    type="file"
    onChange={handleFileChange}
    accept="image/*"
    style={{ display: 'none' }}
    id="avatar"
  />
  <label htmlFor="avatar">
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {previewImage ? (
        <img
          src={previewImage}
          alt="Avatar"
          style={{ width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer', marginBottom: '10px' }}
        />
      ) : (
        <Avatar size={100} icon={<UserOutlined />} />
      )}
      <div style={{ textAlign: 'center', color: '#1877f2', cursor: 'pointer' }}>Ajouter une photo</div>
    </div>
  </label>
</Form.Item>

          <Form.Item name="firstName" rules={[{ required: true, message: 'Veuillez entrer votre prénom !' }]}>
            <Input prefix={<UserOutlined />} placeholder="Prénom" />
          </Form.Item>
          <Form.Item name="lastName" rules={[{ required: true, message: 'Veuillez entrer votre nom de famille !' }]}>
            <Input prefix={<UserOutlined />} placeholder="Nom de famille" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Veuillez entrer votre email !' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="address" rules={[{ required: true, message: 'Veuillez entrer votre adresse !' }]}>
            <Input prefix={<UserOutlined />} placeholder="Adresse" />
          </Form.Item>
          <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone !' }]}>
            <Input prefix={<UserOutlined />} placeholder="Numéro de téléphone" />
          </Form.Item>
          <Form.Item name="birth_date" rules={[{ required: true, message: 'Veuillez entrer votre date de naissance !' }]}>
            <Input prefix={<UserOutlined />} placeholder="Date de naissance" />
          </Form.Item>
          <Form.Item name="cin" rules={[{ required: true, message: 'Veuillez entrer votre CIN !' }]}>
            <Input prefix={<UserOutlined />} placeholder="CIN" />
          </Form.Item>
          <Form.Item name="postal_code" rules={[{ required: true, message: 'Veuillez entrer votre code postal !' }]}>
            <Input prefix={<UserOutlined />} placeholder="Code postal" />
          </Form.Item>
          <Form.Item name="situation_familiale" rules={[{ required: true, message: 'Veuillez entrer votre état !' }]}>
            <Input prefix={<UserOutlined />} placeholder="État" />
          </Form.Item>
          <Form.Item name="ville" rules={[{ required: true, message: 'Veuillez entrer votre ville !' }]}>
            <Input prefix={<UserOutlined />} placeholder="Ville" />
          </Form.Item>
          <Form.Item name="linkedin" rules={[{ required: true, message: 'Veuillez entrer votre lien linkedin !' }]}>
            <Input prefix={<UserOutlined />} placeholder="linkedin" />
          </Form.Item>
          <Form.Item name="lienFacebook" rules={[{ required: true, message: 'Veuillez entrer votre lienFacebook !' }]}>
            <Input prefix={<UserOutlined />} placeholder="lienFacebook" />
          </Form.Item>
          <Form.Item name="description_profil" rules={[{ required: true, message: 'Veuillez entrer votre description_profil !' }]}>
            <Input prefix={<UserOutlined />} placeholder="description_profil" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1877f2', borderColor: '#1877f2' }}>
              Continuer
            </Button>
          </Form.Item>
        </Form>
      )}
      {formStep === 2 && (
        <Form onFinish={handleSignup}>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Veuillez entrer votre mot de passe !' },
              { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères !' },
            ]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Mot de passe" value={password} onChange={handlePasswordChange} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Veuillez confirmer votre mot de passe !' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les mots de passe ne correspondent pas !'));
                },
              }),
            ]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={handleConfirmPasswordChange} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1877f2', borderColor: '#1877f2' }}>
              S'inscrire
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default Signup;