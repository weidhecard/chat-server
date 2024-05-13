import { MessageService, RoomService, Message, logger } from "../managers/autoload";
import { Server, Socket } from "socket.io";
import { Request, Response, NextFunction } from "express";
import moment from "moment";

class ChatController {
    private roomService: RoomService;
    private messageService: MessageService;

    constructor() {
        this.roomService = new RoomService();
        this.messageService = new MessageService();
    }

    public async getAll() {
        return await new Message({}).find({});
    }

    public send(req: Request, res: Response, next: NextFunction) {
        const { body } = req;
        try {
            const set = {
                userId: body.userId,
                from: body.from,
                message: body.message,
                time: body.time,
            };

            const result = this.messageService.create(set);

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }

    public async getRooms(req: Request, res: Response, next: NextFunction) {
        const { body } = req;
        try {
            const result = await this.roomService.getAll();

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }

    public async getMessages(req: Request, res: Response, next: NextFunction) {
        const { params } = req;
        try {
            const roomId = params && params.roomId ? params.roomId : null;
            const result = await this.messageService.get(roomId);

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export { ChatController };
