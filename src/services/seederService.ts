import { logger, seedDefault, User, Room } from "../managers/autoload";
import gravatar from "gravatar";
import { describe } from "node:test";
import slugify from "slugify";

class SeederService {
    static async run() {
        await new Promise((f) => setTimeout(f, 1000));

        logger.info("Data seeding starting...");

        // await Room.deleteMany();

        // seedDefault.rooms.forEach(async (e: any) => {
        //     const set = {
        //         subject: e.subject,
        //         description: e.description,
        //         image: gravatar.url(e.subject, {
        //             s: "220",
        //             r: "pg",
        //             d: "identicon",
        //         }),
        //     };

        //     await new Room(set).save();
        // });

        // await User.deleteMany();

        // seedDefault.users.forEach(async (e: any) => {
        //     const userSet = {
        //         handle: slugify(e.username),
        //         username: e.username,
        //         firstName: e.firstName,
        //         lastName: e.lastName,
        //         email: e.email,
        //         phone: e.phone,
        //         password: e.password,
        //         image: gravatar.url(e.email, {
        //             s: "220",
        //             r: "pg",
        //             d: "identicon",
        //         }),
        //     };

        //     await new User(userSet).save();
        // });

        logger.info("Data seeding completed!");
    }
}

export { SeederService };
