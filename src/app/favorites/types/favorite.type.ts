export interface IFavoriteProductData {
  id: string;
  slug: string;
  category: string;
  name: string;
  thumbnail: string;
  price: number | null;
  weightValue: number | null;
  weightUnit: string | null;
  discount: number | null;
  isOffered: boolean;
  status: string;
  stock: number;
  varientId?: string;
}
