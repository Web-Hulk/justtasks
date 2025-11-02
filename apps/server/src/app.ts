import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { registrationController } from './controllers/registrationController';

const app = express()
const port = process.env.PORT

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/registration', registrationController);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
})