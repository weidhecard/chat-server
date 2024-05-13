import { NextFunction, Response } from "express";

class ErrorHandler {
    public static default(err: any, res: Response, next: NextFunction) {
        if (err) {
            if (err instanceof ReferenceError) {
                res.status(500).send("Reference Error: " + err.message);
            } else {
                res.status(500).send("Insternal Server Error");
            }
        }
    }
}
export { ErrorHandler };
