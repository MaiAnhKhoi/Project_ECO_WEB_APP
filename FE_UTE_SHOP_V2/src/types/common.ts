// Common types used across the application

export interface ErrorResponse {
  response?: {
    data?: string | unknown;
  };
}

export type EventHandler<T = HTMLElement> = (event: React.MouseEvent<T>) => void;

export type FormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => void;

export interface ClickOutsideEvent extends MouseEvent {
  target: Node;
}

export interface MetaData {
  title?: string;
  description?: string;
  keywords?: string;
  [key: string]: any;
}

export interface ProgressBarProps {
  max: number;
  children?: React.ReactNode;
}

export interface IntersectionEntry {
  isIntersecting: boolean;
  [key: string]: any;
}

export interface IntersectionObserver {
  observe: (element: Element) => void;
  unobserve: (element: Element) => void;
  disconnect: () => void;
}
