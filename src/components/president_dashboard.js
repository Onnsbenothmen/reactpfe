import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { useHistory } from 'react-router-dom'; // Importez useHistory
import { UserOutlined, PlusOutlined, UnorderedListOutlined, LogoutOutlined } from '@ant-design/icons';
import Profile from './Profil';
import SignupAdmin from './SignupAdmin'; // Importez le composant SignupAdmin
import ListAdmin from './listAdmin'; // Importez le composant ListAdmin
import CreateProgramme from '../CreateProgramme';
import SignupConseilleur from '../SignupConseilleur';
import ConseillerList from './ConseillerList';
import UserProfile from './A_propos';
const { Header, Sider, Content } = Layout;

const DashboardPr = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');
    const history = useHistory(); // Initialisez useHistory

    const handleMenuItemClick = (key) => {
        setSelectedMenuItem(key);
    };

    const handleLogin = () => {
        history.push('/login'); // Redirigez vers la page de connexion lors du clic sur le bouton
    };

    const renderContent = () => {
        switch (selectedMenuItem) {
            case '1':
                return <Profile />;
            case '2':
                return <SignupAdmin />;
            case '3':
                return <ListAdmin />;
            case '4':
                return <CreateProgramme/>
            case '5':
                return <SignupConseilleur/>
            case '6':
                return <ConseillerList/>
            case'7':
                return <UserProfile/>
            default:
                return null;
        }
    };

    // Comment

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider style={{ backgroundColor: '#001529' }}>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} selectedKeys={[selectedMenuItem]} onClick={({ key }) => handleMenuItemClick(key)}>
                    <Menu.Item key="1" icon={<UserOutlined />}>Profile</Menu.Item>
                    <Menu.Item key="2" icon={<PlusOutlined />}>Add Admin</Menu.Item>
                    <Menu.Item key="5" icon={<PlusOutlined />}>Add ConseillerLocale</Menu.Item>
                    <Menu.Item key="3" icon={<UnorderedListOutlined />}>Admin List</Menu.Item>
                    <Menu.Item key="6" icon={<UnorderedListOutlined />}>ConseillerLocale List</Menu.Item>

                    <Menu.Item key="4" icon={<UnorderedListOutlined />}>Visite d'évaluation</Menu.Item>
                    <Menu.Item key="7" icon={<UnorderedListOutlined />}>a propos</Menu.Item>



                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0, textAlign: 'right', paddingRight: 16 }}>
                    <Button type="primary" onClick={handleLogin} icon={<LogoutOutlined />}>Déconnexion</Button>
                </Header>
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
