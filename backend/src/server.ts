import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cardsRouter from './routes/cards';
import emailsRouter from './routes/emails';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/api/cards', cardsRouter);
app.use('/api/emails', emailsRouter);
app.use(express.static('../dist'))

mongoose.connect(process.env.MONGODB_URI as string);
mongoose.set('debug', true);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});