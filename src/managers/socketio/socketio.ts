import { logger, corsConfig } from "../autoload";
import { Server, Socket } from "socket.io";
import EventEmitter from "events";

class SocketIo {
    public io: Server;
    private static options: object = {
        cors: corsConfig.client,
    };
    public eventEmitter: any = null;

    constructor(server: any) {
        this.io = new Server(server, SocketIo.options);
        this.eventEmitter = new EventEmitter();
        this.eventEmitter.setMaxListeners(1000);
    }

    public init() {
        (globalThis as any).context.socketio.io = this.io;
        (globalThis as any).context.socketio.eventEmitter = this.eventEmitter;

        return this.io;
    }
}

export { SocketIo };
