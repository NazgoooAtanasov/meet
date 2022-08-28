import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import { assureAuth } from '../../middlewares';

const events = express.Router();

events.get('/events', async (_req: Request, res: Response) => {
    try {
        const events = await (
            res.locals.prisma as PrismaClient
        ).events.findMany();

        return res.status(200).json(events);
    } catch (err: any) {
        return res.status(400).json({ errorFields: err.meta?.target });
    }
});

events.get('/events/:id', async (req: Request, res: Response) => {
    const eventId = req.params.id;

    try {
        const event = await (
            res.locals.prisma as PrismaClient
        ).events.findFirst({
            where: { id: eventId },
            include: {
                users: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        return res.status(200).json(event);
    } catch (err: any) {
        return res.status(400).json({ errorFields: err.meta?.target });
    }
});

// this should be available only if logged in
events.post('/events', assureAuth, async (req: Request, res: Response) => {
    const { title, description } = req.body;

    try {
        const event = await (res.locals.prisma as PrismaClient).events.create({
            data: {
                title,
                description,
                user: {
                    connect: { id: res.locals.userId },
                },
            },
        });

        // adding the creator of the event to the events participants.
        await (res.locals.prisma as PrismaClient).userEvents.create({
            data: {
                userId: res.locals.userId,
                eventId: event.id,
            },
        });

        return res.status(201).json({ event });
    } catch (err: any) {
        console.log(err);
        return res.status(400).json({ errorFields: err.meta?.target });
    }
});

events.post('/events/:id/invite', async (req: Request, res: Response) => {
    const eventId = req.params.id;
    const { email } = req.body;

    try {
        const user = await (res.locals.prisma as PrismaClient).user.findFirst({
            where: { email },
        });

        if (!user)
            return res
                .status(400)
                .json({ errorMessage: 'User with that email does not exist' });

        await (res.locals.prisma as PrismaClient).userEvents.create({
            data: {
                eventId: eventId,
                userId: user.id,
            },
        });

        return res.status(201).json({});
    } catch (err: any) {
        return res.status(400).json({ errorFields: err.meta?.target });
    }
});

export default events;
