export interface ICategoryProducts {
  variants: {
    id: string;
    productId: string;
    weightValue: number;
    weightUnit: string;
    price: number;
    stock: number;
    createdAt: string;
    updatedAt: string;
  }[];
  id: string;
  name: string;
  slug: string;
  category: string;
  keywords: string;
  description: string;
  thumbnail: string;
  images: string[];
  icon: string | null;
  isMostPopular: boolean;
  isFeatured: boolean;
  isOffered: boolean;
  discount: number | null;
  offerStartDate: string | null;
  offerEndDate: string | null;
  originCountry: string;
  farmName: string;
  freshnessTags: string[];
  featuredBanner: string[];
  status: string;
  expireAt: string;
  popularityScore: number;
  createdAt: string;
  updatedAt: string;
  vendorId?: string | null;
  type?: "inventory" | "display" | null;
}
