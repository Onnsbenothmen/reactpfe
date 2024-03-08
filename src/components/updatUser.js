// UpdateUser.js
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './UpdateUser.css'; // Import CSS for styling

const UpdateUser = () => {
  const { id } = useParams();
  const history = useHistory();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    const userData = history.location.state?.user;
    if (userData) {
      setUser(userData);
    } else {
      fetch(`http://127.0.0.1:5000/users/${id}`)
        .then(response => response.json())
        .then(data => {
          setUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          });
        })
        .catch(error => console.error('Error:', error));
    }
  }, [id, history]);

  const handleUpdate = () => {
    fetch(`http://127.0.0.1:5000/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then(response => response.json())
      .then(data => console.log(data.message))
      .catch(error => console.error('Error:', error));
  };

  const handleChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="update-user-container">
      <h2>Update User</h2>
      <form>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <button
          onClick={() => {
            handleUpdate();
            history.push('/UserList');
          }}
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
