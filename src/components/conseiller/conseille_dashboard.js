import React, { useState, useEffect } from 'react';
import { Layout, Button, Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import { DashboardOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Profile from '../Profil/UpdateProfil';
import UserProfile from '../Profil/Propos';
import { useAuth } from '../../hooks/AuthContext';

const Dashboard = () => {
  const history = useHistory();
  const { user } = useAuth();

  const { Header, Sider, Content } = Layout;
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');

  useEffect(() => {
    const storedSelectedMenuItem = localStorage.getItem('selectedMenuItem');
    if (storedSelectedMenuItem) {
      setSelectedMenuItem(storedSelectedMenuItem);
    }
  }, []);

  const handleMenuItemClick = (key) => {
    setSelectedMenuItem(key);
    localStorage.setItem('selectedMenuItem', key);
  };

  const handleLogout = () => {
    // Add your logout logic here
    history.push('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark" style={{ background: '#001529', color: '#fff' }}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <img src="/OIP.jpg" alt="Nom de l'application" style={{ width: '200px', height: '50px' }} />
        </div>
        <Menu
          mode="inline"
          theme="dark"
          style={{ background: '#001529', color: '#fff' }}
          selectedKeys={[selectedMenuItem]}
          onClick={({ key }) => handleMenuItemClick(key)}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />} style={{ color: '#fff' }}>Gestion des Instances</Menu.Item>
          <Menu.Item key="2" icon={<UnorderedListOutlined />}>A propos</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)' }}>
          <div style={{ flex: '1', textAlign: 'center' }}>
            <Button type="primary" onClick={handleLogout}>Déconnexion</Button>
          </div>
          {/* Add your about button here */}
        </Header>
        <Content style={{ margin: '16px', background: '#fff', minHeight: '360px', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0, 21, 41, 0.08)' }}>
          {/* Add your content here */}
          {selectedMenuItem === '1' && <Profile />}
          {selectedMenuItem === '2' && <UserProfile />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
