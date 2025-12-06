import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.development`, quiet: true });
import connectDB from './configs/db.js';
import routes from './routes/index.js';
import { shareStore } from './controllers/sellerControllers/shareStore.js';


const app = express();

//Public Routes
app.get('/store/:id', shareStore);

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server started on ${PORT}`));