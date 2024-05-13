import dotenv from "dotenv";

dotenv.config();

const corsConfig = {
    client: {
        origin: process.env.CORE_CLIENT_URL,
        optionsSuccessStatus: 200, // Some legacy browsers choke on 204
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
};

export { corsConfig };
