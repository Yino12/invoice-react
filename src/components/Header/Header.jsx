import React from 'react';
import styles from './Header.module.css';

const Header = ({ title, onTitleChange }) => {
  return (
    <div 
      className={styles.header} 
      contentEditable="true"
      onBlur={(e) => onTitleChange(e.target.innerText)}
      suppressContentEditableWarning={true}
    >
      {title}
    </div>
  );
};

export default Header;