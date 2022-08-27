import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import users from './api/users';
import prisma from './prisma';

dotenv.config();
const app = express();
const prismaClient = prisma();

const context = (_req: Request, res: Response, next: NextFunction) => {
    res.locals.prisma = prismaClient;
    next();
};

app.use(context);
app.use(express.json());
app.use('/api/v1', users);

app.listen(process.env.PORT || '8081', () => {
    console.log('running');
});
