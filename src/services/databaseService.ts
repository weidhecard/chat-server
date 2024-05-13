import { databaseConfig } from "../managers/autoload";
import { SeederService } from "./seederService";
import { Constructor } from "vue/types/options";

class DatabaseService {
    private manager: any = null;
    private connection: any = null;
    private name: string = "";

    constructor(connName: any) {
        const manager: Constructor = (databaseConfig as any)[connName].manager;
        this.manager = new manager();
        this.name = connName;
    }

    public async connect() {
        this.connection = await this.manager.initConnection();
        await this.setSession();
        await this.connection.connect();
    }

    public async seed() {
        await SeederService.run();
    }

    public async setSession() {
        (globalThis as any).context.db.connection = this.connection;
        (globalThis as any).context.db.connectionName = this.name;
    }

    public async bootstrap() {
        await this.connect();
        await this.seed();
    }
}

export { DatabaseService };
