import { manifest, book } from "../types";

type searchHandler = (textToSearch: string) => Promise<book[]>;
type populateBookHandler = (requestedBook: book) => Promise<book>;

export type workerHandlers = {
    searchHandler?: searchHandler;
    populateBookHandler?: populateBookHandler;
};

class worker {
    manifest: manifest;
    handlers: workerHandlers;

    constructor(workerManifest: manifest, handlers: workerHandlers = {}) {
        this.manifest = Object.freeze(workerManifest);
        this.handlers = handlers;
    }
    validateHandlers() {
        if (this.handlers.populateBookHandler !== undefined)
            throw new Error("getBook handler is undefined");
        if (this.handlers.searchHandler !== undefined)
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

    start() {}
}
