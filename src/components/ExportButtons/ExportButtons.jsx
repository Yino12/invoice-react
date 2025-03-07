import React, { useCallback } from 'react';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import styles from './ExportButtons.module.css';

const ExportButtons = ({ onDarkModeToggle, isDarkMode, data, title, client, contact, payment, onTitleChange, onClientChange, onContactChange, onPaymentChange, onActivitiesChange }) => {
  const exportToPDF = useCallback(() => {
    // Store current theme state
    const wasDarkMode = document.body.classList.contains('dark-mode');
    
    // Temporarily remove dark mode
    if (wasDarkMode) {
      document.body.classList.remove('dark-mode');
      document.querySelectorAll('.dark-mode').forEach(element => {
        element.classList.remove('dark-mode');
      });
    }
  
    // Hide the entire button container
    const buttonContainer = document.querySelector(`.${styles.buttonContainer}`);
    buttonContainer.style.display = 'none';
  
    // Hide other buttons before export
    document.querySelectorAll('button').forEach(button => {
      if (!button.classList.contains(styles.exportButton)) {
        button.classList.add(styles.hidden);
      }
    });
  
    // Add class for expanding inputs
    document.querySelectorAll('.value-row').forEach(row => {
      row.classList.add('no-button');
      row.classList.add('export-mode');
    });
  
    // Create and add temporary styles for PDF export
    const style = document.createElement('style');
    style.id = 'pdf-export-styles';
    style.textContent = `
      input, select {
        border: none !important;
        margin-bottom: 0 !important;
        box-shadow: none !important;
        padding: 0px !important;
      }
      select {
        background: transparent !important;
      }
      .section {
        margin-bottom: 0 !important;
      }
      .value-row {
        margin-bottom: 0px !important;
      }
    `;
    document.head.appendChild(style);
  
    const element = document.getElementById('invoice-container');
    const opt = {
      margin: 0,
      filename: 'cotizacion.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save().then(() => {
      // Remove temporary styles
      document.getElementById('pdf-export-styles').remove();
  
      // Show the button container
      buttonContainer.style.display = 'flex';
  
      // Show buttons after export
      document.querySelectorAll('button').forEach(button => {
        if (!button.classList.contains(styles.exportButton)) {
          button.classList.remove(styles.hidden);
        }
      });
  
      // Remove classes for expanding inputs
      document.querySelectorAll('.value-row').forEach(row => {
        row.classList.remove('no-button');
        row.classList.remove('export-mode');
      });
  
      // Restore dark mode if it was active
      if (wasDarkMode) {
        document.body.classList.add('dark-mode');
        document.querySelectorAll('.container, .details, input, textarea, select').forEach(element => {
          element.classList.add('dark-mode');
        });
      }
    });
  }, []);

  const exportToExcel = useCallback(() => {
    const workbook = XLSX.utils.book_new();
    
    // Create header sheet
    const headerData = [{
      'Título': title,
      'Cliente': client.name,
      'Proyecto': client.project,
      'Teléfono': contact.phone,
      'Email': contact.email,
      'Dirección': contact.address,
      'Método de Pago': payment.method,
      'Detalles de Pago': payment.details
    }];
    const headerSheet = XLSX.utils.json_to_sheet(headerData);
    XLSX.utils.book_append_sheet(workbook, headerSheet, 'Información');

    // Create activities sheet
    const activitiesSheet = XLSX.utils.json_to_sheet(data.activities.map(activity => ({
      'Actividad': activity.name,
      'Cantidad': activity.quantity,
      'Valor': activity.value,
      'Total': activity.quantity * activity.value
    })));
    XLSX.utils.book_append_sheet(workbook, activitiesSheet, 'Actividades');

    XLSX.writeFile(workbook, 'cotizacion.xlsx');
  }, [data.activities]);

  const handleImportExcel = useCallback((event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Import header information
      const headerSheet = workbook.Sheets['Información'];
      if (headerSheet) {
        const [headerData] = XLSX.utils.sheet_to_json(headerSheet);
        if (headerData) {
          onTitleChange(headerData['Título'] || '');
          onClientChange({
            name: headerData['Cliente'] || '',
            project: headerData['Proyecto'] || ''
          });
          onContactChange({
            phone: headerData['Teléfono'] || '',
            email: headerData['Email'] || '',
            address: headerData['Dirección'] || ''
          });
          onPaymentChange({
            method: headerData['Método de Pago'] || '',
            details: headerData['Detalles de Pago'] || ''
          });
        }
      }

      // Import activities
      const activitiesSheet = workbook.Sheets['Actividades'];
      if (activitiesSheet) {
        const activitiesData = XLSX.utils.sheet_to_json(activitiesSheet);
        const formattedActivities = activitiesData.map(item => ({
          name: item['Actividad'] || '',
          quantity: item['Cantidad'] || 0,
          value: item['Valor'] || 0
        }));
        onActivitiesChange(formattedActivities);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  return (
    <div className={styles.buttonContainer}>
      <button className={styles.exportButton} onClick={exportToPDF}>
        Exportar a PDF
      </button>
      <button className={styles.exportButton} onClick={exportToExcel}>
        Exportar a Excel
      </button>
      <input
        type="file"
        id="import-excel-input"
        className={styles.hidden}
        accept=".xlsx"
        onChange={handleImportExcel}
      />
      <button
        className={styles.exportButton}
        onClick={() => document.getElementById('import-excel-input').click()}
      >
        Importar desde Excel
      </button>
      <button
        className={styles.exportButton}
        onClick={onDarkModeToggle}
      >
        {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
      </button>
    </div>
  );
};

export default ExportButtons;