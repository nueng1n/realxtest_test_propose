import { Writable } from "node:stream";
import { NextFunction, Request, Response } from "express";
import querystring from 'querystring';

class ReqWriteStream extends Writable {
    chunks: Buffer[];
    body: any;
    rawdata: string;
    reqHeaders: any;
    chunksSize: number;

    constructor({ highWaterMark, reqHeaders }: { highWaterMark: number, reqHeaders: any }) {
        super({ highWaterMark });

        this.chunks = [];
        this.body = '';
        this.rawdata = '';
        this.reqHeaders = reqHeaders;

        this.chunksSize = 0;
    }

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
        this.chunks.push(chunk);
        this.chunksSize += 1;
        callback();
    }

    async _final(callback: (error?: Error | null) => void) {
        this.rawdata = Buffer.concat(this.chunks).toString();

        if (this.reqHeaders['content-type']?.includes("application/json")) {
            try {
                this.body = JSON.parse(this.rawdata);
            } catch (err) {
                callback(err as any);
                return;
            }
        }else if (this.reqHeaders['content-type']?.includes('application/x-www-form-urlencoded')) {
            this.body = querystring.parse(this.rawdata, '&', '=');
        }

        callback();
    }

    _destroy(error: Error | null, callback: (error?: Error | null) => void) {
        if (error) {
            callback(error);
            return;
        }

        this.chunks = [];
        callback();
    }
}

function customParser(req: Request, res: Response, next: NextFunction) {
    const stream = new ReqWriteStream({ reqHeaders: req.headers, highWaterMark: 16 * 1024 });

    const contentTypes = ['application/json', 'application/x-www-form-urlencoded'];
    let found = false;

    if (req.headers['content-type']) {
        for (const item of contentTypes) {
            if (req.headers['content-type'].includes(item)) {
                found = true;
                break;
            }
        }
    }

    if (!found) {
        next();
    } else {
        req.pipe(stream);

        stream.on('error', (err) => {
            console.error('ReqWriteStream encountered an error:', err);
            next();
        });

        stream.on('finish', (err: any) => {
            if (err) {
                throw err;
            }

            req.body = stream.body;
            next();
        });
    }
}

export { customParser };
