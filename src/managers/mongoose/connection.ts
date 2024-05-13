import { logger } from "../autoload";
import mongoose from "mongoose";

class Connection {
    protected connectionString: string;
    protected options: object;
    protected connected: boolean;

    constructor(connectionString: string, options = {}) {
        this.connectionString = connectionString;
        this.options = options;
        this.connected = false;
    }

    public async connect() {
        try {
            mongoose.Promise = global.Promise;
            mongoose.set("strictQuery", true);
            await mongoose.connect(this.connectionString, this.options);
            logger.info("Database: " + this.connectionString);
            this.connected = true;
        } catch (error) {
            logger.error("Failed to connect to MongoDB:", error);
            throw error;
        }
    }

    public async disconnect() {
        if (this.connected) {
            await mongoose.disconnect();
            logger.info("Disconnected from MongoDB");
            this.connected = false;
        }
    }
}

export { Connection };
