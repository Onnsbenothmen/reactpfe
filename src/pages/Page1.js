import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Page1.css';

const Page1 = () => {
  const [conseillers, setConseillers] = useState([]);
  const [citoyenEmail, setCitoyenEmail] = useState('');
  const [description, setDescription] = useState('');
  const [selectedConseiller, setSelectedConseiller] = useState('');
  const [nomCitoyen, setNomCitoyen] = useState('');
  const [prenomCitoyen, setPrenomCitoyen] = useState('');
  const [titreDemande, setTitreDemande] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConseillers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/demande/conseillers');
        setConseillers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des conseillers:', error);
        setError('Erreur lors de la récupération des conseillers.');
      }
    };

    fetchConseillers();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    if (!citoyenEmail || !description || !selectedConseiller || !nomCitoyen || !prenomCitoyen || !titreDemande) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setError('');

    
    try {
      await axios.post('http://localhost:5000/plainte_proposition', {
        titre: titreDemande,
        description: description,
        citoyenEmail: citoyenEmail,
        conseillerId: selectedConseiller,
        nomCitoyen: nomCitoyen,
        prenomCitoyen: prenomCitoyen
      });
      setCitoyenEmail('');
      setDescription('');
      setSelectedConseiller('');
      setNomCitoyen('');
      setPrenomCitoyen('');
      setTitreDemande('');
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'La demande a été soumise avec succès !',
      });
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      setError('Erreur lors de la soumission du formulaire.');
    }
  };

  return (
    <div
      className="demande-acces-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/ggg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div className="form-and-text-container">
        <div className="form-wrapper">
          <h1 className="titre-liste">Déposer Plainte</h1>
          <form className="demande-acces-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="citoyenEmail">Email du Citoyen :</label>
              <input
                type="email"
                id="citoyenEmail"
                value={citoyenEmail}
                onChange={event => setCitoyenEmail(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nomCitoyen">Nom du Citoyen :</label>
              <input
                type="text"
                id="nomCitoyen"
                value={nomCitoyen}
                onChange={event => setNomCitoyen(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="prenomCitoyen">Prénom du Citoyen :</label>
              <input
                type="text"
                id="prenomCitoyen"
                value={prenomCitoyen}
                onChange={event => setPrenomCitoyen(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="titreDemande">Titre de la Demande :</label>
              <input
                type="text"
                id="titreDemande"
                value={titreDemande}
                onChange={event => setTitreDemande(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description de la demande :</label>
              <textarea
                id="description"
                value={description}
                onChange={event => setDescription(event.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="conseiller">Conseiller :</label>
              <select
                id="conseiller"
                value={selectedConseiller}
                onChange={event => setSelectedConseiller(event.target.value)}
              >
                <option value="">Sélectionnez un conseiller</option>
                {conseillers.map(conseiller => (
                  <option key={conseiller.id} value={conseiller.id}>
                    {conseiller.firstName} {conseiller.lastName}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Soumettre</button>
          </form>
        </div>
        <div className="description-section">
          <h2>Plaintes des citoyens</h2>
          <p>
            La section "Plaintes des citoyens" de la plateforme collaborative destinée aux conseils locaux en Tunisie est une 
            interface clé pour l'interaction entre les citoyens et leurs représentants élus. Elle est conçue pour faciliter la 
            soumission, le suivi et la gestion des plaintes par les citoyens, renforçant ainsi la transparence et la responsabilité 
            au sein de la gouvernance locale.
          </p>
          <h3>Soumission des Plaintes :</h3>
          <p>
            Les citoyens peuvent utiliser cette partie de la plateforme pour soumettre leurs plaintes ou 
            préoccupations directement aux conseils locaux. Pour ce faire, ils doivent fournir des 
            informations de contact, décrire la nature de leur plainte et, si nécessaire, joindre des documents
            justificatifs. Ils ont également la possibilité de choisir le conseiller auquel ils souhaitent 
            adresser leur plainte.
          </p>
          <h3>Traitement des Plaintes :</h3>
          <p>
            Une fois la plainte soumise, elle est enregistrée dans le système avec un statut initial "privé". Les conseillers élus 
            ont accès aux plaintes qui leur sont directement adressées et peuvent commencer le processus de traitement en fonction 
            de la nature de la plainte.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page1;
