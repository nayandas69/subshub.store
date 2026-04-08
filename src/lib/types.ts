/**
 * Shared Type Definitions for SubsHub
 */

export interface Plan {
  id: string;
  tier: string;
  price: number;
  duration: string;
  originalPrice?: number;
  [key: string]: unknown;
}

export interface Product {
  id: string;
  productId?: string;
  category: string;
  name: string;
  description: string;
  badge?: string | null;
  icon: string;
  iconBg: string;
  iconColor: string;
  plans: Plan[];
  features: string[];
  [key: string]: unknown;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  order?: number;
}

export interface Badge {
  _id: string;
  name: string;
  colorClass: string;
}

export interface Settings {
  flashSaleEnabled: boolean;
  flashSaleEndTime: Date | null;
  currency: string;
  popupEnabled: boolean;
  popupText: string;
  popupDelay: number;
}
