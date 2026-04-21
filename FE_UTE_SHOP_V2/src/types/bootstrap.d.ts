// Bootstrap type declarations
declare module "bootstrap" {
  export class Modal {
    constructor(element: HTMLElement | string, options?: { keyboard?: boolean });
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
    static getInstance(element: HTMLElement | string): Modal | null;
  }
  
  export class Offcanvas {
    constructor(element: HTMLElement | string, options?: any);
    show(): void;
    hide(): void;
    toggle(): void;
    static getInstance(element: HTMLElement | string): Offcanvas | null;
  }
  
  export class Popover {
    constructor(element: HTMLElement | string, options?: any);
    show(): void;
    hide(): void;
    toggle(): void;
  }
  
  export class Tooltip {
    constructor(element: HTMLElement | string, options?: any);
    show(): void;
    hide(): void;
    toggle(): void;
  }
}

declare module "bootstrap/dist/js/bootstrap.esm" {
  export * from "bootstrap";
}

declare module "bootstrap/dist/js/bootstrap" {
  export * from "bootstrap";
}

