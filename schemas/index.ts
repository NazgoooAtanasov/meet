import z from 'zod';

// @TODO: validations should be handled outside of the controller.

export const defaultTextField = z
    .string()
    .trim()
    .min(1, { message: 'Field should contain at least one character' });

export const emailSchema = z.string().email();

export const passwordSchema = z
    .string()
    .trim()
    .min(8, { message: 'The password should be at least 8 characters long.' });
