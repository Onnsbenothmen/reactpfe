import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Connexion/Login';
import Dashboard from './components/Dashboard';
import SignUp from './components/Connexion/Signup';
import UserList from './components/listes users/UserList';
import InstanceList from './components/Instance/InstanceList';
import RolesList from './components/Role/roleList';
import DashboardPr from './components/président/president_dashboard';
import 'antd/dist/reset.css';
import AdminPubliqueList from './components/AdministrationPublique/listAdmin';
import UpdateAdmin from './components/UpdateAdmin';
import ConseillerList from './components/président/ConseillerList';
import UpdateConseilleur from './UpdateConseilleur';
import { AuthProvider } from './hooks/AuthContext';
import UserProfile from './components/Profil/Propos';
import Propos from './components/Profil/Propos';
import UpdateProfile from './components/Profil/UpdateProfil';
import ConseilleDashboard from './components/conseiller/conseille_dashboard';
import ForgotPassword from './components/Profil/ForgotPassword';
import ResetPassword from './components/Connexion/ResetPassword'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ArchivedUsers from './components/listes users/ArchivedUsers';
import InactivePresidents from './components/listes users/listNonInscrit';
import add_conseillers from './components/président/add_conseillers';
import signupConseille from './components/conseiller/signupConseille';
import PasswordForm from './components/conseiller/passwordConseille';

import CreateProgrammeVisite from './components/ProgrammeVisite/CreateProgrammeVisite';
import ListeVisiteEvaluation from './components/ProgrammeVisite/ListeVisiteEvaluation';
import ArchivedProgrammesVisite from './components/ProgrammeVisite/ArchivedProgrammesVisite';


import AjoutReunion from './components/Reunion/AjoutReunion';
import ListeReunions from './components/Reunion/ListeReunions';
import ArchivedReunions from './components/Reunion/ArchivedReunions';

import AppRouter from './AppRouter'; // Assure-toi que le chemin est correct
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';



import demandeAcces from './components/demandeAccesConseiller/demandeAcces';
import DashboardAdministration from './components/conseiller/Administration_dashborard';
import DemandeArchivee from './components/demandeAccesConseiller/DemandeArchivee';
import DemandeItem from './components/demandeAccesConseiller/DemandeItem';
import PlainteListe from './components/Plainte/PlainteListe';
import PlainteArchiveeListe from './components/Plainte/PlainteArchiveeListe';

import OrgChartComponent from './components/Instance/OrgChartComponent';
import Statistique from './components/demandeAccesConseiller/Statistique';
import ajouterAdministration from './components/AdministrationPublique/ajouterAdministration';
import SignupDirector from './components/AdministrationPublique/signupAdministration';

import ProgrammeVisiteConseiller from './components/conseiller/ProgrammeVisiteConseiller';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/login" component={Login} />
          <Route path="/signup/:newUserId">
            <SignUp />
          </Route>
          <Route path="/UserList" component={UserList} />
          <Route path="/InstanceList" component={InstanceList} />
          <Route path="/RolesList" component={RolesList} />
          <Route path="/superAdmin_dashboard" component={Dashboard} />
          <Route path="/president_dashboard" component={DashboardPr} />
          <Route path="/Updateprofile" component={UpdateProfile} />
          <Route path="/ListAdmin" component={AdminPubliqueList} />
          <Route path="/UpdateAdmin/:id" component={UpdateAdmin} />

          <Route path="/ConseillerList" component={ConseillerList} />
          
          <Route path="/conseilleur/:id" component={UpdateConseilleur} />
          <Route path="/UserProfile" component={UserProfile} />
          <Route path="/Propos" component={Propos} />
          <Route path="/conseille" component={ConseilleDashboard} />
          <Route path="/forgot_password" component={ForgotPassword} />
          <Route path="/ResetPassword" component={ResetPassword} />
          <Route path="/archivedUsers" component={ArchivedUsers} />
          <Route path="/ListeVisiteEvaluation" component={ListeVisiteEvaluation} />
          <Route path="/InactivePresidents" component={InactivePresidents} />
          <Route path="/add_conseillers" component={add_conseillers} />
          <Route path="/register/:newUserId" component={signupConseille} />
          <Route path="/add_password/:newUserId" component={PasswordForm} />

          <Route path="/CreateProgrammeVisite" component={CreateProgrammeVisite} />
          <Route path="/ListeVisiteEvaluation" component={ListeVisiteEvaluation} />
          <Route path="/ArchivedProgrammesVisite" component={ArchivedProgrammesVisite} />

          <Route path="/AjoutReunion" component={AjoutReunion} />
          <Route path="/ListeReunions" component={ListeReunions} />
          <Route path="/ArchivedReunions" component={ArchivedReunions} />



          <Route path="/demandeAcces" component={demandeAcces} />
          <Route path="/archivees" component={DemandeArchivee} />
          <Route path="/DemandeItem" component={DemandeItem} />

          
          
          <Route path="/dashboardAdministration" component={DashboardAdministration} />
          <Route path="/PlainteListe" component={PlainteListe} />
          <Route path="/PlainteArchiveeListe" component={PlainteArchiveeListe} />
          <Route path="/OrgChartComponent" component={OrgChartComponent} />

          <Route path="/Statistique" component={Statistique} />

          <Route path="/ajouterAdministration" component={ajouterAdministration}/>
          <Route path="/ListAdmin" component={AdminPubliqueList} />
          <Route path="/registerAdmin/:newUserId" component={SignupDirector} />


          <Route path="/ProgrammeVisiteConseiller" component={ProgrammeVisiteConseiller} />










          



          

          <Route exact path="/home" render={() => (
            
            <>
              <Navbar />
              <HeroSection />
              </>
          )} />

          <AppRouter /> {/* Intégration du composant AppRouter */}
          
          <ToastContainer />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
