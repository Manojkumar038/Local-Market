import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js'
import dotenv from 'dotenv';


const app = express();
app.use(cors());
app.use(express.json());
dotenv.config({ path: `.env.development` , quite: true});

connectDB();


app.get('/', (req, res) => {
    res.json("Hello World!!");
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));