import React from 'react';
import { Document, Page, PDFViewer } from '@react-pdf/renderer';

const ApercuRapportPDF = ({ pdfData }) => (
  <PDFViewer style={{ width: '100%', height: '100vh' }}>
    <Document>
      <Page>{/* Ajoutez ici le contenu du rapport PDF */}</Page>
    </Document>
  </PDFViewer>
);

export default ApercuRapportPDF;
