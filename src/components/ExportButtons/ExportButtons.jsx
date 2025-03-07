import React, { useCallback } from 'react';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import styles from './ExportButtons.module.css';

const adjustColor = (color, amount) => {
  const clamp = (num) => Math.min(255, Math.max(0, num));
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const num = parseInt(hex, 16);
    const r = clamp(((num >> 16) & 0xFF) + amount);
    const g = clamp(((num >> 8) & 0xFF) + amount);
    const b = clamp((num & 0xFF) + amount);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
  return color;
};

const ExportButtons = ({ onDarkModeToggle, isDarkMode, data, title, client, contact, payment, onTitleChange, onClientChange, onContactChange, onPaymentChange, onActivitiesChange, setLogoUrl }) => {
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
    try {
      const workbook = XLSX.utils.book_new();
      
      // Create header sheet with all form data
      const headerData = [{
        'Título': title || '',
        'Cliente': client?.name || '',
        'Proyecto': client?.project || '',
        'Teléfono': contact?.phone || '',
        'Email': contact?.email || '',
        'Dirección': contact?.address || '',
        'Método de Pago': payment?.method || '',
        'Detalles de Pago': payment?.details || '',
        'Logo URL': (() => {
          const logoImg = document.querySelector('img.logo');
          if (!logoImg) return '';
          const logoUrl = logoImg.src;
          // Only include data URLs and HTTPS URLs
          if (logoUrl.startsWith('data:image/') || logoUrl.startsWith('https://')) {
            return logoUrl;
          }
          return '';
        })()
      }];
      const headerSheet = XLSX.utils.json_to_sheet(headerData);
      XLSX.utils.book_append_sheet(workbook, headerSheet, 'Información');

      // Create activities sheet with detailed information
      const activitiesData = data?.activities?.map(activity => ({
        'Actividad': activity.name || '',
        'Cantidad': activity.quantity || 0,
        'Valor': activity.value || 0,
        'Total': (activity.quantity || 0) * (activity.value || 0)
      })) || [];
      const activitiesSheet = XLSX.utils.json_to_sheet(activitiesData);
      XLSX.utils.book_append_sheet(workbook, activitiesSheet, 'Actividades');

      // Add styling information
      const stylingData = [{
        'Modo Oscuro': isDarkMode,
        'Color Principal': getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()
      }];
      const stylingSheet = XLSX.utils.json_to_sheet(stylingData);
      XLSX.utils.book_append_sheet(workbook, stylingSheet, 'Estilos');

      // Write the file
      XLSX.writeFile(workbook, 'cotizacion.xlsx');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error al exportar a Excel. Por favor, intente nuevamente.');
    }
  }, [data, isDarkMode, title, client, contact, payment]);

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
          // Update logo if present and valid
          const logoUrl = headerData['Logo URL'];
          if (logoUrl && (logoUrl.startsWith('data:image') || logoUrl.startsWith('http'))) {
            setLogoUrl(logoUrl);
          }
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

      // Import styling information
      const stylingSheet = workbook.Sheets['Estilos'];
      if (stylingSheet) {
        const [stylingData] = XLSX.utils.sheet_to_json(stylingSheet);
        if (stylingData) {
          // Update dark mode
          if (typeof stylingData['Modo Oscuro'] === 'boolean') {
            onDarkModeToggle();
          }
          // Update primary color
          if (stylingData['Color Principal']) {
            document.documentElement.style.setProperty('--primary-color', stylingData['Color Principal']);
            document.documentElement.style.setProperty('--primary-color-hover', adjustColor(stylingData['Color Principal'], -20));
          }
        }
      }
    };
    reader.readAsArrayBuffer(file);
  }, [onTitleChange, onClientChange, onContactChange, onPaymentChange, onActivitiesChange, onDarkModeToggle, setLogoUrl]);

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    document.documentElement.style.setProperty('--primary-color', newColor);
    document.documentElement.style.setProperty('--primary-color-hover', adjustColor(newColor, -20));
  };

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
      <div className={styles.colorPickerContainer}>
        <input
          type="color"
          defaultValue="#0067a1"
          onChange={handleColorChange}
          className={styles.colorPicker}
          title="Cambiar color principal"
        />
      </div>
    </div>
  );
};

export default ExportButtons;