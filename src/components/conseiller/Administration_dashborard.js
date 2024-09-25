import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import {  PlusOutlined, LogoutOutlined, CommentOutlined ,QuestionCircleOutlined,BarChartOutlined,ExceptionOutlined,AuditOutlined} from '@ant-design/icons';

import { DashboardOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import Profile from '../Profil/UpdateProfil';
import UserProfile from '../Profil/Propos';
import { useAuth } from '../../hooks/AuthContext';
import DemandeAccesDirecteur from '../demandeAccesConseiller/DemandeAccesDirecteur';
import Statistique from '../demandeAccesConseiller/Statistique';

const { Header, Sider, Content } = Layout;

const DashboardAdministration = () => {
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
        history.push('/Login');
    };

    const renderContent = () => {
        switch (selectedMenuItem) {
            case '1':
                return <Profile />;
            case '2':
                return <UserProfile />;
            case '3':
                return <DemandeAccesDirecteur />;
            case '4':
                return <Statistique/>;
            
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider style={{ backgroundColor: '#006bbd' }}>
                {/* Ajouter le logo ici */}
                <img
    src={`${process.env.PUBLIC_URL}/images/conseil.png`}
    alt="Logo"
    style={{
        width: '45px',
        marginLeft: '18px',
        marginTop:'10px',
        marginBottom: '1px',
        borderRadius: '50%',
        // border: '4px solid white',
    }}
/>
                <div style={{ textAlign: 'center', margin: '16px 0', color: 'white' }}>
                    <div>{user && `${user.firstName} `}<br />
                        <span style={{ color: '#00356a' }}>{user && user.email}</span>
                    </div>
                    <br />
                    <Avatar
                        size={89}
                        src={user && user.profile_image ? `http://127.0.0.1:5000/static/uploads/${user.profile_image}` : null}
                        icon={!user || !user.profile_image ? <UserOutlined /> : null}
                        style={{
                            border: '4px solid white',
                            borderRadius: '50%',
                        }}
                    />
                </div>

                <Menu className="custom-menu" mode="inline" defaultSelectedKeys={['1']} selectedKeys={[selectedMenuItem]} onClick={({ key }) => handleMenuItemClick(key)}>
                    {/* <Menu.Item key="1" icon={<UserOutlined />}>update</Menu.Item> */}
                    <Menu.Item key="2" icon={<AuditOutlined  />}>Mon profil</Menu.Item>
                    <Menu.Item key="3" icon={<QuestionCircleOutlined />}>demandes d'information</Menu.Item>
                    <Menu.Item key="4" icon={<BarChartOutlined />}>statistique demande</Menu.Item>

                    
                </Menu>
                <div className="logout-button">
                         </div>
            </Sider>
            <Layout>
                <Content style={{ margin: '16px' }}>
                    <div className="content-container">
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardAdministration;
