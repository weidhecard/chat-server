import { logger, User } from "../managers/autoload";
import mongoose, { FilterQuery, MongooseError } from "mongoose";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import _ from "lodash";

class UserService {
    private static JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    private static tokenExpired = "1hr";

    public async get(query: Record<string, any> = {}): Promise<any> {
        const user = await new User({}).findOne(query);

        return user;
    }

    public async getByUserName(username: string): Promise<any> {
        const user: FilterQuery<any> = await new User({}).findOne({
            $or: [{ username: username }, { email: username }],
        });

        return user;
    }

    public async getByUserEmail(email: string): Promise<any> {
        const user = await new User({}).findOne({ email: email });

        return user;
    }

    public async getToken(userId: number): Promise<string> {
        const token = jwt.sign({ userId }, UserService.JWT_SECRET_KEY, {
            expiresIn: UserService.tokenExpired,
        });

        return token;
    }

    public async create(set: Object) {
        const result: any | MongooseError = await new User(set).save();

        return result;
    }

    public async createSSO(decodedToken: any, sso: Record<string, any>): Promise<User> {
        const userSet = {
            handle: decodedToken.email + "-" + sso.oauth_provider,
            username: null,
            firstName: decodedToken.name,
            lastName: "",
            email: decodedToken.email,
            phone: decodedToken.phone,
            password: null,
            image: decodedToken.picture,
            sso: sso,
            decodedToken,
        };

        return await new User(userSet).save({ validateBeforeSave: false });
    }

    public async updateProfile(_id: string, set: any): Promise<User> {
        const result = await new User({}).findOneAndUpdate({ _id }, set, { new: true, runValidators: true });

        return result;
    }

    public async updateSSO(decodedToken: any, sso: Record<string, any>): Promise<User> {
        const set = {
            handle: decodedToken.email + "-" + sso.oauth_provider,
            username: null,
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
            email: decodedToken.email,
            password: null,
            image: decodedToken.picture,
            sso: sso,
            decodedToken,
        };

        return await new User({}).findOneAndUpdate({ email: decodedToken.email, $ne: "sso._id" }, set, {
            new: true,
            runValidators: false,
        });
    }

    public async generateJWTToken(payload: any) {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: UserService.tokenExpired });
    }
}

export { UserService };
