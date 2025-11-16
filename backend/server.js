import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.development`, quiet: true });
import connectDB from './configs/db.js';
import routes from './routes/index.js';

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));