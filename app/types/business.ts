export interface BusinessBankAccount {
  bank_name: string;
  account_number: string;
  CLABE?: string;
}

export interface BusinessSocial {
  label: string;
  url: string;
  icon?: string;
}

export interface BusinessConfig {
  address: Record<string, string>;
  bank_accounts: BusinessBankAccount[];
  social: BusinessSocial[];
}
