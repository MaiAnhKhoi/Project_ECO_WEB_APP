export interface CategoryItem {
  id: number;
  parentId: number | null; 
  name: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number | null;
}
