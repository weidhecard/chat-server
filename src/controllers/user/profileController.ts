import { UserService, logger } from "../../managers/autoload";
import e, { Request, Response, NextFunction } from "express";
import { MongooseError } from "mongoose";
import _ from "lodash";
import bcrypt from "bcrypt";

class ProfileController {
    private userService: UserService;

    private static profileLabels: Record<string, string> = {
        handle: "Email",
        username: "Email",
        firstName: "First Name",
        lastName: "Last Name",
        password: "Password",
        email: "Email",
        phone: "Phone",
        image: "Image",
    };

    private static invalidMsg: string = "Invalid Details";
    private static incorrectPasswordMsg: string = "Incorrect current password";

    constructor() {
        this.userService = new UserService();
    }

    public async get(req: any, res: Response, next: NextFunction) {
        const { params } = req;
        let result: any;

        try {
            const userId = req.session.user && req.session.user.userId ? req.session.user.userId : null;
            const user = await this.userService.get({ userId });

            result = {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                image: user.image,
                sso_oauth_provider: user.sso.oauth_provider,
                sso_expires_in: user.sso.sso_expires_in,
            };

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }

    public async update(req: any, res: Response, next: NextFunction) {
        const { body } = req;
        let isPasswordUpdate = false;
        let set: any;

        try {
            const userId = req.session.user && req.session.user.userId ? req.session.user.userId : null;
            const currentProfile = await this.userService.get({ _id: userId });
            const isSso = !_.isNil(currentProfile.sso);

            if (!isSso) {
                const isPasswordMatch = await bcrypt.compare(body.currentPassword, currentProfile.password);
                set = {
                    username: body.username,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    email: body.email,
                    phone: body.phone,
                    image: body.image,
                };

                if (!_.isNil(_.trim(body.password)) && _.trim(body.password) !== "") {
                    set.password = body.password;
                    isPasswordUpdate = true;
                }

                if (isPasswordMatch) {
                    const update: any = await this.userService.updateProfile(userId, set);

                    res.status(200).json({
                        username: update.username,
                        firstName: update.firstName,
                        lastName: update.lastName,
                        email: update.email,
                        phone: update.phone,
                        image: update.image,
                        isPasswordUpdate: isPasswordUpdate,
                    });
                } else {
                    res.status(400).json(ProfileController.incorrectPasswordMsg);
                }
            }

            if (isSso) {
                set = {
                    username: body.username,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    email: body.email,
                    phone: body.phone,
                    image: body.image,
                };
                const update = await this.userService.updateProfile(userId, set);
                res.status(200).json(update);
            }

            res.status(500).json("Something has went wrong");
        } catch (err) {
            // Validate duplicates
            if (err && (err as any).code == 11000) {
                const dupKey = (err as any).message.match(/index: (.+?)_1/)[1];
                const key = ProfileController.profileLabels[dupKey];
                res.status(409).json({ key });
            }

            // Validate other details
            if (err && (err as any)._message == "Validation failed") {
                res.status(400).json(ProfileController.invalidMsg);
            }
        }
    }
}

export { ProfileController };
