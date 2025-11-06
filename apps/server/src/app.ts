import { limiter } from '@/middlewares/limiter';
import loginRoute from '@/routes/auth/loginRoute';
import logoutRoute from '@/routes/auth/logoutRoute';
import refreshRoute from '@/routes/auth/refreshRoute';
import registrationRoute from '@/routes/auth/registrationRoute';
import profileRoute from '@/routes/profileRoute';
import { swaggerSpec } from '@/services/swagger';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

const app = express()
const port = process.env.PORT

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser())

// Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/registration', limiter, registrationRoute);
app.use('/login', limiter, loginRoute);
app.use('/logout', limiter, logoutRoute);
app.use('/refresh', limiter, refreshRoute);

app.use('/profile', limiter, profileRoute);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
})