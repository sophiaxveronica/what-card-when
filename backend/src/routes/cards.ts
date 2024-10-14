import express from 'express';
import { CreditCardData } from '../models/card.model';

const router = express.Router();

type CreditCardApiType = {
  company: string;
  type: string;
  finePrint: string;
}

router.route('/companies').get(async (req, res) => {
  try {
    const detailedCards :string[] = await CreditCardData.distinct('company');
    res.json(detailedCards);
  } catch (err) {
    console.error('Error fetching distinct companies:', err);
    res.status(400).json('Error: ' + err);
  }
});

router.route('/categories').get(async (req, res) => {
  try {
    const categories :string[] = await CreditCardData.distinct('rewards.category');
    res.json(categories);
  } catch (err) {
    console.error('Error fetching distinct categories:', err);
    res.status(400).json('Error: ' + err);
  }
});

router.route('/options/:company').get(async (req, res) => {
  const { company } = req.params;
  try {
    const options = await CreditCardData.find({ company }).distinct('card');
    res.json(options);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/').get((req, res) => {
  CreditCardData.find()
    .then(cards => res.json(cards))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const newCard = new CreditCardData(req.body);

  newCard.save()
    .then(() => res.json('Card added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/filter').post(async (req, res) => {
  const { cards, categories }: { cards: CreditCardApiType[], categories: string[] } = req.body;
  console.log("FILTER");
  console.log(cards);
  const queries = cards.map((card: CreditCardApiType) => ({ company: card.company, type: card.type, finePrint: card.finePrint }));

  try {
    // Fetch detailed cards based on the queries
    const detailedCards = await CreditCardData.find({ $or: queries });
    console.log("Fetched cards:", detailedCards);

    const bestCards = categories.map(category => {
      let bestCard = null;
      let highestValue = 0; // This will hold the highest value (cashback or points)

      detailedCards.forEach(card => {
        // Assuming cashback and points are stored in the rewards array
        const reward = card.rewards.find(r => r.category === category);
        if (reward) {
          const cashBackValue = reward.cash_back_pct || 0; // Assuming cash_back_pct is the cashback percentage
          const pointsValue = reward.points_per_dollar || 0; // Assuming points_per_dollar is the points value

          // Determine the higher value between cashback and points
          const higherValue = Math.max(cashBackValue, pointsValue);

          if (higherValue > highestValue) {
            highestValue = higherValue;
            bestCard = {
              company: card.company,
              type: card.card, // Assuming 'card' is the field for the card name
              value: higherValue, // This will hold the higher value (cashback or points)
              finePrint: reward.fine_print, // Assuming fine_print is available in the reward
            };
          }
        }
      });

      return { category, bestCard };
    });

    res.json(bestCards);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

export default router;