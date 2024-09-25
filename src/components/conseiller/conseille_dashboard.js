import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import { LogoutOutlined, AuditOutlined, QuestionCircleOutlined, ExceptionOutlined, CommentOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/AuthContext';
import UserProfile from '../Profil/Propos';
import DemandeAcces from '../demandeAccesConseiller/demandeAcces';
import PlainteListe from '../Plainte/PlainteListe';
import ListeReunions from '../Reunion/ListeReunions';
import ProgrammeVisiteConseiller from './ProgrammeVisiteConseiller';

import './conseille_dashboard.css';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
    const history = useHistory();
    const { user, logout } = useAuth(); // Assuming useAuth provides logout function

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
        logout(); // Call logout function from useAuth or implement your logout logic
        history.push('/Login');
    };

    const renderContent = () => {
        switch (selectedMenuItem) {
            case '1':
                return <UserProfile />;
            case '2':
                return <DemandeAcces />;
            case '3':
                return <PlainteListe />;
            case '4':
                return <ListeReunions />;
            case '5':
                return <ProgrammeVisiteConseiller />;
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider style={{ backgroundColor: '#006bbd' }}>
                <img
                    src={`${process.env.PUBLIC_URL}/images/conseil.png`}
                    alt="Logo"
                    style={{
                        width: '45px',
                        marginLeft: '18px',
                        marginTop: '10px',
                        marginBottom: '1px',
                        borderRadius: '50%',
                    }}
                />
                <div style={{ textAlign: 'center', margin: '16px 0', color: 'white' }}>
                    <div>{user && `${user.firstName} ${user.lastName}`}<br />
                        <span style={{ color: '#00356a' }}>{user && user.email}</span>
                    </div>
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
                    <Menu.Item key="1" icon={<AuditOutlined />}>Mon profil</Menu.Item>
                    <Menu.Item key="2" icon={<QuestionCircleOutlined />}>Demandes d'information</Menu.Item>
                    <Menu.Item key="3" icon={<ExceptionOutlined />}>Plaintes</Menu.Item>
                    <Menu.Item key="4" icon={<CommentOutlined />}>Réunions</Menu.Item>
                    <Menu.Item key="5" icon={<ProfileOutlined />}>Programme visite</Menu.Item>
                    <Menu.Item key="6" icon={<LogoutOutlined />} onClick={handleLogout}>Déconnexion</Menu.Item>
                </Menu>

                <div className="logout-button" style={{ marginTop: 'auto', marginBottom: '70px', width: '100%', textAlign: 'center' }}>
                    {/* You may want to remove this redundant logout button */}
                    {/* <Button onClick={handleLogout} icon={<LogoutOutlined />} type="primary" style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', marginBottom: '10px' }} block>
                        Déconnexion
                    </Button> */}
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

export default Dashboard;
