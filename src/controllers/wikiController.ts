import { Wiki, WikiService } from "../managers/autoload";
import { Request, Response, NextFunction } from "express";
import querystring from "querystring";
import _ from "lodash";
import { AxiosResponse } from "axios";

type getAllReturn = {
    api: AxiosResponse;
    query: any;
};

type getReturn = {
    api: AxiosResponse;
};

class WikiController {
    private wikiService: WikiService;

    private getAllRequest: Record<string, any> = {
        action: "query",
        generator: "search",
        prop: "extracts", // pageimages
        gsrlimit: "10",
        gsrsearch: null,
        format: "json",
    };

    private getRequest: Record<string, any> = {
        action: "query",
        prop: "categories|categoryinfo|images|extlinks|info",
        pageids: null,
        format: "json",
    };

    constructor() {
        this.wikiService = new WikiService();
    }

    public async getAll(req: any, res: Response, next: NextFunction) {
        const { query } = req;
        let result: getAllReturn;

        try {
            this.getAllRequest.gsrsearch =
                !_.isNil(query) && !_.isNil(query.key) ? query.key : null;

            const queryStr = await querystring.stringify(this.getAllRequest);

            result = await this.wikiService.syncLatest(queryStr);

            res.status(200).send(result);
        } catch (err) {
            next(err);
        }
    }

    public async get(req: any, res: Response, next: NextFunction) {
        let result: getReturn;

        try {
            this.getRequest.pageids =
                !_.isNil(req) && !_.isNil(req.params) && !_.isNil(req.params.id)
                    ? req.params.id
                    : null;

            const queryStr: any = querystring.stringify(this.getRequest);

            result = await this.wikiService.get(this.getRequest, queryStr);

            res.status(200).send(result);
        } catch (err) {
            next(err);
        }
    }

    async deleteMany(req: any, res: Response, next: NextFunction) {
        const criteria = {
            $or: [{ index: { $ne: null } }, { page: { $ne: null } }],
        };

        try {
            const result = await new Wiki({}).deleteMany(criteria);

            res.status(200).send(result);
        } catch (err) {
            next(err);
        }
    }
}

export { WikiController };
