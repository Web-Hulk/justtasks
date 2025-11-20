import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { limiter } from './middlewares/limiter.js';
import activationStatusRoute from './routes/auth/activationStatusRoute.js';
import forgotPasswordRoute from './routes/auth/forgotPasswordRoute.js';
import generateActivationLinkRoute from './routes/auth/generateActivationLinkRoute.js';
import loginRoute from './routes/auth/loginRoute.js';
import logoutRoute from './routes/auth/logoutRoute.js';
import refreshRoute from './routes/auth/refreshRoute.js';
import registrationRoute from './routes/auth/registrationRoute.js';
import resetPasswordRoute from './routes/auth/resetPasswordRoute.js';
import verifyEmailRoute from './routes/auth/verifyEmailRoute.js';
import profileRoute from './routes/profileRoute.js';
import { swaggerSpec } from './services/swagger.js';

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser());

// Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/registration', limiter, registrationRoute);
app.use('/login', limiter, loginRoute);
app.use('/logout', limiter, logoutRoute);
app.use('/refresh', limiter, refreshRoute);
app.use('/verify-email', limiter, verifyEmailRoute);
app.use('/generate-activation-link', limiter, generateActivationLinkRoute);
app.use('/activation-status', activationStatusRoute);
app.use('/forgot-password', forgotPasswordRoute);
app.use('/reset-password', resetPasswordRoute);

app.use('/profile', limiter, profileRoute);

export default app;
