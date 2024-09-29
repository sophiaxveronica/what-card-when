export type SpendingCategory = {
    category: string;
    bestCard: {
      company: string;
      type: string;
      percentage: number;
      finePrint: string;
    } | null;
  };

  export type Card = {
    company: string;
    type: string;
  };