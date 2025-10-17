export interface IHitProductResponse {
  id: string;
  products: IProduct[];
}

export interface IProduct {
  id: string;
  discounted_price: number;
  installment: number;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  mainimg: string;
  stock_quantity: number;
  discount_percent: string;
  seo_key: string;
  title_key: string;
  slug: string;
  package_code: string;
  code: string;
  price: string;
  vat_percent: string;
  category: string;
  brandcategory: string;
  brands: string;
}
