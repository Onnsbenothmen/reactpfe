// App.js
import React from 'react';
import { AuthProvider } from './hooks/AuthContext';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SignUp from './components/Signup';
import FundsList from './components/FundsList';
import UserList from './components/UserList';
import UpdateUser from './components/updatUser';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route exact path="/dashboard" component={Dashboard} /> {/* Correction ici */}
          <Route path="/listFund" component={FundsList} />
          <Route path="/UserList" component={UserList} />
          <Route path="/update/:id" component={UpdateUser} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
