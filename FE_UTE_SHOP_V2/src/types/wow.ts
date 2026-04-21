// WOW.js types
export interface WOWOptions {
  boxClass?: string;
  animateClass?: string;
  offset?: number;
  mobile?: boolean;
  live?: boolean;
  callback?: ((box: HTMLElement) => void) | null;
  scrollContainer?: string | HTMLElement | null;
}

