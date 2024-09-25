
import React from 'react';
import './Statistique.css'; // Si vous avez un fichier CSS spécifique pour cette page

function Statistique() {
  return (
    <div>
      <h2></h2>
      <p></p>
      <div className="powerbi-container">
        <iframe
          title="nourBI - Copy"
          src="https://app.powerbi.com/view?r=eyJrIjoiNDI0ODAyODYtNDJhYS00NzdhLTk1MmItNGQwNWEwNWZiMWRlIiwidCI6ImE2MmVlN2M0LWVkMmQtNDk5MS1iNGI4LTMxMjBlODMzM2UxMSJ9"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default Statistique;
