/**
 * Shop configuration types
 */
export interface Language {
  id: string;
  label: string;
  labelVi: string;
}

export interface Currency {
  value: string;
  thumbnail: string;
  text: string;
  textVi: string;
  selected?: boolean;
}

export interface ShopConfig {
  name: {
    en: string;
    vi: string;
  };
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  defaultTitle: {
    en: string;
    vi: string;
  };
  languages: Language[];
  currencies: Currency[];
  defaultLanguage: string;
  defaultCurrency: string;
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
}

