export interface FilterOption {
  label: string;
  value: string | number;
  models?: Array<{ _id: string; name: string }>;
}

export interface FilterItem {
  label: string;
  value: FilterOption | string | null;
  placeholder: string;
  options: FilterOption[];
  key: string;
}
