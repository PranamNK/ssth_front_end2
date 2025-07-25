
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    login: 'Login',
    register: 'Register',
    forgotUserId: 'Forgot User ID',
    forgotPassword: 'Forgot Password',
    userId: 'User ID',
    password: 'Password',
    name: 'Name',
    phone: 'Phone Number',
    email: 'Email',
    organization: 'Organization',
    role: 'Role',
    submit: 'Submit',
    // Dashboard
    dashboard: 'Dashboard',
    uploadDocument: 'Upload Document',
    addTeammate: 'Add Teammate',
    documents: 'Documents',
    teammates: 'Teammates',
    logout: 'Logout',
    // Common
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
  },
  kn: {
    // Auth (placeholder Kannada)
    login: 'ಲಾಗಿನ್',
    register: 'ನೋಂದಣಿ',
    forgotUserId: 'ಬಳಕೆದಾರ ID ಮರೆತಿದ್ದೇನೆ',
    forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೇನೆ',
    userId: 'ಬಳಕೆದಾರ ID',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    name: 'ಹೆಸರು',
    phone: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    email: 'ಇಮೇಲ್',
    organization: 'ಸಂಸ್ಥೆ',
    role: 'ಪಾತ್ರ',
    submit: 'ಸಲ್ಲಿಸಿ',
    // Dashboard
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    uploadDocument: 'ಡಾಕ್ಯುಮೆಂಟ್ ಅಪ್‌ಲೋಡ್',
    addTeammate: 'ತಂಡದ ಸದಸ್ಯ ಸೇರಿಸಿ',
    documents: 'ಡಾಕ್ಯುಮೆಂಟ್‌ಗಳು',
    teammates: 'ತಂಡದ ಸದಸ್ಯರು',
    logout: 'ಲಾಗ್ಔಟ್',
    // Common
    cancel: 'ರದ್ದುಗೊಳಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    save: 'ಉಳಿಸಿ',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'kn' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
