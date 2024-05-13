import { logger, Wiki } from "../managers/autoload";
import axios, { AxiosResponse } from "axios";
import _ from "lodash";

const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";

class WikiService {
    public async syncLatest(queryStr: string): Promise<any> {
        let query: any;

        let api: AxiosResponse = await axios
            .get(`${WIKI_API_URL}?${queryStr}`)
            .then((res: any) => res)
            .catch((err: any) => {
                throw err;
            });

        api = await this.handleApiResponse(api);

        if (
            !_.isNil(api.data) &&
            !_.isNil(api.data.query) &&
            !_.isNil(api.data.query.pages)
        ) {
            const pages: any = api.data.query.pages;
            const sets: any = [];

            await Object.keys(pages).forEach(async (e) => {
                sets.push({
                    filter: {
                        unique_pageid: pages[e].pageid,
                    },
                    update: {
                        pageid: pages[e].pageid,
                        index: pages[e].index,
                        title: pages[e].title,
                    },
                });
            });

            sets.sort((a: any, b: any) => a.update.index - b.update.index);

            query = await new Wiki({}).bulkWrite(sets);
        }

        if (!_.isNil(api.request)) {
            delete api.request;
        }

        return { api, query };
    }

    public async get(params: any, queryStr: string): Promise<any> {
        let result: any;

        let api: AxiosResponse = await axios
            .get(`${WIKI_API_URL}?${queryStr}`)
            .then((res: any) => res)
            .catch((err: any) => {
                throw err;
            });

        api = await this.handleApiResponse(api);

        if (!_.isNil(api.request)) {
            delete api.request;
        }

        return { api };
    }

    public async handleApiResponse(api: AxiosResponse): Promise<AxiosResponse> {
        if (api.status >= 200 && api.status <= 300) {
            return api;
        } else {
            throw api;
        }
    }
}

export { WikiService };
