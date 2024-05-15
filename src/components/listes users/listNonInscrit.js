import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ExclamationCircleOutlined } from '@ant-design/icons'; // Import de l'icône
import './/listNonInscrit.css'; // Importation des styles CSS

const InactivePresidents = () => {
  const [inactivePresidents, setInactivePresidents] = useState([]);


  useEffect(() => {
    fetchInactivePresidents();
  }, []);

  const [sentEmails, setSentEmails] = useState({}); // État pour stocker les emails envoyés

  const fetchInactivePresidents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/inactive_presidents');
      // Initialisation de l'état des emails envoyés
      const initialSentEmails = response.data.reduce((acc, email) => {
        acc[email] = false;
        return acc;
      }, {});
      setSentEmails(initialSentEmails);
      setInactivePresidents(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des présidents inactifs:', error);
    }
  };

  const sendEmailToPresident = async (presidentEmail) => {
    try {
      // Votre logique d'envoi d'email ici
      const response = await axios.post('http://localhost:5000/send_email_to_president', {
        president_email: presidentEmail,
        instance_name: 'Nom de l\'instance',
        ville: 'Nom de la ville',
        new_user_id: 'ID de l\'utilisateur'
      });
      console.log('Email envoyé avec succès:', response.data);
      setSentEmails((prevState) => ({
        ...prevState,
        [presidentEmail]: true,
      }));
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      alert('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="title">Liste des Présidents non inscrits</h2>
      <br></br>
      <table className="presidents-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Email du Président</th>
          </tr>
        </thead>
        <tbody>
          {inactivePresidents.map((presidentEmail, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td><ExclamationCircleOutlined /> {presidentEmail}</td> {/* Icône ajoutée ici */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InactivePresidents;
