import { Base } from "../managers/autoload";
import mongoose, { Types } from "mongoose";
import _ from "lodash";
import { resourceLimits } from "node:worker_threads";

const { ObjectId } = mongoose.Types;

interface IMessage {
    userId: mongoose.Schema.Types.ObjectId;
    roomId: mongoose.Schema.Types.ObjectId;
    time: Date;
    message: string;
    externalEvent: Boolean;
}

const schema = new mongoose.Schema<IMessage>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        time: {
            type: Date,
            default: null,
        },
        message: {
            type: String,
            default: null,
        },
        externalEvent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        strict: false,
    }
);

class Message extends Base {
    name: string = "Message";
    static schema: any = schema;
    static model: any = mongoose.model(this.name, this.schema);

    constructor(param: Object) {
        super(param);
    }

    async getByRoomId(roomId: any) {
        const result = await Message.model.aggregate([
            {
                $lookup: {
                    from: "rooms",
                    localField: "roomId",
                    foreignField: "_id",
                    as: "room",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$room",
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    _id: 1,
                    time: 1,
                    message: 1,
                    externalEvent: 1,
                    user: {
                        _id: "$user._id",
                        firstName: "$user.firstName",
                        lastName: "$user.lastName",
                        phone: "$user.phone",
                        image: "$user.image",
                    },
                    room: {
                        _id: "$room._id",
                        subject: "$room.subject",
                    },
                },
            },
            {
                $match: {
                    "room._id": new ObjectId(roomId),
                },
            },
            {
                $sort: { created_at: 1 },
            },
        ]);
        return result;
    }
}

export { Message };
