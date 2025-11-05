import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import loginRoute from './routes/loginRoute';
import profileRoute from './routes/profileRoute';
import refreshRoute from './routes/refreshRoute';
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
app.use(cookieParser())

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JUSTTASKS API',
      version: '1.0.0',
      description: 'API documentation for JUSTTASKS',
    },
  },
  apis: ['./src/routes/*.ts'], // Path to your route files for JSDoc comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/registration', limiter, registrationRoutes);
app.use('/login', limiter, loginRoute);
app.use('/refresh', limiter, refreshRoute);

app.use('/profile', limiter, profileRoute);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
})