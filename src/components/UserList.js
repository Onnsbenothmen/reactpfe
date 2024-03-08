import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Table, Typography } from 'antd';
import axios from 'axios';

const { Text } = Typography;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/users')
      .then(response => response.json())
      .then(data => setUsers(data.data));
  }, []);

  const handleDelete = (userId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this user?');

    if (!isConfirmed) {
      return;
    }

    fetch(`http://127.0.0.1:5000/users/${userId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => console.error('Error:', error));
  };

  const handleUpdate = (user) => {
    history.push(`/update/${user.id}`, { user });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, user) => (
        <span>
          <Button type="primary" onClick={() => handleUpdate(user)}>
            Update
          </Button>
          <Button type="danger" onClick={() => handleDelete(user.id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const paginationConfig = {
    pageSize: 2,
    showSizeChanger: false,
  };

  return (
    <div>
      <h2>User List</h2>
      <Table dataSource={users} columns={columns} rowKey="id" pagination={paginationConfig} />
    </div>
  );
};

export default UserList;
