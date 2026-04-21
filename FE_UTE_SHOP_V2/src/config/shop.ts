/**
 * Shop Configuration
 * Centralized configuration for shop name, logo, languages, and currencies
 */

import shopSettingApi from "@/services/shopsettingApi";
import type { ShopConfig, Language, Currency } from "@/types/shop";
const res = await shopSettingApi.getShopSettings();

export const shopConfig: ShopConfig = {
  name: {
    en: "UTE - University of Technology and Education",
    vi: "UTE - Đại học Sư phạm Kỹ thuật",
  },
  logo: {
    src: res.data.logoUrl,
    alt: "logo",
    width: 148,
    height: 100,
  },
  defaultTitle: {
    en: "UTE - University of Technology and Education",
    vi: "UTE - Đại học Sư phạm Kỹ thuật",
  },
  languages: [
    { id: "en", label: "English", labelVi: "Tiếng Anh" },
    { id: "vi", label: "Vietnamese", labelVi: "Tiếng Việt" },
  ],
  currencies: [
    {
      value: "us",
      thumbnail: "/images/country/us.png",
      text: "United States (USD $)",
      textVi: "Hoa Kỳ (USD $)",
      selected: false,
    },
    {
      value: "fr",
      thumbnail: "/images/country/fr.png",
      text: "France (EUR €)",
      textVi: "Pháp (EUR €)",
    },
    {
      value: "ger",
      thumbnail: "/images/country/ger.png",
      text: "Germany (EUR €)",
      textVi: "Đức (EUR €)",
    },
    {
      value: "vn",
      thumbnail: "/images/country/vn.png",
      text: "Vietnam (VND ₫)",
      textVi: "Việt Nam (VND ₫)",
      selected: true,
    },
  ],
  defaultLanguage: "vi",
  defaultCurrency: "vn",
  contact: {
    email: "contact@ute.edu.vn",
    phone: "(028) 3722 1234",
    address: "1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP.HCM",
  },
};

/**
 * Get shop name by language
 */
export const getShopName = (lang: string = shopConfig.defaultLanguage): string => {
  return lang === "vi" ? shopConfig.name.vi : shopConfig.name.en;
};

/**
 * Get default title by language
 */
export const getDefaultTitle = (lang: string = shopConfig.defaultLanguage): string => {
  return lang === "vi" ? shopConfig.defaultTitle.vi : shopConfig.defaultTitle.en;
};

/**
 * Get language options
 */
export const getLanguageOptions = (lang: string = shopConfig.defaultLanguage): Language[] => {
  return shopConfig.languages.map((language) => ({
    ...language,
    label: lang === "vi" ? language.labelVi : language.label,
  }));
};

/**
 * Get currency options
 */
export const getCurrencyOptions = (lang: string = shopConfig.defaultLanguage): Currency[] => {
  return shopConfig.currencies.map((currency) => ({
    ...currency,
    text: lang === "vi" ? currency.textVi : currency.text,
  }));
};

/**
 * Create page metadata with default title
 */
export const createPageMetadata = (pageTitle: string, lang: string = shopConfig.defaultLanguage) => {
  const defaultTitle = getDefaultTitle(lang);
  return {
    title: `${pageTitle} || ${defaultTitle}`,
    description: defaultTitle,
  };
};

/**
 * Get contact email
 */
export const getContactEmail = (): string => {
  return shopConfig.contact.email;
};

/**
 * Get contact phone
 */
export const getContactPhone = (): string => {
  return shopConfig.contact.phone || "";
};

/**
 * Get contact address
 */
export const getContactAddress = (): string => {
  return shopConfig.contact.address || "";
};

