import { NextFunction, Request, Response } from 'express';

export const assureAuth = (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!res.locals.userId)
        return res.status(401).json({
            errorMessage: 'Not authorized to perform this action.',
        });
    next();
};
