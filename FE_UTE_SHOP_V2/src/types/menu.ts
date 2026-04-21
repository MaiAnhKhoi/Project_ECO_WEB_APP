// Menu types
export interface MenuLink {
  href: string;
  text: string;
  href2?: string;
  label?: string | {
    text: string;
    className?: string;
  };
}

export interface MenuItem {
  heading: string;
  links: MenuLink[];
}

export interface DemoItem {
  href: string;
  imageSrc: string;
  alt: string;
  width: number;
  height: number;
  name: string;
  labels: string[];
}

