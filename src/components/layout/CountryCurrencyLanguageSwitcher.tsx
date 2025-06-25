"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const countries = [
  { code: 'IN', name: 'India', currency: 'INR', flag: '🇮🇳' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', flag: '🇦🇪' },
  { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
];

const currencies = [
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'GBP', 'name': 'British Pound' },
];

const languages = [
  { code: 'ENG', name: 'English' },
  { code: 'ARA', name: 'Arabic' },
  { code: 'HIN', name: 'Hindi' },
];

interface CountryCurrencyLanguageSwitcherProps {
  onApply: (settings: { country: string, currency: string, language: string }) => void;
  initialSettings: { country: string, currency: string, language: string };
}

export function CountryCurrencyLanguageSwitcher({ onApply, initialSettings }: CountryCurrencyLanguageSwitcherProps) {
  const [selectedCountry, setSelectedCountry] = useState(initialSettings.country);
  const [selectedCurrency, setSelectedCurrency] = useState(initialSettings.currency);
  const [selectedLanguage, setSelectedLanguage] = useState(initialSettings.language);

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country.code);
      setSelectedCurrency(country.currency); // Auto-select currency
    }
  };
  
  const handleApply = () => {
    onApply({
      country: selectedCountry,
      currency: selectedCurrency,
      language: selectedLanguage,
    });
  };

  return (
    <div className="p-4 space-y-4 w-full max-w-xs bg-white rounded-lg shadow-xl">
      <div className="space-y-1">
        <Label htmlFor="country-select" className="text-xs text-muted-foreground">Country</Label>
        <Select value={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger id="country-select" className="h-11">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map(country => (
              <SelectItem key={country.code} value={country.code}>
                <span className="mr-2">{country.flag}</span> {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="currency-select" className="text-xs text-muted-foreground">Currency</Label>
        <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
          <SelectTrigger id="currency-select" className="h-11">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map(currency => (
              <SelectItem key={currency.code} value={currency.code}>
                <span className="font-semibold mr-2">{currency.code}</span> {currency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="language-select" className="text-xs text-muted-foreground">Language</Label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger id="language-select" className="h-11">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="font-semibold mr-2">{lang.code}</span>{lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={handleApply} className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90">
        Apply
      </Button>
    </div>
  );
}
