import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import ClientDetails from './components/ClientDetails/ClientDetails';
import Activities from './components/Activities/Activities';
import ContactDetails from './components/ContactDetails/ContactDetails';
import PaymentDetails from './components/PaymentDetails/PaymentDetails';
import ExportButtons from './components/ExportButtons/ExportButtons';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [title, setTitle] = useState('COTIZACIÓN #41 - VINSER SOLUCIONES');
  const [client, setClient] = useState({
    name: 'Vinser Soluciones',
    project: 'Servicio de diseño gráfico y web'
  });
  const [activities, setActivities] = useState([
    { name: 'Diseño de Logo', quantity: 1, value: 72000 },
    { name: 'Desarrollo Web', quantity: 1, value: 84000 }
  ]);

  const [contact, setContact] = useState({
    phone: '',
    email: '',
    address: ''
  });

  const [payment, setPayment] = useState({
    method: '',
    details: ''
  });

  useEffect(() => {
    // Load saved data from localStorage
    const savedTitle = localStorage.getItem('headerText');
    if (savedTitle) setTitle(savedTitle);

    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) setActivities(JSON.parse(savedActivities));

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) setIsDarkMode(JSON.parse(savedDarkMode));
  }, []);

  useEffect(() => {
    // Save data to localStorage when it changes
    localStorage.setItem('headerText', title);
    localStorage.setItem('activities', JSON.stringify(activities));
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));

    // Update body class for dark mode
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [title, activities, isDarkMode]);

  return (
    <div className={`container ${isDarkMode ? 'dark-mode' : ''}`} id="invoice-container">
      <Header title={title} onTitleChange={setTitle} />
      <ClientDetails client={client} onClientChange={setClient} />
      <Activities activities={activities} onActivitiesChange={setActivities} />
      <ContactDetails contact={contact} onContactChange={setContact} />
      <PaymentDetails payment={payment} onPaymentChange={setPayment} />
      <ExportButtons
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        isDarkMode={isDarkMode}
        data={{ activities }}
        title={title}
        client={client}
        contact={contact}
        payment={payment}
        onTitleChange={setTitle}
        onClientChange={setClient}
        onContactChange={setContact}
        onPaymentChange={setPayment}
        onActivitiesChange={setActivities}
      />
    </div>
  );
}

export default App;
