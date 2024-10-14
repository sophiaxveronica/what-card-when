export type CategoryWithBestCreditCard = {
    category: string;
    best_card: {
      company: string;
      card_name: string;
      cash_back_pct: number;
      points_per_dollar?: number;
      fine_print?: string,
      fine_print_source: string,    
    } | null;
  };