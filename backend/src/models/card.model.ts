import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cardSchema = new Schema({
  company: { type: String, required: true },
  card: { type: String, required: true },
  annual_fee_usd: { type: Number, required: true },
  rewards: [{
    category: String,
    cash_back_pct: { type: Number, required: false},    
    points_per_dollar: { type: Number, required: false},
    fine_print: String,
    fine_print_source: String,
  }]
}, { collection: 'cards' , dbName: 'wcw-db' });

const CreditCardData = mongoose.model('CreditCardData', cardSchema, 'cards');

export { CreditCardData };