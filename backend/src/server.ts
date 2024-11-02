import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cardsRouter from './routes/cards';
import emailsRouter from './routes/emails';
import { CreditCardData } from './models/card.model';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/api/cards', cardsRouter);
app.use('/api/emails', emailsRouter);
app.use(express.static('../dist'))

console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI as string);
mongoose.set('debug', true);

const connection = mongoose.connection;
connection.once('open', async () => {
  console.log('MongoDB database connection established successfully');

  console.log("Printing collections:")
  const collections = await mongoose.connection.listCollections()
  console.log(JSON.stringify(collections));
  console.log("Printing databases:")
  const databases = await mongoose.connection.listDatabases()
  console.log(JSON.stringify(databases));

  console.log("Printing all Card data:")
  const allData = await CreditCardData.find({});
  console.log(JSON.stringify(allData));



});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});