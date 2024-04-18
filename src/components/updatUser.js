import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Modal, Select } from 'antd'; // Retirez l'importation de Avatar
import AvatarEditor from 'react-avatar-editor';

const { Option } = Select;

const UpdateUser = () => {
  const { id } = useParams();
  const history = useHistory();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role_name: '',
    profile_image: ''
  });
  const [newAvatar, setNewAvatar] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [editor, setEditor] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = history.location.state?.user;
        if (userData) {
          setUser(userData);
        } else {
          const response = await fetch(`http://127.0.0.1:5000/users/${id}`);
          const userData = await response.json();
          setUser({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role_name: userData.role_name,
            profile_image: userData.profile_image
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchUser();

    // Fetch roles
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/roles');
        const data = await response.json();
        setRoles(data.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchRoles();
  }, [id, history]);

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    formData.append('role_name', user.role_name);
    // Ajoutez la nouvelle image si elle existe
    if (newAvatar) {
      formData.append('file', newAvatar);
    }
    fetch(`http://127.0.0.1:5000/users/${id}`, {
      method: 'PUT',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        // Mettez à jour l'image de profil dans la liste avec la nouvelle image
        setUser(prevUser => ({
          ...prevUser,
          profile_image: data.profile_image
        }));
        history.push('/UserList');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleChange = value => {
    setUser(prevUser => ({
      ...prevUser,
      role_name: value
    }));
  };

  const handleAvatarClick = () => {
    setIsModalVisible(true);
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    setNewAvatar(file);
    setIsModalVisible(true);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    if (editor && newAvatar) {
      const canvas = editor.getImage();
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        setPreviewImage(url);
        setUser(prevUser => ({
          ...prevUser,
          profile_image: url
        }));
      }, 'image/png');
    }
  };

  return (
    <div className="update-user-container">
      <h2>Update User</h2>
      {/* Retirez la partie Avatar */}
      <br />
      <br />
      <form>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={e => setUser({ ...user, firstName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={e => setUser({ ...user, lastName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            name="email"
            value={user.email}
            onChange={e => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="role_name">Role:</label>
          <Select
            id="role_name"
            name="role_name"
            value={user.role_name}
            onChange={handleChange}
          >
            {roles.map(role => (
              <Option key={role.id} value={role.name}>
                {role.name}
              </Option>
            ))}
          </Select>
        </div>
        <Button type="primary" onClick={handleUpdate}>
          Update User
        </Button>
      </form>
      <Modal
        title="Choose a new profile photo"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        {newAvatar && (
          <AvatarEditor
            ref={setEditor}
            image={previewImage}
            width={200}
            height={200}
            border={50}
            borderRadius={100}
            color={[255, 255, 255, 0.6]}
            scale={1}
            rotate={0}
          />
        )}
      </Modal>
    </div>
  );
};

export default UpdateUser;
