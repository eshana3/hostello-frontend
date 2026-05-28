export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  hostel: string;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  negotiable: boolean;
  seller: {
    id: string;
    name: string;
    hostel: string;
    avatar?: string;
  };
  createdAt: string;
  sold: boolean;
  views: number;
}

export interface Hostel {
  id: string;
  name: string;
  type: "KP" | "QC";
}

export interface HostelGroup {
  type: string;
  label: string;
  hostels: Hostel[];
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export interface ProductFilters {
  category?: string;
  hostel?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sold?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}
