import React, { useState, useEffect } from 'react';
import { Layout, Button, Menu } from 'antd'; // Importez Menu de 'antd'
import { DashboardOutlined, UserOutlined } from '@ant-design/icons'; // Importez UserOutlined de '@ant-design/icons'
import { useHistory } from 'react-router-dom';
import InstanceList from '../Instance/InstanceList';
import UserList from './UserList'; // Importez le composant UserList
import axios from 'axios';
import RolesList from './Role/roleList';
import AddInstanceForm from '../Instance/InstanceCreationForm';
import SignUp from './Signup';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const history = useHistory();
  const [userRole, setUserRole] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const [showInstanceList, setShowInstanceList] = useState(true);
  const [showAddInstanceForm, setShowAddInstanceForm] = useState(false);
  const [showRolesList, setShowRolesList] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('URL_VERS_VOTRE_ENDPOINT_POUR_OBTENIR_LE_ROLE');
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle de l\'utilisateur :', error);
      }
    };

    fetchUserRole();
  }, []);



  const handleLogin = () => {
    history.push('/login');
  };

  const handleMenuItemClick = (e) => {
    setSelectedMenuItem(e.key);
    switch (e.key) {
      case '1':
        setShowInstanceList(true);
        setShowAddInstanceForm(false);
        setShowRolesList(false);
        setShowUserList(false);
        setShowSignUp(false);
        break;
      case '2':
        setShowInstanceList(false);
        setShowAddInstanceForm(true);
        setShowRolesList(false);
        setShowUserList(false);
        setShowSignUp(false);
        break;
      case '3':
        setShowInstanceList(false);
        setShowAddInstanceForm(false);
        setShowRolesList(true);
        setShowUserList(false);
        setShowSignUp(false);
        break;
      case '4.1':
        setShowInstanceList(false);
        setShowAddInstanceForm(false);
        setShowRolesList(false);
        setShowUserList(true);
        setShowSignUp(false);
        break;
      case '4.2':
        setShowInstanceList(false);
        setShowAddInstanceForm(false);
        setShowRolesList(false);
        setShowUserList(false);
        setShowSignUp(true);
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark" style={{ background: '#001529', color: '#fff' }}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <img src="/OIP.jpg" alt="Nom de l'application" style={{ width: '200px', height: '50px' }} />
        </div>
        <Layout.Sider theme="dark" width={200} collapsible>
          <Menu mode="inline" theme="dark" selectedKeys={[selectedMenuItem]} onClick={handleMenuItemClick} style={{ background: '#001529', color: '#fff' }}>
            <Menu.Item key="1" icon={<DashboardOutlined />} style={{ color: '#fff' }}>Gestion des Instances</Menu.Item>
            <Menu.Item key="4.1" icon={<UserOutlined />} style={{ color: '#fff' }}>Gestion des utilisateurs</Menu.Item>

            <Menu.Item key="3" icon={<DashboardOutlined />} style={{ color: '#fff' }}>Liste des Rôles</Menu.Item>
          </Menu>
        </Layout.Sider>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)' }}>
          <div style={{ flex: '1' }}>
            {/* Removed buttons from the header as they are now in the sidebar */}
          </div>
          <Button type="primary" onClick={handleLogin}>Déconnexion</Button>
        </Header>
        <Content style={{ margin: '16px', background: '#fff', minHeight: '360px', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0, 21, 41, 0.08)' }}>
          {showInstanceList && <InstanceList />}
          {showAddInstanceForm && <AddInstanceForm />}
          {showRolesList && <RolesList />}
          {showUserList && <UserList />}
          {showSignUp && <SignUp />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
