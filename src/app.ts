/** Node Dependencies */
import dotenv from "dotenv";
import OS from "os";
import http from "http";

/** Express Dependencies */
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import expressValidator from "express-validator";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import byteSize from "byte-size";

/** Configuration Dependencies */
import { logger, corsConfig, DatabaseService, MessageService, redisConfig } from "./managers/autoload";
import { SocketIo } from "./managers/autoload";
import { context } from "../config/context";
import { indexRouter } from "./routes/index";

dotenv.config();
(globalThis as any).context = context;

/** Connection */
const app = express();
const server = http.createServer(app);

// Socket IO
new SocketIo(server).init();
new MessageService().init();

/** Middlewares */
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

dotenv.config();

// Cors
app.use(cors(corsConfig.client));
app.options("*", cors());

// Redis: session, cache, rate limit
app.use(session(redisConfig.session));
app.use(redisConfig.rateLimit);

/** Routes */
app.use("/api", indexRouter);

/** Start running server */
server.listen(process.env.PORT, async () => {
    const maxHeaderSize = byteSize(http.maxHeaderSize, {
        units: "iec",
        precision: 2,
    });

    process.env.UV_THREADPOOL_SIZE = `${OS.cpus().length}`;

    logger.info("========================--SERVER--========================");
    logger.info(`Server Port: ${process.env.PORT}`);
    logger.info(`Original Core: ${OS.cpus().length}`);
    logger.info(`Current Core: ${process.env.UV_THREADPOOL_SIZE}`);
    logger.info(`Max Http Header Size: ${maxHeaderSize}`);
    logger.info(`----------------------------------------------------`);

    await new DatabaseService(process.env.DB_CONNECTION).bootstrap();

    logger.info("========================----------========================");
});

export { app };
