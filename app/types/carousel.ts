export interface CarouselCta {
  label: string;
  to?: string;
  href?: string;
  target?: string;
  color?: "primary" | "secondary";
  variant?: "solid" | "outline" | "ghost";
}

export interface ResponsiveImage {
  desktop?: string;
  mobile?: string;
  alt?: string;
}
