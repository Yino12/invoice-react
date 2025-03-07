import React from 'react';
import styles from './Header.module.css';

const Header = ({ title, onTitleChange, logoUrl, setLogoUrl }) => {
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoSection}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className={styles.logo} />
        ) : (
          <label className={styles.uploadLabel}>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className={styles.fileInput}
            />
            <span>Click to upload logo</span>
          </label>
        )}
      </div>
      <div 
        className={styles.header} 
        contentEditable="true"
        onBlur={(e) => onTitleChange(e.target.innerText)}
        suppressContentEditableWarning={true}
      >
        {title}
      </div>
    </div>
  );
};

export default Header;