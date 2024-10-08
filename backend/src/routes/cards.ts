import express from 'express';
import { Card, DetailedCard } from '../models/card.model';

const router = express.Router();

interface CardType {
  company: string;
  type: string;
  finePrint: string;
}

router.route('/companies').get(async (req, res) => {
  try {
    const companies = await Card.distinct('company');
    res.json(companies);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/companies2').get(async (req, res) => {
  try {
    const detailedCards = await DetailedCard.distinct('company');
    console.log('Distinct companies:', detailedCards); // Log the result
    res.json(detailedCards);
  } catch (err) {
    console.error('Error fetching distinct companies:', err); // Log the error
    res.status(400).json('Error: ' + err);
  }
});

router.route('/categories').get(async (req, res) => {
  try {
    const categories = await DetailedCard.distinct('rewards.category');
    console.log('Distinct categories:', categories); // Log the result
    res.json(categories);
  } catch (err) {
    console.error('Error fetching distinct categories:', err); // Log the error
    res.status(400).json('Error: ' + err);
  }
});

router.route('/options/:company').get(async (req, res) => {
  const { company } = req.params;
  try {
    const options = await Card.find({ company }).distinct('type');
    res.json(options);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/options2/:company').get(async (req, res) => {
  const { company } = req.params;
  try {
    console.log(company);
    const options = await DetailedCard.find({ company }).distinct('card');
    console.log('Distinct options for type:', options); // Log the result
    res.json(options);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/').get((req, res) => {
  Card.find()
    .then(cards => res.json(cards))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/2').get((req, res) => {
  DetailedCard.find()
    .then(cards => res.json(cards))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const newCard = new Card(req.body);

  newCard.save()
    .then(() => res.json('Card added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/filter').post(async (req, res) => {
  const { cards, categories }: { cards: CardType[], categories: string[] } = req.body;
  const queries = cards.map((card: CardType) => ({ company: card.company, type: card.type, finePrint: card.finePrint }));

  try {
    // Fetch detailed cards based on the queries
    const detailedCards = await DetailedCard.find({ $or: queries });

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