import { databaseConfig } from "../autoload";
import { Connection } from "./connection";

class Mongoose {
    uri: any = databaseConfig.mongodb.uri;
    options: any = databaseConfig.mongodb.options;

    public initConnection() {
        return new Connection(this.uri, this.options);
    }
}

export { Mongoose };
