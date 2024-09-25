import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './DemandeAccesInfoForm.css';

const DemandeAccesInfoForm = () => {
  const [conseillers, setConseillers] = useState([]);
  const [directeurs, setDirecteurs] = useState([]);
  const [citoyenEmail, setCitoyenEmail] = useState('');
  const [description, setDescription] = useState('');
  const [selectedConseiller, setSelectedConseiller] = useState('');
  const [selectedDirecteur, setSelectedDirecteur] = useState('');
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

  useEffect(() => {
    const fetchDirecteurs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/directeurs');
        setDirecteurs(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des directeurs:', error);
        setError('Erreur lors de la récupération des directeurs.');
      }
    };

    fetchDirecteurs();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    if (!citoyenEmail || !description || !selectedConseiller || !selectedDirecteur || !nomCitoyen || !prenomCitoyen || !titreDemande) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setError('');

    try {
      await axios.post('http://localhost:5000/demande/acces', {
        titre: titreDemande,
        description: description,
        citoyenEmail: citoyenEmail,
        conseillerId: selectedConseiller,
        directeurId: selectedDirecteur,
        nomCitoyen: nomCitoyen,
        prenomCitoyen: prenomCitoyen
      });
      setCitoyenEmail('');
      setDescription('');
      setSelectedConseiller('');
      setSelectedDirecteur('');
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
    >      <div className="form-and-text-container">
        <div className="form-wrapper">
          <h1 className="titre-liste">Demande d'Accès à l'Information</h1>
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
            <div className="form-group">
              <label htmlFor="directeur">Directeur :</label>
              <select
                id="directeur"
                value={selectedDirecteur}
                onChange={event => setSelectedDirecteur(event.target.value)}
              >
                <option value="">Sélectionnez un directeur</option>
                {directeurs.map(directeur => (
                  <option key={directeur.id} value={directeur.id}>
                    {directeur.nameAdminPublique}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description de la demande :</label>
              <textarea
                id="description"
                value={description}
                onChange={event => setDescription(event.target.value)}
              ></textarea>
            </div>
            <button type="submit">Soumettre</button>
          </form>
        </div>
        <div className="description-section">
          <h2>Accès à l'information</h2>
          <p>
            La section "Accès à l'information" permet aux membres du conseil et aux citoyens d'obtenir des données et des documents importants liés aux activités des administrations publiques et du conseil lui-même. Voici une exploration détaillée de cette rubrique :
          </p>
          <h3>Campagnes de Demande d'Accès à l'Information :</h3>
          <ul>
            <li>
              <strong>Cette fonctionnalité permet au président du conseil de lancer des campagnes ciblées pour collecter des informations spécifiques auprès des administrations publiques.</strong> Il peut créer un formulaire personnalisé pour préciser les informations requises.
            </li>
          </ul>
          <h3>Sélection des Administrations Ciblées :</h3>
          <ul>
            <li>
              <strong>Pour chaque campagne, le président spécifie les administrations publiques ciblées par la demande d'information.</strong> Cela permet de s'assurer que les requêtes sont dirigées de manière précise vers les entités les plus à même de fournir les données pertinentes.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemandeAccesInfoForm;
