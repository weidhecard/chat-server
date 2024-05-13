import chalk, { Color } from "chalk";
import winstonPkg from "winston";
import pkg from "moment";

const logDirectory = "storage/logs";
const datetime = new Date();

const { format } = winstonPkg;

interface Info {
    timestamp: EpochTimeStamp;
    level: string;
    message: string;
}

const colors: any = {
    error: "red",
    warn: "yellow",
    info: "cyan",
    debug: "green",
};

const logConfig = {
    logDirectory,
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.errors({ stack: true }),
        winstonPkg.format.printf((info) => {
            const { timestamp, level, message } = info as Info;
            const color: Color = colors[level] || "white";

            return `[${chalk.gray(
                pkg(timestamp).format("YYYY-MM-DD HH:mm:ss")
            )}][${chalk[color](level)}]: ${message}`;
        })
    ),
    file: {
        maxsize: 5120000,
        maxFiles: 5,
        filename: `${logDirectory}/log-${datetime
            .toISOString()
            .slice(0, 10)}.log`,
    },
    debug: {
        level: "debug",
        timestamp: true,
    },
    error: {
        level: "error",
        timestamp: true,
    },
    warn: {
        level: "warn",
        timestamp: true,
    },
};

export { logConfig };
