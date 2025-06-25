
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface SiteSettings {
  country: string;
  currency: string;
  language: string;
  flag: string;
}

export const currencySymbols: { [key: string]: string } = {
  INR: '₹',
  USD: '$',
  AED: 'د.إ',
  GBP: '£',
};

const defaultSettings: SiteSettings = {
  country: 'IN',
  currency: 'INR',
  language: 'ENG',
  flag: '🇮🇳',
};

interface SettingsContextType {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettingsState] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSettings = localStorage.getItem('siteSettings');
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          // Basic validation
          if(parsed.country && parsed.currency && parsed.language && parsed.flag) {
            return parsed;
          }
        }
      } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('siteSettings', JSON.stringify(settings));
    }
  }, [settings]);
  
  const setSettings = (newSettings: SiteSettings) => {
    setSettingsState(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
