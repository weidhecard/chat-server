import { Base } from "../managers/autoload";
import mongoose, { Document, Schema } from "mongoose";
import _ from "lodash";
import bcrypt from "bcryptjs";

interface IUser extends Document {
    handle: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: number | string;
    email: string;
    password: string;
    image: string;
    location: string;
    sso: IUserSSO;
}

interface IUserSSO {
    oauth_provider: string;
    access_token: string;
    authuser: string;
    expires_in: EpochTimeStamp;
    id_token: string;
    prompt: string;
    scope: string;
    state: string;
    token_type: string;
}

const ssoSchema = new mongoose.Schema<IUserSSO>(
    {
        oauth_provider: {
            type: String,
            required: true,
            trim: true,
            default: null,
        },
        access_token: {
            type: String,
            required: true,
            trim: true,
            default: null,
        },
        authuser: {
            type: String,
            required: true,
            trim: true,
            default: null,
        },
        expires_in: {
            type: Number,
            required: true,
            trim: true,
            default: null,
        },
        id_token: {
            type: String,
            required: true,
            trim: true,
            default: null,
        },
        prompt: {
            type: String,
            required: true,
            trim: true,
            default: null,
        },
        scope: {
            type: String,
            required: true,
            trim: true,
            default: null,
        },
        state: {
            type: String,
            required: true,
            trim: true,
            default: null,
        },
        token_type: {
            type: String,
            required: true,
            trim: true,
            default: null,
        },
    },
    { _id: true }
);

const schema = new mongoose.Schema<IUser>(
    {
        handle: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        username: {
            type: String,
            trim: true,
            unique: true,
            maxlength: [30, "Username should be less than 30 characters"],
        },
        firstName: {
            type: String,
            trim: true,
            required: true,
            default: "",
        },
        lastName: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            required: true,
            trim: true,
            sparse: true,
            validate: {
                validator: function(value: any) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: (props) => `${props.value} is not a valid email address`,
            },
        },
        phone: {
            type: String,
            required: false,
            trim: true,
            default: "",
            validate: {
                validator: function(value: any) {
                    if (value.length == 0) {
                        return true;
                    }
                    if (value.length < 5) {
                        return false;
                    }
                },
                message: (props) => `${props.value} must be 5 characters above`,
            },
        },
        password: {
            type: String,
            required: false,
            trim: true,
            default: null,
            minlength: [5, "must be 5 characters above"],
        },
        image: {
            type: String,
            required: false,
            trim: true,
            default: "",
            validate: {
                validator: function(value: any) {
                    if (value.includes("www.gravatar.com")) {
                        return true;
                    }
                    return /^(http|https):\/\/[^ "]+$/.test(value) && /\.(jpg|jpeg|png|gif|bmp)$/i.test(value);
                },
                message: (props) => `${props.value} is not a valid image url`,
            },
        },
        location: {
            type: String,
            trim: true,
            default: null,
        },
        sso: {
            type: ssoSchema,
            required: false,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

schema.methods.isValidPassword = function(password: string) {
    return bcrypt.compare(password, this.password);
};

schema.pre("save", async function(next: any) {
    if (this.password == null) {
        next();
    }

    if (!this.isModified("password")) {
        return next();
    }

    // Before Saving hash the password with bcrypt, using the default 10 rounds for salt
    if (this.password !== "" && this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } else {
        next();
    }
});

schema.pre("findOneAndUpdate", async function(next: any) {
    const query = (this as any)._update;
    if (query.password == null) {
        next();
    }

    // Before Saving hash the password with bcrypt, using the default 10 rounds for salt
    if (query.password !== "") {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(query.password, salt);
        query.password = hashedPassword;
        next();
    } else {
        next();
    }
});

class User extends Base {
    name: string = "User";
    static schema: any = schema;
    static model: any = mongoose.model(this.name, this.schema);
    static interface: IUser;

    constructor(obj: any) {
        super(obj);
    }
}

export { User };
