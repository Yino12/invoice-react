import React from 'react';
import styles from './ContactDetails.module.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactDetails = ({ contact, onContactChange }) => {
  const handleInputChange = (field, value) => {
    onContactChange({ ...contact, [field]: value });
  };

  return (
    <div className={styles.section}>
      <div className={styles.leftColumn}>Información de Contacto:</div>
      <div className={styles.details}>
        <div className={styles.valueRow}>
          <strong><FaPhone className={styles.icon} /> Teléfono:</strong>
          <input
            type="tel"
            value={contact.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Número de teléfono"
          />
        </div>
        <div className={styles.valueRow}>
          <strong><FaEnvelope className={styles.icon} /> Email:</strong>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Correo electrónico"
          />
        </div>
        <div className={styles.valueRow}>
          <strong><FaMapMarkerAlt className={styles.icon} /> Dirección:</strong>
          <input
            type="text"
            value={contact.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Dirección de contacto"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;