import { logger } from "../managers/autoload";
import mongoose from "mongoose";
import _ from "lodash";

class Base {
    name: any;
    static schema: any;
    static model: any;

    model: any;
    child = this.constructor as any;

    constructor(param: Object) {
        this.model = _.isNil(param) ? this.child.model : this.child.model(param);
    }

    public async save(data: any = {}) {
        return await this.model.save(data);
    }

    public async update() {
        return await this.model.update();
    }

    public async find(data: any) {
        return await this.child.model.find(data);
    }

    public async findOne(data: any) {
        return await this.child.model.findOne(data);
    }

    public async findOneAndUpdate(filter: any, data: any, options: any) {
        return await this.child.model.findOneAndUpdate(filter, data, options);
    }

    public async insertMany(data = []) {
        return await this.model.insertMany(data);
    }

    public static async deleteMany(criteria = {}) {
        return await this.model.deleteMany(criteria).exec();
    }

    public async deleteMany(criteria = {}) {
        const result = await this.child.model
            .deleteMany(criteria)
            .exec()
            .then((deletedDocument: any) => {
                logger.info(JSON.stringify(deletedDocument));
            })
            .catch((err: any) => {
                throw err;
            });

        return result;
    }

    public async findByIdAndDelete(id: string) {
        const result = await this.child.model
            .findByIdAndDelete(id)
            .then((deletedDocument: any) => {
                logger.info(JSON.stringify(deletedDocument));
            })
            .catch((err: any) => {
                throw err;
            });

        return result;
    }

    public async bulkWrite(documents = [], upsert = true, ordered = false) {
        const session = await mongoose.startSession();

        session.startTransaction();

        logger.info("Transaction Started");

        try {
            const bulkOps = await documents.map(({ filter, update }) => ({
                updateOne: {
                    filter,
                    update: { $set: update },
                    upsert: upsert,
                    ordered: ordered,
                },
            }));

            const result = await this.child.model.bulkWrite(bulkOps);

            await session.commitTransaction();

            logger.info("Transaction committed successfully!");

            return result;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            await session.endSession();
        }
    }
}

export { Base };
