import dotenv from "dotenv";
import { Mongoose } from "../src/managers/mongoose/mongoose";

dotenv.config();

const databaseConfig = {
    mongodb: {
        uri: process.env.DB_URL,
        options: {},
        manager: Mongoose,
    },
};

export { databaseConfig };
