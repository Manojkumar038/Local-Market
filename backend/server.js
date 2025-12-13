import dotenv from 'dotenv';
dotenv.config({ path: '.env.development' }); 
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import routes from './routes/index.js';
import { shareStore } from './controllers/sellerControllers/shareStore.js';

const app = express();
app.set("trust proxy", 1);

connectDB();


app.use(cors());
app.use(express.json());


console.log("Backend test from github actions - 1");


app.get('/store/:id', shareStore);
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server started on ${PORT}`)
);
