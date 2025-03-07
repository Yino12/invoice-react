import React from 'react';
import styles from './ClientDetails.module.css';

const ClientDetails = ({ client, onClientChange }) => {
  const handleInputChange = (field, value) => {
    onClientChange({ ...client, [field]: value });
  };

  return (
    <div className={styles.section}>
      <div className={styles.leftColumn}>Datos del Cliente:</div>
      <div className={styles.details}>
        <div className={styles.valueRow}>
          <strong>Nombre:</strong>
          <input
            type="text"
            value={client.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>
        <div className={styles.valueRow}>
          <strong>Proyecto:</strong>
          <input
            type="text"
            value={client.project}
            onChange={(e) => handleInputChange('project', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;