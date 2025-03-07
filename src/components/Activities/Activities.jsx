import React from 'react';
import styles from './Activities.module.css';

const Activities = ({ activities, onActivitiesChange }) => {
  const handleAddActivity = () => {
    onActivitiesChange([
      ...activities,
      { name: '', quantity: 1, value: 0 }
    ]);
  };

  const handleRemoveActivity = (index) => {
    const newActivities = activities.filter((_, i) => i !== index);
    onActivitiesChange(newActivities);
  };

  const handleActivityChange = (index, field, value) => {
    const newActivities = activities.map((activity, i) => {
      if (i === index) {
        return { ...activity, [field]: value };
      }
      return activity;
    });
    onActivitiesChange(newActivities);
  };

  const calculateTotal = () => {
    return activities.reduce((total, activity) => {
      return total + (Number(activity.quantity) * Number(activity.value));
    }, 0);
  };

  return (
    <div className={styles.section}>
      <div className={styles.leftColumn}>Actividades Desempeñadas:</div>
      <div className={styles.details}>
        {activities.map((activity, index) => (
          <div key={index} className={styles.valueRow}>
            <input
              className={styles.nameInput}
              type="text"
              value={activity.name}
              placeholder="Nombre de la actividad"
              onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
            />
            <input
              className={styles.quantityInput}
              type="number"
              value={activity.quantity}
              onChange={(e) => handleActivityChange(index, 'quantity', e.target.value)}
            />
            <input
              className={styles.valueInput}
              type="number"
              value={activity.value}
              onChange={(e) => handleActivityChange(index, 'value', e.target.value)}
            />
            <button
              className={styles.removeButton}
              onClick={() => handleRemoveActivity(index)}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button className={styles.addButton} onClick={handleAddActivity}>
          Agregar Actividad
        </button>
        <div className={styles.total}>
          <strong>Total:</strong> ${calculateTotal().toLocaleString()} COP
        </div>
      </div>
    </div>
  );
};

export default Activities;