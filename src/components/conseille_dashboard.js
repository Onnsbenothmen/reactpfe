import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import Profile from './Profil/UpdateProfil';
import UserProfile from './Profil/Propos'; 
import { useAuth } from '../hooks/AuthContext';

const { Sider, Content } = Layout;

const ConseilleDashboard = () => {
    const history = useHistory();
    const { user } = useAuth();

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
        localStorage.removeItem('selectedMenuItem');
        history.push('/Profile');
    };

    const renderContent = () => {
        switch (selectedMenuItem) {
            case '1':
                return <Profile />;
            case '2':
                return <UserProfile />;
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider style={{ backgroundColor: '#001529' }}>
                <div style={{ textAlign: 'center', margin: '16px 0' }}>
                    <Avatar size={64} src={user && user.profile_image ? `http://127.0.0.1:5000/static/uploads/${user.profile_image}` : <UserOutlined />} />
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} selectedKeys={[selectedMenuItem]} onClick={({ key }) => handleMenuItemClick(key)}>
                    <Menu.Item key="1" icon={<UserOutlined />}>Profile</Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>A Propos</Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content style={{ margin: '16px' }}>
                    <div style={{ padding: 24, minHeight: 360, backgroundColor: '#fff' }}>
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ConseilleDashboard;
