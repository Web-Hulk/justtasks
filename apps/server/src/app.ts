import { limiter } from '@/middlewares/limiter';
import activationStatusRoute from '@/routes/auth/activationStatusRoute';
import generateActivationLinkRoute from '@/routes/auth/generateActivationLinkRoute';
import loginRoute from '@/routes/auth/loginRoute';
import logoutRoute from '@/routes/auth/logoutRoute';
import refreshRoute from '@/routes/auth/refreshRoute';
import registrationRoute from '@/routes/auth/registrationRoute';
import verifyEmailRoute from '@/routes/auth/verifyEmailRoute';
import profileRoute from '@/routes/profileRoute';
import { swaggerSpec } from '@/services/swagger';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

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

app.use('/profile', limiter, profileRoute);

export default app;
