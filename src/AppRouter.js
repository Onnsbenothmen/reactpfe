import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Propos from './pages/propos'; 
import DemandeAccesInfoForm from './pages/DemandeAccesInfoForm'; // Utiliser le nom correct du fichier

import Dashboard from './pages/Dashboard';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import HeroSection from './components/HeroSection';
import ListeDemande from './pages/ListeDemande';
import DemandeDetail from './pages/DemandeDetail';
import InstanceList from './pages/InstanceList';
// import Plainte from './pages/Plainte'

function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/page1" component={Page1} />
        <Route path="/page2" component={Page2} />
        <Route path="/home" component={HeroSection} />
        <Route path="/proposPlatforme" component={Propos} />
        <Route path="/demandeAccesInfo" component={DemandeAccesInfoForm} /> {/* Utiliser le nom correct du composant */}
        <Route path="/ListeDemande" component={ListeDemande} />
        <Route path="/demande/:demandeId" component={DemandeDetail} />
        <Route path="/InstanceListCitoyen" component={InstanceList} />

        {/* <Route path="/Plainte" component={Plainte} /> */}



        
      </Switch>
    </Router>
  );
}

export default AppRouter;
