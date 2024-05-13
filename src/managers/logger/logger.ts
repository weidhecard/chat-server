import { logConfig } from "../autoload";
import { createLogger, transports } from "winston";
import fs from "fs";

// Create the log directory if it does not exist
if (!fs.existsSync(logConfig.logDirectory)) {
    fs.mkdirSync(logConfig.logDirectory);
}

const logger = createLogger({
    format: logConfig.format,
    transports: [
        new transports.File(logConfig.file),
        new transports.Console(logConfig.debug),
        new transports.Console(logConfig.error),
        new transports.Console(logConfig.warn),
    ],
});

export { logger };
