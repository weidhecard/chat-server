import { Base } from "../managers/autoload";
import mongoose from "mongoose";
import _ from "lodash";

const schema = new mongoose.Schema(
    {
        pageid: {
            type: Number,
            default: null,
            required: true,
        },
        index: {
            type: Number,
            default: null,
        },
        title: {
            type: String,
            default: null,
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

class Wiki extends Base {
    name: string = "Wiki";
    static schema: any = schema;
    static model: any = mongoose.model(this.name, this.schema);

    constructor(param: Object) {
        super(param);
    }
}

export { Wiki };
