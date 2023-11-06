import { BreakpointObject } from "./breakpointObject";

export interface Slide {
  title: string;
  description: string;
  link: string;
  background: BreakpointObject;
  video?: {
    url: string;
  };
}
