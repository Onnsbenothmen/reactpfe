import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import {DatabaseOutlined, UserOutlined, PlusOutlined, UnorderedListOutlined, LogoutOutlined, CommentOutlined ,AuditOutlined,ProfileFilled,UsergroupAddOutlined ,StopOutlined} from '@ant-design/icons';
import Profile from '../Profil/UpdateProfil';
import UserProfile from '../Profil/Propos';
import ArchivedReunions from '../Reunion/ArchivedReunions';
import ListeReunionsPresident from '../Reunion/ListeReunionsPresident';
import ListAdmin from '../AdministrationPublique/listAdmin';
import ListeVisiteEvaluation from '../ProgrammeVisite/ListeVisiteEvaluation';
import ArchivedProgrammesVisite from '../ProgrammeVisite/ArchivedProgrammesVisite';
import { useAuth } from '../../hooks/AuthContext';
import AddCounselorsForm from './add_conseillers';
import './DashboardPr.css'; // Importer le fichier CSS personnalisé

const { Header, Sider, Content } = Layout;

const DashboardPr = () => {
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
                return <UserProfile />;
            case '2':
                return <AddCounselorsForm user={user} />;
            case '3':
                return <ListAdmin />;

            case '4':
                return <ListeReunionsPresident />;
            case '5':
                return <ListeVisiteEvaluation />;
            
            case '6':
                return <ArchivedProgrammesVisite />;
            
            
            
            
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
                    <div>{user && `${user.firstName} ${user.lastName}`}<br />
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
                    <Menu.Item key="1" icon={<AuditOutlined  />}>Mon profil</Menu.Item>
                    <Menu.Item key="2" icon={<UsergroupAddOutlined  />}>ajouter conseilles</Menu.Item>
                    <Menu.Item key="3" icon={<DatabaseOutlined  />}>liste administrations</Menu.Item>
                    <Menu.Item key="4" icon={<CommentOutlined />}>Réunions</Menu.Item>

                    <Menu.Item key="5" icon={<ProfileFilled />}>Visite d'évaluation</Menu.Item>
                    <Menu.Item key="6" icon={<StopOutlined  />}>ArchivedProgrammesVisite</Menu.Item>
                    
                    
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

export default DashboardPr;
