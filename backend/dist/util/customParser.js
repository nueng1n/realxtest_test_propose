"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customParser = void 0;
const node_stream_1 = require("node:stream");
const querystring_1 = __importDefault(require("querystring"));
class ReqWriteStream extends node_stream_1.Writable {
    constructor({ highWaterMark, reqHeaders }) {
        super({ highWaterMark });
        this.chunks = [];
        this.body = '';
        this.rawdata = '';
        this.reqHeaders = reqHeaders;
        this.chunksSize = 0;
    }
    _write(chunk, encoding, callback) {
        this.chunks.push(chunk);
        this.chunksSize += 1;
        callback();
    }
    _final(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.rawdata = Buffer.concat(this.chunks).toString();
            if ((_a = this.reqHeaders['content-type']) === null || _a === void 0 ? void 0 : _a.includes("application/json")) {
                try {
                    this.body = JSON.parse(this.rawdata);
                }
                catch (err) {
                    callback(err);
                    return;
                }
            }
            else if ((_b = this.reqHeaders['content-type']) === null || _b === void 0 ? void 0 : _b.includes('application/x-www-form-urlencoded')) {
                this.body = querystring_1.default.parse(this.rawdata, '&', '=');
            }
            callback();
        });
    }
    _destroy(error, callback) {
        if (error) {
            callback(error);
            return;
        }
        this.chunks = [];
        callback();
    }
}
function customParser(req, res, next) {
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
    }
    else {
        req.pipe(stream);
        stream.on('error', (err) => {
            console.error('ReqWriteStream encountered an error:', err);
            next();
        });
        stream.on('finish', (err) => {
            if (err) {
                throw err;
            }
            req.body = stream.body;
            next();
        });
    }
}
exports.customParser = customParser;
