export interface CarouselCta {
  label: string;
  to?: string;
  target?: string;
  color?: "primary" | "secondary";
  variant?: "solid" | "outline" | "ghost";
}

export interface ResponsiveImage {
  sm: string;
  md?: string;
  lg?: string;
}
