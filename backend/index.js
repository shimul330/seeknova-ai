
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import userRoutes from './routes/user.route.js'
import promptRoutes from './routes/prompt.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URI;

//middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'https://seeknova-ai.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
console.log("Allowed origin:", process.env.FRONTEND_URL);

mongoose.connect(MONGO_URL)
    .then(res => console.log("Connected to Mongodb"))
    .catch(err => console.log("DB Error", err))


//routes
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/seeknovaai', promptRoutes)


//test api 
app.get('/', (req, res) => {
    res.send('Hello ki khobor!')
})

app.listen(port, () => {
    console.log(`seekNova app listening on port ${port}`)
})
