export type SpendingCategory = {
    category: string;
    bestCard: {
      company: string;
      type: string;
      percentage: number;
    } | null;
  };

  export type Card = {
    company: string;
    type: string;
  };