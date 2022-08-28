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

export const validateFormatter = (
    accumulator: { name: string; errors: string }[],
    current: { name: string; validation: any }
) => {
    if (!current.validation.success) {
        const errors = current.validation.error.format()._errors.join(' ');
        accumulator.push({
            name: current.name,
            errors,
        });
    }

    return accumulator;
};
