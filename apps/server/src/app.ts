import cors from 'cors';
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import loginRoute from './routes/loginRoute';
import profileRoute from './routes/profileRoute';
import registrationRoutes from './routes/registrationRoutes';

const app = express()
const port = process.env.PORT

// Move to services or other related folder
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	message: {
		status: 429,
		error: 'TooManyRequests',
		message: 'Too many requests from this IP, please try again later.'
	}
})

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(helmet());

// Routes
app.use('/registration', limiter, registrationRoutes);
app.use('/login', limiter, loginRoute);
app.use('/profile', limiter, profileRoute);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
})