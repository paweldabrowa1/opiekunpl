export interface Contact {
  email: string;
  phoneNumber: string;

  localization: Localization;
}

export interface Localization {
  postalCode: string;
  city: string;
  street: string;
  countryCode: string;
}