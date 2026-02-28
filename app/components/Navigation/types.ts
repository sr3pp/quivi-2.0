export type NavigationChild = {
  stem?: string;
  path: string;
  title: string;
  order?: number;
};

export type NavigationItemModel = {
  title: string;
  path: string;
  stem?: string;
  order?: number;
  active?: boolean;
  children?: NavigationChild[];
};
