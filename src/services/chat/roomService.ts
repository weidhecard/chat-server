import { logger, Room } from "../../managers/autoload";

class RoomService {
    constructor() {}

    public async get(set: any) {
        return await new Room(set).findOne({ _id: set.roomId });
    }

    public async getAll() {
        return await new Room({}).find({});
    }
}

export { RoomService };
