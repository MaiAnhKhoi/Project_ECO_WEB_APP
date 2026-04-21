// Blog types
export interface Blog {
  id: number;
  title: string;
  content?: string;
  excerpt?: string;
  author?: string;
  date?: string;
  image?: string;
  category?: string;
  tags?: string[];
  [key: string]: any;
}

