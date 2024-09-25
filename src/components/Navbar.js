import React from 'react';
import { Link,useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  const history = useHistory();
  
  return (
    <AppBar position="static">
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          style={{ color: 'white', textDecoration: 'none', textTransform: 'none' }} // Ajout de textTransform: 'none'
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/conseil.png`}
            alt="Logo"
            style={{
              width: '45px',
              marginLeft: '18px',
              marginTop: '1px',
              marginBottom: '1px',
              borderRadius: '50%',
              // border: '4px solid white',
            }}
          />
        </Typography>
        <div>
          <Button
            component={Link}
            to="/home"
            color="inherit"
            sx={{ fontWeight: 'normal', textTransform: 'none' }} // Ajout de textTransform: 'none'
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/proposPlatforme"
            color="inherit"
            sx={{ fontWeight: 'normal', textTransform: 'none' }} // Ajout de textTransform: 'none'
          >
            À propos
          </Button>
          <Button
            component={Link}
            to="/demandeAccesInfo"
            color="inherit"
            sx={{ fontWeight: 'normal', textTransform: 'none' }} // Ajout de textTransform: 'none'
          >
            Demande Accès Info
          </Button>
          <Button
            component={Link}
            to="/ListeDemande"
            color="inherit"
            sx={{ fontWeight: 'normal', textTransform: 'none' }} // Ajout de textTransform: 'none'
          >
            Liste Demande
          </Button>
          <Button
            component={Link}
            to="/Page1"
            color="inherit"
            sx={{ fontWeight: 'normal', textTransform: 'none' }} // Ajout de textTransform: 'none'
          >
            Plainte
          </Button>
          <Button
            component={Link}
            to="/InstanceListCitoyen"
            color="inherit"
            sx={{ fontWeight: 'normal', textTransform: 'none' }} // Ajout de textTransform: 'none'
          >
            InstanceList
          </Button>
          <Button
            component={Link}
            to="/Page2"
            color="inherit"
            sx={{ fontWeight: 'normal', textTransform: 'none' }} // Ajout de textTransform: 'none'
          >
            Statistique Demande
          </Button>
        </div>
        <div>
        <Button onClick={() => history.push('/login')} color="inherit" sx={{ fontWeight: 'normal', textTransform: 'none' }}>
            Login
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
