export interface FilterOption {
  label: string;
  value: any;
  models?: any[];
}

export interface FilterItem {
  label: string;
  value: FilterOption | string | null;
  placeholder: string;
  options: FilterOption[];
  key: string;
}
