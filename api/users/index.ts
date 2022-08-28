import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import { defaultTextField, emailSchema, passwordSchema } from '../../schemas';
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
    const { firstName, lastName, email, password } = req.body;

    const validations = [
        {
            name: 'First name',
            validation: defaultTextField.safeParse(firstName),
        },
        { name: 'Last name', validation: defaultTextField.safeParse(lastName) },
        { name: 'Email', validation: emailSchema.safeParse(email) },
        { name: 'Password', validation: passwordSchema.safeParse(password) },
    ].reduce((accumulator, current) => {
        if (!current.validation.success) {
            const errors = current.validation.error.format()._errors.join(' ');
            accumulator.push({
                name: current.name,
                errors,
            });
        }

        return accumulator;
    }, [] as { name: string; errors: string }[]);

    if (validations.length) {
        return res.status(400).json({ errorMessages: validations });
    }

    const emailUsed = await (res.locals.prisma as PrismaClient).user.findFirst({
        where: { email },
    });

    if (emailUsed) {
        return res.status(400).json({
            errorFields: ['email'],
            errorMessage: 'Email already in use',
        });
    }

    try {
        // @TODO: `10` is some kind of number, idk what it is. should be researched.
        const hashedPassword: string = await bcrypt.hash(password, 10);

        const user = await res.locals.prisma.user.create({
            data: { firstName, lastName, email, hashedPassword },
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
