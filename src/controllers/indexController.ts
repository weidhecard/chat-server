import { logger } from "../managers/autoload";
import { Request, Response, NextFunction } from "express";
import path from "path";

class IndexController {
    static issuer: string;
    static authorization_endpoint: string;
    static token_endpoin: string;
    static userinfo_endpoint: string;

    constructor() {}

    public async index(req: Request, res: Response, next: NextFunction) {
        try {
            res.sendFile(path.join(process.cwd() + "/public/", "index.html"));
        } catch (err) {
            next(err);
        }
    }

    public async openIdConfig(req: any, res: Response, next: NextFunction) {
        try {
            const oidcConfig = {
                issuer: IndexController.issuer,
                authorization_endpoint: IndexController.authorization_endpoint,
                token_endpoint: IndexController.token_endpoin,
                userinfo_endpoint: IndexController.userinfo_endpoint,
            };
            res.json(oidcConfig);
        } catch (err) {
            next(err);
        }
    }
}

export { IndexController };
