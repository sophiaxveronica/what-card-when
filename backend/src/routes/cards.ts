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

interface DetailedCard {
  company: string;
  card: string;
  finePrint: string;
}

router.route('/filter').post(async (req, res) => {
  const { cards, categories }: { cards: CardType[], categories: string[] } = req.body;
  const queries = cards.map((card: CardType) => ({ company: card.company, type: card.type, finePrint: card.finePrint }));

  try {
    const cardTypes = await Card.find({ $or: queries });

    const bestCards = categories.map(category => {
      let bestCard = null;
      let highestPercentage = 0;

      cardTypes.forEach(card => {
        const cashbackCategory = card.cashbackCategories.find(c => c.category === category);
        if (cashbackCategory && cashbackCategory?.percentage && cashbackCategory?.percentage > highestPercentage) {
          highestPercentage = cashbackCategory.percentage;
          bestCard = {
            company: card.company,
            type: card.type,
            percentage: cashbackCategory.percentage,
            finePrint: cashbackCategory.finePrint,
          };
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