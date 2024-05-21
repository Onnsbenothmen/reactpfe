import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserOutlined, PlusOutlined, UnorderedListOutlined, LogoutOutlined } from '@ant-design/icons';
import Profile from '../Profil/UpdateProfil';
import UserProfile from '../Profil/Propos';

import ListAdmin from '../listAdmin';
import ListeVisiteEvaluation from '../ProgrammeVisite/ListeVisiteEvaluation';
import ConseillerList from './ConseillerList';
import { useAuth } from '../../hooks/AuthContext';
import SignUp from '../Connexion/Signup';
import AddCounselorsForm from './add_conseillers';
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
        // Effacer l'état du menu dans localStorage lors de la déconnexion
        localStorage.removeItem('selectedMenuItem');
        // Rediriger vers la page de connexion
        history.push('/Login');
    };

    const renderContent = () => {
        switch (selectedMenuItem) {
            case '1':
                return <Profile />;
            case '2':
                return <AddCounselorsForm user={user} />
                ;
            case '3':
                return <ListAdmin />;
            case '4':
                return <ListeVisiteEvaluation />;
            case '6':
                return <ConseillerList />;
            case '7':
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
                    <Menu.Item key="1" icon={<UserOutlined />}>update</Menu.Item>
                    <Menu.Item key="2" icon={<PlusOutlined />}>ajouter conseilles</Menu.Item>
                    <Menu.Item key="3" icon={<UnorderedListOutlined />}>liste administrations</Menu.Item>
                    <Menu.Item key="6" icon={<UnorderedListOutlined />}>liste Conseilles Locaux</Menu.Item>
                    <Menu.Item key="4" icon={<UnorderedListOutlined />}>Visite d'évaluation</Menu.Item>
                    <Menu.Item key="7" icon={<UnorderedListOutlined />}>A propos</Menu.Item>

                </Menu>
                <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                    <Button block type="primary" onClick={handleLogout} icon={<LogoutOutlined />}>Déconnexion</Button>
                </div>
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

export default DashboardPr;
