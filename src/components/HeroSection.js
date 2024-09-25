import React, { useState, useEffect } from 'react';
import { Typography, Box, Link, Container, Grid, Card, CardContent } from '@mui/material';

const HeroSection = () => {
  const [showContactDetails, setShowContactDetails] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setShowContactDetails(scrolled > 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box>
      {/* Section Héro */}
      <Box
        sx={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/gg.png)`,
          backgroundSize: 'cover',
          padding: '50px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: 'white',
        }}
      >
        {/* Carte pour la phrase de bienvenue */}
       
      </Box>

      {/* Section "À propos de nous" dans le style demandé */}
      <section className="py-5">
      <Container>
            <Grid container justifyContent="center">
              <Grid item xs={12} md={8}>
                <Box textAlign="center">
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                    A propos de nous
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: '20px' }}>
                    Notre plateforme collaborative est conçue pour révolutionner la gouvernance locale en Tunisie. Elle offre un espace centralisé où les conseils locaux peuvent gérer leurs activités, interagir avec les citoyens et contribuer efficacement à la gouvernance.
                  </Typography>
                  <Typography variant="body1">
                    Nous offrons une solution qui répond aux besoins actuels de modernisation de la gouvernance locale. En utilisant notre plateforme, les conseils locaux peuvent améliorer leur efficacité et renforcer la confiance des citoyens dans le processus démocratique.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
      </section>

      {/* Section des détails qui s'affiche en dessous */}
      {showContactDetails && (
        <Box
          sx={{
            padding: '50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            backgroundColor: '#f7f7f7',
            color: 'black',
          }}
        >
          <Container>
            <Grid container justifyContent="center">
              <Grid item xs={12} md={8}>
                <Box textAlign="center">
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                    À propos de nous
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: '20px' }}>
                    Notre plateforme collaborative est conçue pour révolutionner la gouvernance locale en Tunisie. Elle offre un espace centralisé où les conseils locaux peuvent gérer leurs activités, interagir avec les citoyens et contribuer efficacement à la gouvernance.
                  </Typography>
                  <Typography variant="body1">
                    Nous offrons une solution qui répond aux besoins actuels de modernisation de la gouvernance locale. En utilisant notre plateforme, les conseils locaux peuvent améliorer leur efficacité et renforcer la confiance des citoyens dans le processus démocratique.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {/* Bande pour afficher les détails du site web */}
      <Box
        sx={{
          backgroundColor: '#333',
          color: 'white',
          padding: '20px',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Ajout du lien "QUI SOMMES-NOUS ?" */}
        <Link href="/proposPlatforme" color="inherit" underline="none">
          À Propos de Notre Plateforme
        </Link>
        <Link href="/proposPlatforme" color="inherit" underline="none">
          Pourquoi Choisir Notre Plateforme ?
        </Link>
        <Box>
          <Typography variant="body1">Contactez-nous : +216 20448816</Typography>
          <Typography variant="body1">Email : pccl-Tunisie@.pccl.com</Typography>
          <Link href="https://www.facebook.com" color="inherit" underline="none">
            <img src={`${process.env.PUBLIC_URL}/images/fb.png`} alt="Facebook" style={{ width: '30px', height: '30px' }} />
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
