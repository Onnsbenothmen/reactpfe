import React from 'react';
import axios from 'axios';

const DemandeItem = ({ demande, onArchive }) => {
  const handleArchive = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/archive_demande/${demande.id}`);
      if (response.status === 200) {
        onArchive(demande.id);  // Mettre à jour l'UI après l'archivage réussi
      }
    } catch (error) {
      console.error('Erreur lors de l\'archivage de la demande !', error);
    }
  };

  return (
    <div>
      <h3>{demande.titre}</h3>
      <p>{demande.description}</p>
      <button onClick={handleArchive}>Archiver</button>
    </div>
  );
};

export default DemandeItem;
