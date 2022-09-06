import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const auth = express.Router();

auth.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await (res.locals.prisma as PrismaClient).user.findFirst({
            where: { email },
        });

        if (!user)
            return res.status(404).json({
                errorMessage: 'User with that email does not exist.',
            });

        const passwordMatch: boolean = await bcrypt.compare(
            password,
            user.hashedPassword
        );

        if (!passwordMatch)
            return res
                .status(401)
                .json({ errorMessage: 'Passwords do not match.' });

        const token: string = jwt.sign(
            { data: { userId: user.id } },
            process.env.JWT_SECRET!,
            {
                expiresIn: '1y',
            }
        );

        return res.status(200).json({ token });
    } catch (err: any) {
        return res.status(400).json({
            errorFields: err.meta?.target,
            errorMessage: 'Error occured while logging in.',
        });
    }
});

export default auth;
