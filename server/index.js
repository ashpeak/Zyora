import express from 'express';
import cors from 'cors';
import "dotenv/config";
import checkout from './routes/checkout.js';
import ngrok from 'ngrok';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', checkout);

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'API is running',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});