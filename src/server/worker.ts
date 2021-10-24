import { manifest, book } from "../types";
import createWorkerRouter from "./router";

type searchHandler = (textToSearch: string) => Promise<book[]>;
type populateBookHandler = (requestedBook: book) => Promise<book>;

export type workerHandlers = {
    searchHandler?: searchHandler;
    populateBookHandler?: populateBookHandler;
};

class worker {
    manifest: manifest;
    handlers: workerHandlers;
    server: any;

    constructor(workerManifest: manifest, handlers: workerHandlers = {}) {
        this.manifest = Object.freeze(workerManifest);
        this.handlers = handlers;
    }
    validateHandlers() {
        if (this.handlers.populateBookHandler === undefined)
            throw new Error("populateBook handler is undefined");
        if (this.handlers.searchHandler === undefined)
            throw new Error("search handler is undefined");
    }

    setSearchHandler(handlerFunction: searchHandler): worker {
        this.handlers.searchHandler = handlerFunction;
        return this;
    }

    setGetBookHandler(handlerFunction: populateBookHandler): worker {
        this.handlers.populateBookHandler = handlerFunction;
        return this;
    }

    async startServer() {
        let options: any = {
            port: this.manifest.port ?? 3000,
            host: this.manifest.ip ?? "127.0.0.1",
        };

        let address = await this.server.listen(options);
        console.log(
            `Your ${this.manifest.name} worker is up and running on: ${address}`
        );
    }

    validateAndCreateServer() {
        this.validateHandlers();
        if (this.server === undefined)
            this.server = createWorkerRouter(this.handlers, this.manifest);
    }

    getServer() {
        this.validateAndCreateServer();
        return this.server;
    }

    async start() {
        try {
            this.validateAndCreateServer();
            this.startServer();
        } catch (err) {
            console.log("Could not start up worker!", err);
            process.exit(1);
        }
    }
}

const workerBuilder = (manifest: manifest, handlers?: workerHandlers) => {
    return new worker(manifest, handlers);
};

export default workerBuilder;
