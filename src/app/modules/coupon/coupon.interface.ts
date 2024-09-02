export type TCoupon =  {
    coupon_code: string;
    description: string;
    discount_amount: number;
    discount_type: 'percentage' | 'fixed';
    valid_from: Date; 
    valid_until: Date; 
    minimum_purchase_amount: number;
    applicable_categories: string[]|'**';
    specific_customers:string[]|'**',
    usage_limit: number|'unlimited';
    terms_and_conditions: string;
  }
  