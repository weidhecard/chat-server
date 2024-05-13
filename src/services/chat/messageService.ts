import { logger, Message } from "../../managers/autoload";
import { Socket } from "socket.io";
import socketioJwt from "socketio-jwt";
import { MessageCore } from "./messageCore";

class MessageService extends MessageCore {
    public init() {
        // Server declaration
        const io = (globalThis as any).context.socketio.io;
        const eventEmitter = (globalThis as any).context.socketio.eventEmitter;

        // Auth declaration
        const socketJwtAuth = socketioJwt.authorize({
            secret: `${process.env.JWT_SECRET_KEY}`,
            handshake: true,
        });

        // Authenticate connection
        io.use(socketJwtAuth);

        // Open connection
        io.on("connection", (socket: Socket) => {
            this.setData(socket);

            let set = this.getData();

            socket.on("join-room", async (room: any) => {
                const userId = set.userId;

                // Action
                if (room.id) {
                    // Join room
                    socket.join(room.id);

                    // Set data
                    set.roomId = room.id;
                    set.message = `${set.from} has joined the group "${room.subject}"`;
                    set.time = new Date();
                    set.externalEvent = true;

                    // Add user
                    this.removeConnectUser(userId);
                    this.setConnectUser({
                        roomId: room.id,
                        userId: userId,
                        name: set.name,
                        image: set.image,
                    });
                    set.connectedUsers = this.getConnectUser(room.id);

                    // Emit event
                    io.to(room.id).emit("join-room", set);
                    io.to(room.id).emit("C" + userId + "-join-room");
                    io.to(room.id).emit("reload", set);
                    eventEmitter.emit("main-event", set);

                    // Save message
                    if (!room.rejoin) {
                        this.create(this.formatSend(set));
                    }
                }
            });

            socket.on("leave-room", async (room: any) => {
                const userId = set.userId;

                // Action
                if (room.id) {
                    // Remove user
                    this.removeConnectUser(userId);

                    // Set data
                    set.message = `${set.from} has left the group "${room.subject}"`;
                    set.externalEvent = true;
                    set.connectedUsers = this.getConnectUser(room.id);

                    // Emit events
                    io.to(room.id).emit("C" + userId + "-leave-room");
                    io.to(room.id).emit("chat-message", set);
                    io.to(room.id).emit("leave-room", set);
                    eventEmitter.emit("main-event", set);

                    this.create(this.formatSend(set));

                    // Leave room
                    socket.leave(room.id);
                }
            });

            socket.on("C" + set.userId + "-chat-send", (msg) => {
                const roomId = set.roomId;

                // Set data
                set.message = msg;
                set.externalEvent = false;

                // Action
                if (roomId) {
                    // Save message
                    this.create(this.formatSend(set));

                    // Emit events
                    io.to(roomId).emit("chat-message", set);
                    eventEmitter.emit("main-event", set);
                }
            });

            this.emitEvents(io, socket, eventEmitter, set);
            this.listFailEvents(io, socket, set);
        });
    }

    public async listFailEvents(io: any, socket: any, set: any) {
        socket.on("disconnect", () => {
            let roomId = set.roomId;
            const connectedUsers = this.getConnectUser(roomId);

            const inRoom = connectedUsers.filter((e: any) => {
                return e.userId == set.userId;
            });

            if (inRoom.length == 0) {
                roomId = null;
            }

            // Action
            if (roomId) {
                // Remove user
                this.removeConnectUser(set.userId);

                // Set data
                set.message = `${set.from} has disconnected`;
                set.externalEvent = true;

                // Emit events
                io.to(roomId).emit("reload", set);

                // Save message
                this.create(this.formatSend(set));
            }
        });
    }

    public async emitEvents(io: any, socket: any, eventEmitter: any, set: any) {
        eventEmitter.on("main-event", (msg: any) => {
            logger.info(msg.roomId + ": " + msg.message);
        });

        eventEmitter.on("reload", (msg: any) => {});
    }

    public async create(set: any) {
        return await new Message(set).save();
    }

    public async get(roomId: any) {
        const result = await new Message({}).getByRoomId(roomId);

        return result;
    }
}

export { MessageService };
