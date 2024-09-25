import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserOutlined, PlusOutlined, UnorderedListOutlined, LogoutOutlined,UsergroupDeleteOutlined , CommentOutlined, DashboardOutlined ,HddOutlined} from '@ant-design/icons';
import { useAuth } from '../hooks/AuthContext';
import './Dashboard.css'; // Importer le fichier CSS personnalisé

// Chemins d'importation corrigés
import InstanceList from './Instance/InstanceList';
import UserList from './listes users/UserList';
import ArchivedUsers from './listes users/ArchivedUsers';
import RolesList from './Role/roleList';
import SignUp from './Connexion/Signup';
import InactivePresidents from './listes users/listNonInscrit';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
    const history = useHistory();
    const [userRole, setUserRole] = useState(null);
    const [showInstanceList, setShowInstanceList] = useState(true);
    const [showAddInstanceForm, setShowAddInstanceForm] = useState(false);
    const [showRolesList, setShowRolesList] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showArchivedUsers, setShowArchivedUsers] = useState(false);
    const [showInactivePresidents, setShowInactivePresidents] = useState(false);
    const { user } = useAuth();
    const menuRef = useRef();
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');
    const [subMenuOpen, setSubMenuOpen] = useState(false);

    useEffect(() => {
        const storedSelectedMenuItem = localStorage.getItem('selectedMenuItem');
        if (storedSelectedMenuItem) {
            setSelectedMenuItem(storedSelectedMenuItem);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('selectedMenuItem');
        history.push('/Login');
    };

    const handleSubMenuOpenChange = (open) => {
        setSubMenuOpen(open);
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
                setShowArchivedUsers(false);
                setShowInactivePresidents(false);
                break;
            case '2':
                setShowInstanceList(false);
                setShowAddInstanceForm(true);
                setShowRolesList(false);
                setShowUserList(false);
                setShowSignUp(false);
                setShowArchivedUsers(false);
                setShowInactivePresidents(false);
                break;
            case '3':
                setShowInstanceList(false);
                setShowAddInstanceForm(false);
                setShowRolesList(true);
                setShowUserList(false);
                setShowSignUp(false);
                setShowArchivedUsers(false);
                setShowInactivePresidents(false);
                break;
            case '4.1':
                setShowInstanceList(false);
                setShowAddInstanceForm(false);
                setShowRolesList(false);
                setShowUserList(true);
                setShowSignUp(false);
                setShowArchivedUsers(false);
                setShowInactivePresidents(false);
                break;
            case '4.2':
                setShowInstanceList(false);
                setShowAddInstanceForm(false);
                setShowRolesList(false);
                setShowUserList(false);
                setShowSignUp(false);
                setShowArchivedUsers(true);
                setShowInactivePresidents(false);
                break;
            case '4.4':
                setShowInstanceList(false);
                setShowAddInstanceForm(false);
                setShowRolesList(false);
                setShowUserList(false);
                setShowSignUp(false);
                setShowArchivedUsers(false);
                setShowInactivePresidents(true);
                break;
            default:
                break;
        }
        // On ferme le sous-menu seulement si l'utilisateur ne se trouve pas dans la catégorie "Gestion des utilisateurs"
        if (!e.key.startsWith('4')) {
            setSubMenuOpen(false);
        }
    };

    // Définition de la fonction renderContent
    const renderContent = () => {
        if (showInstanceList) return <InstanceList />;
        if (showAddInstanceForm) return <div>Add Instance Form</div>;
        if (showRolesList) return <RolesList />;
        if (showUserList) return <UserList />;
        if (showSignUp) return <SignUp />;
        if (showArchivedUsers) return <ArchivedUsers />;
        if (showInactivePresidents) return <InactivePresidents />;
        return null;
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
                        marginTop: '10px',
                        marginBottom: '1px',
                        borderRadius: '50%',
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

                <Menu className="custom-menu" mode="inline" defaultSelectedKeys={['1']} selectedKeys={[selectedMenuItem]} onClick={handleMenuItemClick}>

                    <Menu.Item key="1" icon={<HddOutlined  />}>Gestion des Instances</Menu.Item>
                    <Menu.SubMenu key="sub1" icon={<UsergroupDeleteOutlined />} title="Gestion des utilisateurs">
                        <Menu.Item key="4.1" >Utilisateur Activé</Menu.Item>
                        <Menu.Item key="4.2">Utilisateurs Désactivés</Menu.Item>
                        <Menu.Item key="4.4">Utilisateurs non inscrits</Menu.Item>
                    </Menu.SubMenu>
                </Menu>
                <div className="logout-button">
                    <Button type="primary" onClick={handleLogout}>Déconnexion</Button>
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
