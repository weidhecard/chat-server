import { logger } from "../../managers/autoload";
import { NextFunction } from "express";
import HttpErrors from "http-errors";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

class Authenticate {
    private static failMessage: string = "Api Authentication failed!";
    private static googleFailMessage: string = "Google Authentication failed!";
    private static googleTokenExpiredMessage: string = "Google Authentication Expired!";

    public static async check(req: Record<string, any>, res: Record<string, any>, next: NextFunction) {
        if (req.method === "OPTIONS") next();

        try {
            const token = req.headers.authorization.split(" ")[1];

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

            const currentTime = Math.floor(Date.now() / 1000);

            // Check jwt token expiry
            if (req.session.user && currentTime >= decodedToken.exp) {
                logger.error("sessionID: " + req.sessionID + ", Token Expired");

                res.status(401).json(Authenticate.googleTokenExpiredMessage);
                return next();
            }

            // Check sso expiry
            if (decodedToken.idToken) {
                await Authenticate.checkGoogle(req, decodedToken.idToken);
            }

            logger.info("sessionID: " + req.sessionID + ", Good Token");

            next();
        } catch (err) {
            logger.error("path: " + req.originalUrl + " sessionID: " + req.sessionID + ", " + Authenticate.failMessage);
            res.status(403).json(Authenticate.failMessage);
        }
    }

    public static async checkGoogle(req: any, idToken: string) {
        try {
            const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
            const client = new OAuth2Client(CLIENT_ID);

            const ticket = await client.verifyIdToken({
                idToken: idToken,
                audience: CLIENT_ID,
            });

            const payload: any = ticket.getPayload();

            // Check google expiry
            if (!payload || !payload.exp) {
                throw HttpErrors(403, Authenticate.googleFailMessage);
            }

            // Set sessions
            req.session.user.issueAtDate = new Date(payload.iat * 1000);
            req.session.user.expireDate = new Date(payload.exp * 1000);
            req.session.user.exp = payload.exp;

            return payload;
        } catch (err) {
            throw HttpErrors(403, Authenticate.googleFailMessage);
        }
    }
}

export { Authenticate };
