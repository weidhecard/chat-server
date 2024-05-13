import { UserService, logger } from "../../managers/autoload";
import { Request, Response, NextFunction } from "express";
import { MongooseError } from "mongoose";
import gravatar from "gravatar";
import slugify from "slugify";
import _ from "lodash";

class UserController {
    private userService: UserService;

    private static registerLabels: Record<string, string> = {
        handle: "Email",
        username: "Email",
        firstName: "First Name",
        lastName: "Last Name",
        password: "Password",
        email: "Email",
        phone: "Phone",
    };

    constructor() {
        this.userService = new UserService();
    }

    public async create(req: any, res: Response, next: NextFunction) {
        const { body } = req;

        try {
            const set = {
                handle: slugify(body.username),
                username: body.username,
                firstName: body.firstName,
                lastName: body.lastName ?? "",
                phone: body.phone ?? "",
                email: body.email,
                password: body.password,
                image: gravatar.url(body.email, {
                    s: "220",
                    r: "pg",
                    d: "identicon",
                }),
            };

            const result = await this.userService.create(set);

            res.status(200).send(result);
        } catch (err) {
            if (err && (err as any).code == 11000) {
                const dupKey = (err as any).message.match(/index: (.+?)_1/)[1];
                const key = UserController.registerLabels[dupKey];

                res.status(409).json({ key });
            }

            if (err && (err as any)._message == "User validation failed") {
                res.status(400).json("Invalid Details");
            }

            next(err);
        }
    }
}

export { UserController };
