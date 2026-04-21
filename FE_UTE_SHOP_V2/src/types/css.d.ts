// CSS and SCSS module declarations
declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.scss" {
  const content: string;
  export default content;
}

declare module "*.sass" {
  const content: string;
  export default content;
}

// Specific module declarations
declare module "photoswipe/dist/photoswipe.css";
declare module "rc-slider/assets/index.css";


