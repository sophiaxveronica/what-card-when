import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const cardType = new Schema({
  company: { type: String, required: true },
  type: { type: String, required: true },
  cashbackCategories: [{
    category: String,
    percentage: Number
  }]
}, { collection: 'cardTypes' });

const Card = mongoose.model('Card', cardType);

export default Card;