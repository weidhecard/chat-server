import { Base } from "../managers/autoload";
import mongoose, { Document, Schema } from "mongoose";
import _ from "lodash";

interface IRoom extends Document {
    subject: string;
    description: string;
    image: string;
}

const schema = new mongoose.Schema<IRoom>(
    {
        subject: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
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

class Room extends Base {
    name: string = "Room";
    static schema: any = schema;
    static model: any = mongoose.model(this.name, this.schema);
}

export { Room };
