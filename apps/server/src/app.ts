import cors from 'cors';
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import registrationRoutes from './routes/registrationRoutes';

const app = express()
const port = process.env.PORT

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));

// Routes
app.use(registrationRoutes);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
})