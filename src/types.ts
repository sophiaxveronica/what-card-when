export type CategoryWithBestCreditCard = {
    category: string;
    bestCards: BestCard[] | null;
  };

  // Define the BestCard type
type BestCard = {
  company: string;
  card_name: string;
  cash_back_pct?: number; // Optional property
  points_per_dollar?: number; // Optional property
  fine_print: string;
};