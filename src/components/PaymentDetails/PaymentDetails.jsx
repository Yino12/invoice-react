import React from 'react';
import styles from './PaymentDetails.module.css';
import { FaMoneyBill, FaCreditCard } from 'react-icons/fa';

const PaymentDetails = ({ payment, onPaymentChange }) => {
  const handleInputChange = (field, value) => {
    onPaymentChange({ ...payment, [field]: value });
  };

  return (
    <div className={styles.section}>
      <div className={styles.leftColumn}>Detalles de Pago:</div>
      <div className={styles.details}>
        <div className={styles.valueRow}>
          <strong><FaMoneyBill className={styles.icon} /> Forma de Pago:</strong>
          <select
            value={payment.method}
            onChange={(e) => handleInputChange('method', e.target.value)}
          >
            <option value="">Seleccionar...</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia Bancaria</option>
            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
          </select>
        </div>
        <div className={styles.valueRow}>
          <strong><FaCreditCard className={styles.icon} /> Medio de Pago:</strong>
          <input
            type="text"
            value={payment.details}
            onChange={(e) => handleInputChange('details', e.target.value)}
            placeholder="Detalles del medio de pago"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;