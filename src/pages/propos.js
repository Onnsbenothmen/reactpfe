import React from 'react';
import { Typography, Box, Grid, Container } from '@mui/material';

const Propos = () => {
  return (
    <Box component="section" sx={{ py: 5, backgroundColor: '#f9f9f9' }}>
      <Container>
        <Grid container spacing={4} alignItems="center" justifyContent="space-between">
          {/* Texte principal */}
          <Grid item xs={12} md={5} order={{ xs: 2, md: 1 }}>
            <Box mt={{ xs: 5, md: 0 }}>
              <Typography variant="overline" color="textSecondary">
              </Typography>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                Pourquoi Choisir Notre Plateforme ?
              </Typography>
              <Typography variant="body1" paragraph>
                Notre plateforme collaborative est conçue pour révolutionner la gouvernance locale en Tunisie. Elle offre un espace centralisé où les conseils locaux peuvent gérer leurs activités, interagir avec les citoyens et contribuer efficacement à la gouvernance.
              </Typography>
              <Typography variant="body1" paragraph>
                Nous offrons une solution qui répond aux besoins actuels de modernisation de la gouvernance locale. En utilisant notre plateforme, les conseils locaux peuvent améliorer leur efficacité et renforcer la confiance des citoyens dans le processus démocratique.
              </Typography>
            </Box>
          </Grid>

          {/* Images */}
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box component="img" src={`${process.env.PUBLIC_URL}/images/yyyy.png`} alt="Image 1" sx={{ width: '100%', borderRadius: '8px' }} />
              </Grid>
              <Grid item xs={6}>
                <Box component="img" src={`${process.env.PUBLIC_URL}/images/yyyy.png`} alt="Image 2" sx={{ width: '100%', borderRadius: '8px' }} />
              </Grid>
              <Grid item xs={6}>
                <Box component="img" src={`${process.env.PUBLIC_URL}/images/yyyy.png`} alt="Image 3" sx={{ width: '100%', borderRadius: '8px' }} />
              </Grid>
              <Grid item xs={6}>
                <Box component="img" src={`${process.env.PUBLIC_URL}/images/yyyy.png`} alt="Image 4" sx={{ width: '100%', borderRadius: '8px' }} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Propos;
