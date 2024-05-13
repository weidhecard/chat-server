import { UserService, logger } from "../../managers/autoload";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";
import HttpErrors from "http-errors";

class AuthController {
    private failMessage: string = "Authentication failed, please try again";

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public getToken(req: Request, res: Response, next: NextFunction) {
        const { secret_key } = req.body;

        if (secret_key !== process.env.SECRET_KEY) {
            const err = HttpErrors(this.failMessage, 401);
            next(err);
        }

        let token;

        try {
            token = {
                token: jwt.sign({ secret_key: secret_key }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" }),
            };
        } catch (err) {
            next(err);
        }

        res.status(200).send(token);
    }

    public async authenticate(req: any, res: Response, next: NextFunction) {
        const { body } = req;
        let result: any;

        try {
            const user = await this.userService.getByUserName(body.username);

            if (!user) {
                result = { message: `User ${body.username} not found` };

                res.status(404).json(result);
                return;
            }

            if (!body.username) {
                result = { message: `Invalid username / email` };
                res.status(401).json(result);
                return;
            }

            if (!body.password || body.password.length < 1) {
                result = { message: `Invalid password` };
                res.status(401).json(result);
                return;
            }

            const isPasswordMatch = await bcrypt.compare(body.password, user.password);

            if (isPasswordMatch) {
                result = {
                    userId: user._id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    email: user.email,
                    image: user.image,
                };

                const token = await this.userService.generateJWTToken({ result });

                result.token = token;

                req.session.user = result;

                logger.info("sessionID: " + req.sessionID + ", Logon successfully");

                res.status(200).json(result);
            } else {
                result = { message: `Invalid password` };

                res.status(401).json(result);
            }
        } catch (err) {
            next(err);
        }
    }

    public async authenticateSSO(req: any, res: Response, next: NextFunction) {
        const { body } = req;

        let result: any;

        try {
            const params = body.queryParams;

            const decodedToken = JSON.parse(atob(params.id_token.split(".")[1]));

            let user = await this.userService.getByUserEmail(decodedToken.email);

            const isExistedSSO = !_.isNil(user) && Object.keys(user.sso).length > 0;

            if (user && !isExistedSSO) {
                result = { message: `User ${decodedToken.email} already registered` };

                res.status(401).json(result);
                return;
            }

            const ssoSet = {
                oauth_provider: params.oauth_provider,
                access_token: params.access_token,
                authuser: params.authuser,
                expires_in: params.expires_in,
                id_token: params.id_token,
                prompt: params.prompt,
                scope: params.scope,
                state: params.state,
                token_type: params.token_type,
            };

            if (!user) {
                user = await this.userService.createSSO(decodedToken, ssoSet);
            }

            if (user && isExistedSSO) {
                user = await this.userService.updateSSO(decodedToken, ssoSet);
            }

            if (!user) {
                result = { message: `Invalid login` };
                res.status(401).json(result);
                return;
            }

            result = {
                userId: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                image: user.image,
                isSso: true,
            };

            const token = await this.userService.generateJWTToken({ result, idToken: user.sso.id_token });

            result.token = token;

            req.session.user = result;

            logger.info("sessionID: " + req.sessionID + ", SSO Logon successfully");

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }

    public async logout(req: any, res: Response, next: NextFunction) {
        try {
            req.session.destroy((err: any) => {
                if (err) {
                    res.status(500).json({ message: "Error logging out" });
                }
                if (!err) {
                    res.status(200).json({ message: "Logout successful" });
                }
            });
        } catch (err) {
            next(err);
        }
    }
}

export { AuthController };
