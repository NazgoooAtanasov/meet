import express, { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import prisma from './prisma';
import users from './api/users';
import events from './api/events';
import auth from './api/auth';

dotenv.config();
const app = express();
const prismaClient = prisma();

const context = (req: Request, res: Response, next: NextFunction) => {
    res.locals.prisma = prismaClient;

    const authorization: string | undefined = req.header('Authorization');

    if (authorization) {
        const [_bearer, tokenString] = authorization.split(' ');
        const decodedToken: any = jwt.verify(
            tokenString,
            process.env.JWT_SECRET!
        );

        res.locals.userId = decodedToken.userId;
    }

    next();
};

app.use(context);
app.use(express.json());

app.use('/api/v1', users);
app.use('/api/v1', events);
app.use('/api/v1', auth);

app.listen(process.env.PORT || '8081', () => {
    console.log(`Server started on ${process.env.PORT || '8081'}`);
});
