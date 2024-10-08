import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cardType = new Schema({
  company: { type: String, required: true },
  type: { type: String, required: true },
  cashbackCategories: [{
    category: String,
    percentage: Number,
    finePrint: String,
  }]
}, { collection: 'cardTypes' , dbName: 'test' });

// New schema for the 'cards' collection
const cardSchema = new Schema({
  company: { type: String, required: true },
  card: { type: String, required: true },
  annual_fee_usd: { type: Number, required: true },
  rewards: [{
    category: String,
    cash_back_pct: Number,
    fine_print: String,
    fine_print_source: String,
  }]
}, { collection: 'cards' , dbName: 'wcw-db' });

const Card = mongoose.model('Card', cardType, 'cardTypes');
const DetailedCard = mongoose.model('DetailedCard', cardSchema, 'cards');

export { Card, DetailedCard };