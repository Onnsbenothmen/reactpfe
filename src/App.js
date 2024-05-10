import React from 'react';
import { BrowserRouter as Router, Route, Switch , Redirect} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SignUp from './components/Signup';
import FundsList from './components/FundsList';
import UserList from './components/UserList';
import InstanceCreationForm from './Instance/InstanceCreationForm';
import InstanceList from './Instance/InstanceList';
import RolesList from './components/Role/roleList';
import DashboardPr from './components/president_dashboard';
import 'antd/dist/reset.css';
import AdminPubliqueList from './components/listAdmin';
import UpdateAdmin from './components/UpdateAdmin';


import ListProgramsForAdmin from './ListProgramsForAdmin';
import ConseillerList from './components/ConseillerList';
import UpdateConseilleur from './UpdateConseilleur';
import { AuthProvider } from './hooks/AuthContext';
import UserProfile from './components/Propos';
import Propos from './components/Propos';
import UpdateProfile from './components/UpdateProfil';
import AuthContext from './hooks/AuthContext';
import ConseilleDashboard from './components/conseille_dashboard';
import ProtectedRoute from './ProtectedRoute';
import PVReunions from './components/PVReunions/PVReunions';
import Presentielle from './components/PVReunions/Presentielle';
import Meet from './components/PVReunions/Meet';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ArchivedUsers from './components/ArchivedUsers';
import CreateProgrammeVisite from './components/ProgrammeVisite/CreateProgrammeVisite';
import ListeVisiteEvaluation  from './components/ProgrammeVisite/ListeVisiteEvaluation';


const App = () => {
  
  return (
    <AuthProvider>
      <Router>
        <Switch>
        <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/listFund" component={FundsList} />
          <Route path="/UserList" component={UserList} />
          <Route path="/InstanceCreate" component={InstanceCreationForm}/>
          <Route path="/InstanceList" component={InstanceList}/>
          <Route path="/RolesList" component={RolesList}/>
          <Route path="/superAdmin_dashboard" component={Dashboard} />
        <Route path="/president_dashboard" component={DashboardPr}/>
        <Route path="/Updateprofile" component={UpdateProfile}/>
        <Route path="/ListAdmin" component={AdminPubliqueList}/>
        <Route path="/UpdateAdmin/:id" component={UpdateAdmin}/>
        
        <Route path="/ConseillerList" component={ConseillerList}/>
        <Route path="/conseilleur/:id" component={UpdateConseilleur}/>
        <Route path="/UserProfile" component={UserProfile}/>
        <Route path="/Propos" component={Propos}/>
        <Route path="/conseille" component={ConseilleDashboard}/>
        <Route path="/PV" component={PVReunions}/>
        <Route path="/meet" component={Meet}/>
        <Route path="/Presentielle" component={Presentielle}/>
        <Route path="/forgot_password" component={ForgotPassword} />
        <Route path="/ResetPassword" component={ResetPassword}/>
        <Route path="/archivedUsers" component={ArchivedUsers}/>
        <Route path="/CreateProgrammeVisite" component={CreateProgrammeVisite}/>
        <Route path="/ListeVisiteEvaluation" component={ListeVisiteEvaluation}/>
        <ToastContainer />


        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;