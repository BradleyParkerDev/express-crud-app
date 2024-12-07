import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors'
import createError from 'http-errors';
import indexRouter from './routes/index';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import { auth } from './lib/auth';

// App Creation
const app = express();

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth.handleSessionCookies) // Authorization Middleware

// Routes
app.use('/', indexRouter);
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response) => {
	res.status(err.status || 500);
	res.json({
	message: err.message,
	error: req.app.get('env') === 'development' ? err : {}
	});
});

export default app;
