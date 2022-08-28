import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
const users = express.Router();

users.get('/users/:id', async (req: Request, res: Response) => {
    const id: string = req.params.id;
    try {
        const user = await (res.locals.prisma as PrismaClient).user.findFirst({
            where: {
                id: id,
            },
            select: {
                firstName: true,
                lastName: true,
                email: true,
            },
        });

        if (!user) res.status(404).json({});

        res.status(200).json(user);
    } catch (err: any) {
        res.status(400).json({ errorFields: err.meta });
    }
});

users.post('/users', async (req: Request, res: Response) => {
    const body = req.body;

    const emailUsed = await (res.locals.prisma as PrismaClient).user.findFirst({
        where: { email: body.email },
    });

    if (emailUsed) {
        return res.status(400).json({
            errorFields: ['email'],
            errorMessage: 'Email already in use',
        });
    }

    try {
        const user = await res.locals.prisma.user.create({
            data: { ...body },
        });

        return res.status(201).json({ id: user?.id });
    } catch (err: any) {
        return res.status(400).json({ errorFields: err.meta?.target });
    }
});

users.get('/users/:id/locations', async (req: Request, res: Response) => {
    const userId: string = req.params.id;

    try {
        const coordinates = await (
            res.locals.prisma as PrismaClient
        ).coordinates.findMany({
            where: {
                userId,
            },
        });

        return res.status(200).json(coordinates);
    } catch (err: any) {
        return res.status(400).json({ errorFields: err.meta?.target });
    }
});

users.post('/users/:id/locations', async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    const coordinates = req.body;

    try {
        const user = await (res.locals.prisma as PrismaClient).user.findFirst({
            where: { id: userId },
        });

        if (user) {
            await (res.locals.prisma as PrismaClient).user.update({
                where: { id: userId },
                data: {
                    locations: {
                        create: coordinates,
                    },
                },
                include: {
                    locations: true,
                },
            });

            return res.status(201).json({});
        }

        return res
            .status(400)
            .json({ errorMessage: 'User with that ID does not exits' });
    } catch (err: any) {
        return res.status(400).json({ errorFields: err.meta?.target });
    }
});

export default users;
