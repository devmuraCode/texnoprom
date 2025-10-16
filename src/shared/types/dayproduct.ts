export interface IDayProduct {
  id: string;
  products: {
    id: string;
    discounted_price: string;
    created_at: string;
    updated_at: string;
    title: string;
    description: string;
    installment: string;
    mainimg: string;
    stock_quantity: number;
    discount_percent: string;
    package_code: string;
    code: string;
    price: string;
    vat_percent: string;
    category: string;
    brandcategory: string;
    brands: string;
  }[];
}
