import express from 'express';
import cors from 'cors';
import Airtable from 'airtable';
import dotenv from 'dotenv';
import cardsRouter from './routes/cards';

dotenv.config();

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());
app.use('/api/cards', cardsRouter);

Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY,
    endpointUrl: 'https://api.airtable.com',
  });
  const base = Airtable.base(process.env.AIRTABLE_BASE_ID!);
  
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
  
  export { base };