// src/types/product-card.types.ts
export interface IUnifiedProduct {
  id: string;
  slug: string;
  category: string;
  name: string;
  thumbnail: string;
  price: number | null;
  weightValue: number | null;
  weightUnit: string | null;
  discount?: number | null;
  isOffered?: boolean;
  isMostPopular?: boolean;
  status?: string;
  stock: number;
  vendorId?: string | null;
  type?: "inventory" | "display" | null;
  varientId?: string;
}
